# Quick Deployment Guide

## 1️⃣ Prerequisites Setup (5 minutes)

```bash
# Install tools
sudo apt update
sudo apt install -y wget unzip

# Install doctl
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

# Authenticate with DigitalOcean
doctl auth init  # Paste your API token
```

## 2️⃣ Deploy Infrastructure (15 minutes)

```bash
cd infra/terraform

# Create and edit config
cp terraform.tfvars.example terraform.tfvars
nano terraform.tfvars  # Add your DO token and settings

# Deploy
terraform init
terraform apply  # Type 'yes'

# Save outputs
terraform output > ../terraform-outputs.txt
```

## 3️⃣ Build & Push Images (10 minutes)

```bash
# Login to registry
doctl registry login

# Build and push all services
cd ../../backend
for service in api-gateway auth-service user-service store-service order-service payment-service delivery-service tracking-service notification-service; do
  docker build -t registry.digitalocean.com/bluecrate/$service:latest ./$service
  docker push registry.digitalocean.com/bluecrate/$service:latest
done

# Build frontend
cd ../web/nextjs-client
docker build -t registry.digitalocean.com/bluecrate/nextjs-client:latest .
docker push registry.digitalocean.com/bluecrate/nextjs-client:latest
```

## 4️⃣ Deploy to Kubernetes (5 minutes)

```bash
# Configure kubectl
doctl kubernetes cluster kubeconfig save bluecrate-cluster

# Update secrets in 00-namespace.yaml with Terraform outputs
cd ../../infra/k8s
nano 00-namespace.yaml  # Update DB_HOST, DB_PASS, REDIS_HOST, REDIS_PASSWORD

# Deploy
kubectl apply -f 00-namespace.yaml
kubectl apply -f 01-kafka.yaml
kubectl apply -f 02-api-gateway.yaml
kubectl apply -f 03-auth-service.yaml
kubectl apply -f 04-user-service.yaml
kubectl apply -f 05-backend-services.yaml
kubectl apply -f 06-frontend.yaml
kubectl apply -f 07-ingress.yaml

# Check status
kubectl get pods -n bluecrate -w
```

## 5️⃣ Setup CI/CD (5 minutes)

Add these secrets to GitHub (Settings → Secrets → Actions):
- `DIGITALOCEAN_ACCESS_TOKEN`
- `DB_HOST`, `DB_USER`, `DB_PASS`
- `REDIS_HOST`, `REDIS_PASSWORD`

Push to master branch to trigger deployment.

## 6️⃣ Configure Domain (Optional)

```bash
# Get load balancer IP
terraform output load_balancer_ip

# Add DNS records:
# A    @    -> <load_balancer_ip>
# A    www  -> <load_balancer_ip>
# A    api  -> <load_balancer_ip>
```

## 🎉 Done!

Access your app:
- Frontend: `http://<load_balancer_ip>`
- API: `http://<load_balancer_ip>:8000`

## 📊 Monitoring

```bash
# Check pods
kubectl get pods -n bluecrate

# View logs
kubectl logs -f deployment/api-gateway -n bluecrate

# Scale service
kubectl scale deployment api-gateway --replicas=3 -n bluecrate
```

## 💰 Monthly Cost: ~$164

## 🗑️ Cleanup

```bash
cd infra/terraform
terraform destroy  # Type 'yes'
```

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
