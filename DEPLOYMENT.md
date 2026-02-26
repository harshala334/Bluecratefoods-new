# BlueCrateFoods Deployment Guide - DigitalOcean

This guide walks you through deploying the BlueCrateFoods application to DigitalOcean using Kubernetes.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setup DigitalOcean Account](#setup-digitalocean-account)
3. [Deploy Infrastructure with Terraform](#deploy-infrastructure-with-terraform)
4. [Build and Push Docker Images](#build-and-push-docker-images)
5. [Deploy to Kubernetes](#deploy-to-kubernetes)
6. [Setup GitHub Actions CI/CD](#setup-github-actions-cicd)
7. [Configure Domain and SSL](#configure-domain-and-ssl)
8. [Monitoring and Maintenance](#monitoring-and-maintenance)

---

## Prerequisites

Before you begin, ensure you have:

- DigitalOcean account with billing enabled
- `doctl` CLI tool installed
- `kubectl` CLI tool installed
- `terraform` CLI tool installed
- Docker installed locally
- GitHub account (for CI/CD)

### Install Required Tools

```bash
# Install doctl (DigitalOcean CLI)
cd ~
wget https://github.com/digitalocean/doctl/releases/download/v1.98.0/doctl-1.98.0-linux-amd64.tar.gz
tar xf doctl-1.98.0-linux-amd64.tar.gz
sudo mv doctl /usr/local/bin

# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/

# Install Terraform
wget https://releases.hashicorp.com/terraform/1.5.7/terraform_1.5.7_linux_amd64.zip
unzip terraform_1.5.7_linux_amd64.zip
sudo mv terraform /usr/local/bin/

# Verify installations
doctl version
kubectl version --client
terraform version
```

---

## Setup DigitalOcean Account

### 1. Create API Token

1. Go to https://cloud.digitalocean.com/account/api/tokens
2. Click "Generate New Token"
3. Name it "bluecrate-deployment"
4. Enable both Read and Write scopes
5. Copy the token immediately (it won't be shown again)

### 2. Authenticate doctl

```bash
doctl auth init
# Paste your API token when prompted
```

### 3. Verify Authentication

```bash
doctl account get
```

---

## Deploy Infrastructure with Terraform

### 1. Navigate to Terraform Directory

```bash
cd infra/terraform
```

### 2. Create Variables File

```bash
cp terraform.tfvars.example terraform.tfvars
```

### 3. Edit `terraform.tfvars`

```hcl
do_token = "your_digitalocean_api_token_here"
region = "nyc1"  # Choose: nyc1, nyc3, sfo3, lon1, fra1, sgp1, etc.
domain_name = "yourdomain.com"  # Optional
certificate_name = ""  # We'll create this later
```

### 4. Initialize Terraform

```bash
terraform init
```

### 5. Plan Infrastructure

```bash
terraform plan
```

Review the resources that will be created:
- Kubernetes cluster (3 nodes)
- Managed PostgreSQL database
- Managed Redis cache
- Container registry
- Load balancer

### 6. Apply Infrastructure

```bash
terraform apply
```

Type `yes` when prompted. This will take 10-15 minutes.

### 7. Save Outputs

```bash
# Save all outputs to a file
terraform output > ../terraform-outputs.txt

# View specific outputs
terraform output postgres_host
terraform output postgres_password
terraform output redis_host
terraform output load_balancer_ip
```

**Important:** Save these values securely. You'll need them for Kubernetes secrets and GitHub Actions.

---

## Build and Push Docker Images

### 1. Connect to Container Registry

```bash
doctl registry login
```

### 2. Build and Push Backend Services

```bash
cd ../../backend

# Build and push each service
for service in api-gateway auth-service user-service store-service order-service payment-service delivery-service tracking-service notification-service; do
  echo "Building $service..."
  docker build -t registry.digitalocean.com/bluecrate/$service:latest ./$service
  docker push registry.digitalocean.com/bluecrate/$service:latest
done
```

### 3. Build and Push Frontend

```bash
cd ../web/nextjs-client

# Create Dockerfile if not exists
cat > Dockerfile << 'EOF'
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["npm", "start"]
EOF

# Build and push
docker build -t registry.digitalocean.com/bluecrate/nextjs-client:latest .
docker push registry.digitalocean.com/bluecrate/nextjs-client:latest
```

---

## Deploy to Kubernetes

### 1. Configure kubectl

```bash
doctl kubernetes cluster kubeconfig save bluecrate-cluster
```

### 2. Verify Connection

```bash
kubectl cluster-info
kubectl get nodes
```

### 3. Update Kubernetes Secrets

Edit `infra/k8s/00-namespace.yaml` and update the secrets section:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: database-credentials
  namespace: bluecrate
type: Opaque
stringData:
  DB_HOST: "<from terraform output postgres_host>"
  DB_USER: "doadmin"
  DB_PASS: "<from terraform output postgres_password>"
---
apiVersion: v1
kind: Secret
metadata:
  name: redis-credentials
  namespace: bluecrate
type: Opaque
stringData:
  REDIS_HOST: "<from terraform output redis_host>"
  REDIS_PASSWORD: "<from terraform output redis_password>"
```

### 4. Deploy All Resources

```bash
cd ../../infra/k8s

kubectl apply -f 00-namespace.yaml
kubectl apply -f 01-kafka.yaml
kubectl apply -f 02-api-gateway.yaml
kubectl apply -f 03-auth-service.yaml
kubectl apply -f 04-user-service.yaml
kubectl apply -f 05-backend-services.yaml
kubectl apply -f 06-frontend.yaml
kubectl apply -f 07-ingress.yaml
```

### 5. Wait for Pods to Start

```bash
kubectl get pods -n bluecrate -w
```

Press Ctrl+C when all pods show `Running` status.

### 6. Verify Deployment

```bash
# Check all pods
kubectl get pods -n bluecrate

# Check services
kubectl get services -n bluecrate

# Check ingress
kubectl get ingress -n bluecrate

# View logs of a specific service
kubectl logs -n bluecrate deployment/api-gateway
```

---

## Setup GitHub Actions CI/CD

### 1. Add GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add the following secrets:

- `DIGITALOCEAN_ACCESS_TOKEN`: Your DigitalOcean API token
- `DB_HOST`: PostgreSQL host (from Terraform output)
- `DB_USER`: `doadmin`
- `DB_PASS`: PostgreSQL password (from Terraform output)
- `REDIS_HOST`: Redis host (from Terraform output)
- `REDIS_PASSWORD`: Redis password (from Terraform output)

### 2. Test Deployment

Push code to the master branch:

```bash
git add .
git commit -m "Setup deployment infrastructure"
git push origin master
```

Go to GitHub → Actions tab to watch the deployment progress.

---

## Configure Domain and SSL

### 1. Point Domain to Load Balancer

Get your load balancer IP:

```bash
terraform output load_balancer_ip
```

Add DNS records in your domain provider:

```
A    @              -> <load_balancer_ip>
A    www            -> <load_balancer_ip>
A    api            -> <load_balancer_ip>
```

### 2. Install cert-manager

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
```

### 3. Create ClusterIssuer

```bash
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

### 4. Update Ingress with Your Domain

Edit `infra/k8s/07-ingress.yaml` and replace `bluecrate.com` with your domain.

### 5. Reapply Ingress

```bash
kubectl apply -f infra/k8s/07-ingress.yaml
```

SSL certificates will be automatically provisioned in a few minutes.

---

## Monitoring and Maintenance

### Check Application Status

```bash
# All pods
kubectl get pods -n bluecrate

# Specific service logs
kubectl logs -f -n bluecrate deployment/api-gateway

# Events
kubectl get events -n bluecrate --sort-by='.lastTimestamp'
```

### Scale Services

```bash
# Scale a specific service
kubectl scale deployment api-gateway --replicas=3 -n bluecrate

# Auto-scaling
kubectl autoscale deployment api-gateway --min=2 --max=10 --cpu-percent=80 -n bluecrate
```

### Database Management

```bash
# Connect to PostgreSQL
doctl databases connection postgres bluecrate-postgres

# Create a backup
doctl databases backups create <database-id>
```

### Update Application

```bash
# Build new image
docker build -t registry.digitalocean.com/bluecrate/api-gateway:v2 ./backend/api-gateway
docker push registry.digitalocean.com/bluecrate/api-gateway:v2

# Update deployment
kubectl set image deployment/api-gateway api-gateway=registry.digitalocean.com/bluecrate/api-gateway:v2 -n bluecrate

# Or use GitHub Actions by pushing to master branch
```

### Cost Monitoring

Monitor your DigitalOcean costs:
- Kubernetes Cluster: ~$72/month (3 x $24 nodes)
- PostgreSQL Database: ~$60/month
- Redis Cache: ~$15/month
- Load Balancer: ~$12/month
- Container Registry: ~$5/month
- **Total: ~$164/month**

---

## Troubleshooting

### Pods Not Starting

```bash
kubectl describe pod <pod-name> -n bluecrate
kubectl logs <pod-name> -n bluecrate
```

### Database Connection Issues

1. Verify secrets are correct:
```bash
kubectl get secret database-credentials -n bluecrate -o yaml
```

2. Check if PostgreSQL allows external connections
3. Verify database names exist

### Ingress Not Working

```bash
# Check ingress status
kubectl describe ingress bluecrate-ingress -n bluecrate

# Check nginx ingress controller
kubectl get pods -n kube-system | grep ingress
```

### Out of Memory

Increase resource limits in deployment YAML:

```yaml
resources:
  requests:
    memory: "512Mi"
  limits:
    memory: "1Gi"
```

---

## Clean Up (Destroy Infrastructure)

To remove all resources and stop billing:

```bash
cd infra/terraform
terraform destroy
```

Type `yes` when prompted. This will delete:
- Kubernetes cluster
- Databases
- Load balancer
- All associated resources

---

## Next Steps

1. ✅ Setup monitoring with Prometheus/Grafana
2. ✅ Configure backups for PostgreSQL
3. ✅ Setup log aggregation
4. ✅ Configure alerts for downtime
5. ✅ Setup staging environment
6. ✅ Implement blue-green deployments

For support, open an issue on GitHub or contact the team.
