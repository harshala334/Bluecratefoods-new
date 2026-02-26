# BlueCrateFoods
A fully scalable delivery platform with microservices architecture, real-time tracking, and mobile + web apps — now evolving into a **smart ingredient-delivery + guided cooking ecosystem**, inspired by Zomato/Zepto but with an innovative twist.

---

# 🌟 Vision — "Pick Dish → Get Ingredients → Cook Confidently"

BlueCrateFoods is not just a delivery app; it's a **smart cooking assistant**.

Users can:

- Browse dishes by categories:
  - **⏱️ <1 min**
  - **⏱️ <10 min**
  - **⏱️ <1 hr**
- Select a dish → view required ingredients
- Choose ingredients with **checkbox selections**
- Set **number of people** → auto-adjust ingredient quantities
- Follow **step-by-step recipe guidance** with:
  - timers  
  - progress tracking  
  - reminders & alerts  
- Add selected ingredients to cart and checkout like any modern delivery app

This creates a frictionless experience for home cooks, busy individuals, and beginners.

---

# Key Microservices

- Auth Service  
- User Service  
- Store Service  
- Order Service  
- Payment Service  
- Delivery Partner Service  
- Tracking Service (WebSockets)  
- Notification Service (FCM/SMS)  
- Admin Panel  
- **Recipe & Ingredients Service (NEW)**  

---

# BlueCrateFoods — GitHub Repository Structure

```bash
BlueCrateFoods/
├── README.md
├── .gitignore
├── docker-compose.yml
├── infra/
│   ├── terraform/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── k8s/
│       ├── deployment.yaml
│       ├── service.yaml
│       └── ingress.yaml
├── backend/
│   ├── api-gateway/
│   │   ├── src/
│   │   ├── package.json
│   │   └── Dockerfile
│   ├── auth-service/
│   │   ├── src/
│   │   ├── package.json
│   │   └── Dockerfile
│   ├── user-service/
│   ├── store-service/
│   ├── order-service/
│   ├── payment-service/
│   ├── delivery-service/
│   └── tracking-service/
├── mobile/
│   ├── user-app/
│   │   └── (Kotlin/Swift/React Native project)
│   └── partner-app/
├── web/
│   └── nextjs-client/
│       ├── pages/
│       ├── components/
│       ├── public/
│       ├── package.json
│       └── Dockerfile
└── scripts/
    ├── deploy.sh
    └── setup.sh
```

---

## Architecture Overview
```
Frontend → API Gateway → Microservices → PostgreSQL/MongoDB → Redis → Kafka → DigitalOcean
```


## Tech Stack
**Frontend:** Kotlin, Swift, React/Next.js

**Backend:** Node.js (NestJS) or Go

**Database:** PostgreSQL, MongoDB

**Cache:** Redis

**Messaging:** Kafka / RabbitMQ

**Hosting:** DigitalOcean (upgradeable to AWS/GCP anytime)

---

# Frontend User Flow

## 1️⃣ Category Selection  
Users see dish categories by preparation time:  
- <1 min  
- <10 min  
- <1 hr  

## 2️⃣ Dish List Page  
Displays dish cards with:
- Image  
- Difficulty  
- Time required  

## 3️⃣ Dish Detail Page  
Includes:
- Ingredient list with checkboxes  
- Auto-calculation for serving size  
- Step-by-step recipe monitoring  
- Timers built into UI  

## 4️⃣ Checkout  
- Ingredients added to cart  
- Razorpay payment  
- Delivery partner assignment  
- Real-time tracking  

---

## Microservices Folder Structure
```
backend/
├── auth-service
├── user-service
├── order-service
├── payment-service
├── store-service
├── delivery-service
├── tracking-service
└── notification-service
```

Each service contains:
```
src/
Dockerfile
package.json
.env.example
```

---

## Docker Setup
Run all services using Docker Compose:
```bash
docker-compose up --build
```

---

## API Gateway (NestJS Example)
```ts
@Controller('api')
export class AppController {
  @Get('health')
  healthCheck() {
    return { status: 'ok' };
  }
}
```

---

## Real-Time Tracking (WebSockets)
```ts
@WebSocketGateway()
export class TrackingGateway {
  @SubscribeMessage('location')
  handleLocation(client: any, payload: any) {
    // broadcast to user
  }
}
```

---

## Deployment (DigitalOcean)
### 1. Push code to GitHub
### 2. Connect to DigitalOcean App Platform or Droplets
### 3. Configure:
- Managed PostgreSQL
- Managed Redis
- Load Balancer
- Domain (GoDaddy → DO DNS)

### 4. Deploy with CI/CD (GitHub Actions)

```yaml
name: Deploy Backend
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - run: docker build -t backend ./backend
    - run: doctl apps create-deployment <APP-ID>
```

---

## Environment Variables
Create `.env` inside each service:
```
DB_URL=postgres://user:pass@host/db
REDIS_URL=redis://host
JWT_SECRET=your_secret
PAYMENT_KEY=rzp_key
```

---

## Scaling Readiness
- Horizontal auto-scaling
- Read replicas for Postgres
- Redis caching for hot data
- Kafka for async messaging
- CDN for static assets

