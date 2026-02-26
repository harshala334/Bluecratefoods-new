# 🌐 GoDaddy DNS Setup for bluecratefoods.com

## Your Load Balancer IP Address
```
178.128.133.196
```

---

## Step-by-Step GoDaddy DNS Configuration

### 1. Login to GoDaddy
- Go to: https://dcc.godaddy.com/
- Login with your credentials
- Navigate to "My Products" → "Domains"
- Click on **bluecratefoods.com**

### 2. Manage DNS Settings
- Click **DNS** or **Manage DNS** button
- You'll see a list of DNS records

### 3. Add/Update DNS A Records

Delete any existing A records and add these:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 178.128.133.196 | 600 seconds (or default) |
| A | api | 178.128.133.196 | 600 seconds (or default) |
| CNAME | www | bluecratefoods.com. | 600 seconds (or default) |

**Explanation:**
- `@` = Root domain (bluecratefoods.com)
- `www` = www.bluecratefoods.com
- `api` = api.bluecratefoods.com

### 4. Save Changes
- Click **Save** or **Save Changes**
- DNS propagation takes 10 minutes to 48 hours (usually 1-2 hours)

---

## Visual Guide for GoDaddy:

```
┌─────────────────────────────────────────────────────┐
│ DNS Management for bluecratefoods.com               │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Type  │ Name   │ Value              │ TTL          │
│──────────────────────────────────────────────────  │
│ A     │ @      │ 129.212.136.117 │ 600 seconds  │
│ CNAME │ www    │ bluecratefoods.com. │ 600 seconds  │
│ A     │ api    │ 129.212.136.117 │ 600 seconds  │
│                                                     │
│ [Add Record] [Save]                                 │
└─────────────────────────────────────────────────────┘
```

---

## Testing DNS Propagation

### After adding DNS records, test with:

```bash
# Test root domain
nslookup bluecratefoods.com

# Test www subdomain
nslookup www.bluecratefoods.com

# Test api subdomain
nslookup api.bluecratefoods.com

# Or use dig
dig bluecratefoods.com +short
dig www.bluecratefoods.com +short
dig api.bluecratefoods.com +short
```

**Expected output:** `178.128.133.196`

---

## Deploy Updated Ingress Configuration

Once DNS is configured, deploy the updated ingress:

```bash
cd /home/harshala/BlueCrateFoods/infra/k8s

# Apply the updated ingress with your domain
kubectl apply -f 07-ingress.yaml

# Check ingress status
kubectl get ingress -n bluecrate

# Wait for SSL certificate (takes 2-5 minutes after DNS propagates)
kubectl describe ingress bluecrate-ingress -n bluecrate
```

---

## Install Cert-Manager for SSL (If Not Already Installed)

```bash
# Install cert-manager for automatic SSL certificates
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create Let's Encrypt cluster issuer
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com  # CHANGE THIS TO YOUR EMAIL
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

---

## Install Nginx Ingress Controller (If Not Already Installed)

```bash
# Install nginx ingress controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/do/deploy.yaml

# Wait for it to be ready
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=120s
```

---

## Expected Timeline

| Step | Time | Status |
|------|------|--------|
| Add DNS records in GoDaddy | 5 min | ⏳ You do this |
| DNS propagation | 1-2 hours | ⏳ Automatic |
| Apply ingress config | 1 min | ⏳ Run kubectl apply |
| SSL certificate issued | 5 min | ⏳ Automatic (after DNS works) |
| **Site live with HTTPS** | **~2 hours total** | ✅ |

---

## Your URLs After Setup

### Frontend (Customer Site):
- https://bluecratefoods.com
- https://www.bluecratefoods.com

### API Gateway:
- https://api.bluecratefoods.com

### Current Access (Before DNS):
- http://167.99.239.68:3000 (Frontend)
- http://167.99.239.68 (API)

---

## Troubleshooting

### DNS Not Working?
```bash
# Check if DNS has propagated
dig bluecratefoods.com +short

# If it doesn't show 167.99.239.68, wait longer
# Or check: https://www.whatsmydns.net/#A/bluecratefoods.com
```

### SSL Certificate Not Issued?
```bash
# Check cert-manager logs
kubectl logs -n cert-manager -l app=cert-manager

# Check certificate status
kubectl get certificate -n bluecrate
kubectl describe certificate bluecrate-tls -n bluecrate
```

### Ingress Not Working?
```bash
# Check ingress controller
kubectl get pods -n ingress-nginx

# Check ingress logs
kubectl logs -n ingress-nginx -l app.kubernetes.io/component=controller
```

---

## Quick Commands Summary

```bash
# 1. Apply updated ingress
kubectl apply -f /home/harshala/BlueCrateFoods/infra/k8s/07-ingress.yaml

# 2. Check status
kubectl get ingress -n bluecrate
kubectl get certificate -n bluecrate

# 3. Test DNS
dig bluecratefoods.com +short

# 4. Watch certificate issuance
kubectl get certificate -n bluecrate -w
```

---

## Need Help?

- GoDaddy DNS Help: https://www.godaddy.com/help/manage-dns-records-680
- Let's Encrypt: https://letsencrypt.org/docs/
- Cert-Manager: https://cert-manager.io/docs/

---

**🎉 Once DNS propagates and SSL is issued, your site will be live at:**
**https://bluecratefoods.com**
