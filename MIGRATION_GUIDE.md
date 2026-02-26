# Migration Guide: DigitalOcean -> Google Cloud Platform

This guide will help you migrate your BlueCrateFoods infrastructure to GCP.

## Prerequisites

1.  **GCP Account**: Ensure you have a Google Cloud Platform account with billing enabled.
2.  **Google Cloud SDK**: Install `gcloud` CLI.
3.  **Terraform**: Ensure Terraform is installed.
4.  **kubectl**: Ensure kubectl is installed.

## Step 1: GCP Project Setup

1.  Create a new Project in GCP Console.
2.  Note the **Project ID** (e.g., `bluecrate-12345`).
3.  Enable Billing for this project.

## Step 2: Configure Infrastructure (Terraform)

1.  Navigate to the terraform directory:
    ```bash
    cd infra/terraform
    ```
2.  Create a `terraform.tfvars` file:
    ```hcl
    project_id   = "bluecratefoods"
    region       = "us-central1"
    zone         = "us-central1-a"
    db_password  = "SECURE_PASSWORD_HERE"
    ```
3.  Authenticate with GCP:
    ```bash
    gcloud auth application-default login
    ```
4.  Initialize and Apply:
    ```bash
    terraform init
    terraform apply
    ```
    Type `yes` to confirm. This will take ~15-20 minutes.

5.  **Save Outputs**:
    ```bash
    terraform output > ../terraform-outputs.txt
    ```

## Step 3: Configure Kubernetes Access

1.  Connect kubectl to your new GKE cluster:
    ```bash
    gcloud container clusters get-credentials bluecrate-cluster --region us-central1-a
    ```

## Step 4: Build and Push Images

1.  Configure Docker to push to GCP Artifact Registry:
    ```bash
    gcloud auth configure-docker us-central1-docker.pkg.dev
    ```
2.  Build and push your services. **Update the build script first** (see below) or run manually:
    ```bash
    # Example for API Gateway
    docker build -t us-central1-docker.pkg.dev/bluecratefoods/bluecrate/api-gateway:latest ./backend/api-gateway
    docker push us-central1-docker.pkg.dev/bluecratefoods/bluecrate/api-gateway:latest
    ```
    *Repeat for all services.*

## Step 5: Update Kubernetes Secrets & Manifests

You need to update your deployment files to use the new image paths and database connection details.

1.  **Update Images**: Change `registry.digitalocean.com/bluecrate/...` to `us-central1-docker.pkg.dev/bluecratefoods/bluecrate/...` in all `infra/k8s/*.yaml` files.
2.  **Update Secrets**:
    Edit `infra/k8s/00-namespace.yaml` with the new DB host and password from `terraform-outputs.txt`.

## Step 6: Deploy

```bash
cd ../k8s
kubectl apply -f .
```

## Step 7: DNS Update

1.  Get the External IP of your Nginx Ingress:
    ```bash
    kubectl get service ingress-nginx-controller -n ingress-nginx
    # OR if using the LoadBalancer service defined in 08-loadbalancer.yaml (not recommended for prod, better use Ingress Controller):
    kubectl get svc -n bluecrate
    ```
2.  Update your Domain Provider (GoDaddy record) records to point to this new IP.
