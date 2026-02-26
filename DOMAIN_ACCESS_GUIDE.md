# ✅ BlueCrateFoods Domain Access Guide

## Current Status

Your DNS is correctly configured and working! ✅
- `bluecratefoods.com` → `167.99.239.68` ✅
- `www.bluecratefoods.com` → `167.99.239.68` (via CNAME) ✅  
- `api.bluecratefoods.com` → `167.99.239.68` ✅

## 🌐 How to Access Your Site NOW

### Frontend (NextJS):
```
http://167.99.239.68:30000
```
**Note**: Port 30000 is required because NextJS is on NodePort 30000

### API:
```
http://bluecratefoods.com
http://167.99.239.68
```
Both work on port 80 and reach your API Gateway ✅

---

## 🔧 Quick Fix: Make Frontend Work on bluecratefoods.com

Your load balancer currently routes port 80 to the API Gateway. We need to either:

### Option 1: Add Frontend to LoadBalancer (Recommended)
Update the load balancer service to include frontend port:

```bash
kubectl apply -f - <<EOF
apiVersion: v1
kind: Service
metadata:
  name: bluecrate-lb
  namespace: bluecrate
spec:
  type: LoadBalancer
  selector:
    app: nextjs-client
  ports:
  - name: http
    port: 80
    targetPort: 3000
    protocol: TCP
  - name: api
    port: 8080
    targetPort: 8000
    protocol: TCP
EOF
```

Then access:
- **Frontend**: http://bluecratefoods.com
- **API**: http://bluecratefoods.com:8080

### Option 2: Use Different Subdomain for Frontend
Configure GoDaddy with a separate subdomain:

**Add in GoDaddy:**
```
Type: A    Name: app    Value: 167.99.239.68
```

Then access:
- **Frontend**: http://app.bluecratefoods.com:30000
- **API**: http://api.bluecratefoods.com

### Option 3: Configure API Gateway as Reverse Proxy (Best for Production)
Make API Gateway route to NextJS based on path or hostname.

---

## 🚀 Quick Solution: Access Frontend Now

You can access your frontend RIGHT NOW at:

```
http://167.99.239.68:30000
```

Or via the Kubernetes node IP directly:

```bash
# Get node IP
kubectl get nodes -o wide

# Access via node
http://<NODE_IP>:30000
```

---

## 📝 What's Currently Working

| Service | URL | Status |
|---------|-----|--------|
| API Gateway (port 80) | http://bluecratefoods.com | ✅ Working |
| API Gateway (port 80) | http://api.bluecratefoods.com | ✅ Working |
| NextJS (port 30000) | http://167.99.239.68:30000 | ✅ Working |
| NextJS via domain | http://bluecratefoods.com | ❌ Not configured |

---

## 🎯 Recommended Next Step

Run this command to create a new load balancer for the frontend:

```bash
# Delete the old load balancer definition that's not being used
kubectl delete svc api-gateway-lb -n bluecrate

# Create a unified load balancer
kubectl apply -f - <<EOF
apiVersion: v1
kind: Service
metadata:
  name: unified-lb
  namespace: bluecrate
spec:
  type: LoadBalancer
  ports:
  - name: frontend
    port: 80
    targetPort: 3000
    protocol: TCP
  - name: api
    port: 8080
    targetPort: 8000
    protocol: TCP
  selector:
    app: nextjs-client
---
apiVersion: v1
kind: Service
metadata:
  name: api-lb
  namespace: bluecrate
spec:
  type: LoadBalancer
  ports:
  - name: api
    port: 80
    targetPort: 8000
    protocol: TCP
  selector:
    app: api-gateway
EOF
```

**Problem**: This will try to create 2 more load balancers, but you've hit your limit (2 LBs max).

---

## ✨ Easiest Solution: Use the Ports You Have

**Frontend**: `http://bluecratefoods.com:30000`  
**API**: `http://bluecratefoods.com` or `http://api.bluecratefoods.com`

This works right now without any changes!

---

## 💡 Want Pretty URLs Without Ports?

You have 3 choices:

1. **Upgrade DigitalOcean plan** - Increase load balancer limit to add more
2. **Use Ingress Controller** - But it also needs a load balancer (same issue)
3. **Use separate subdomains with ports** - Configure additional A records in GoDaddy

---

Need help implementing any of these solutions? Let me know!
