# Fruit & Vegetable Powder E-Commerce — V1 Specification

## 1. Purpose

Build a production-oriented V1 e-commerce application for a fruit and vegetable powder manufacturing business. Customers can browse products without logging in, add products to a cart, authenticate at checkout, pay online, and view their orders. Administrators can manage products and orders through a protected admin portal.

V1 is intentionally designed as a **modular monolith** so that future features can be added without committing to microservices prematurely.

## 2. V1 Scope

### Customer features
- Browse products without authentication
- Product listing and product detail pages
- Product search/filtering
- Add to cart
- Update quantity and remove cart items
- Checkout
- Customer authentication using:
  - Google Sign-In via OpenID Connect (OIDC)
  - Email OTP
- Customer profile/basic account information
- Delivery address
- Online payment through Razorpay
- Order confirmation
- Customer order history

### Admin features
- Admin Portal entry from the public site footer
- Separate admin login page at `/admin/login`
- Admin authentication using email + password
- Protected admin dashboard
- Product create/edit/deactivate/delete
- Product price and stock management
- Product image upload
- View customer orders
- View order details
- Update order status
- Basic sales/order dashboard

### Explicitly out of V1
- Kafka
- Complex microservices
- Recommendation engine
- Coupons/discount engine
- Reviews/ratings
- Loyalty points
- Referral system
- Delivery tracking integration
- SMS/phone OTP
- Advanced analytics
- Multi-vendor functionality

## 3. Technology Stack

| Area | V1 Decision |
|---|---|
| Frontend | React + TypeScript |
| Backend | Spring Boot |
| API | REST |
| Database | PostgreSQL |
| Security | Spring Security |
| Customer Auth | Google OIDC + Email OTP |
| Admin Auth | Email + Password |
| Application Token | JWT |
| Password Hashing | BCrypt |
| Object Storage - Development | MinIO |
| Object Storage - Production | Amazon S3 |
| Payment Gateway | Razorpay |
| Containers | Docker |
| Version Control | Git + GitHub |
| Reverse Proxy | Nginx if useful in deployment |
| Cache | Not required initially |
| Redis | Future enhancement |
| Messaging | Not required initially |
| Cloud | Production cloud deployment |

## 4. Architecture

V1 uses a **modular monolith**.

```text
                         Internet
                            |
                         React App
                     /               \
              Customer UI          Admin UI
                     \               /
                      HTTPS / REST
                            |
                     Spring Boot API
                            |
       +--------------------+--------------------+
       |                    |                    |
     Auth                 Product              Order
     Cart                Payment               Admin
       |                    |                    |
       +--------------------+--------------------+
                            |
                       PostgreSQL

External integrations:
- Google OIDC
- Razorpay
- MinIO (development)
- Amazon S3 (production)
- Email delivery provider (production OTP)
```

The backend should be organized by business module rather than as one large package.

Suggested structure:

```text
backend/
└── src/main/java/com/company/ecommerce/
    ├── auth/
    ├── user/
    ├── product/
    ├── cart/
    ├── order/
    ├── payment/
    ├── admin/
    ├── storage/
    └── common/
```

## 5. Authentication and Authorization

### Customer authentication

Customers do not need to log in to browse products.

Authentication is requested when checkout requires an identified customer.

Two customer login options are provided:

1. **Google Sign-In using OpenID Connect (OIDC)**
2. **Email + OTP**

Both authentication methods ultimately result in the application issuing its own JWT.

```text
Google OIDC
     |
     v
Identity verified
     |
     +----+
          |
Email OTP | 
     |    |
     v    v
Application authentication
          |
          v
       JWT issued
          |
          v
Spring Security authorization
```

Important distinction:
- OIDC/OTP = authentication
- JWT = application session/access token
- Spring Security = security framework and authorization enforcement

### Email OTP

For development, real email delivery is not required. The OTP can be logged or delivered through a local development mail server.

For production, an email delivery provider should be used. Provider charges/free-tier limits are separate from development.

OTP should not be stored in the `users` table. A temporary OTP store/table can be used initially; Redis can be introduced later for TTL-based OTP storage and rate limiting.

### Admin authentication

Admin authentication is deliberately separate from customer authentication.

```text
Public Website
      |
Footer -> Admin Portal
      |
/admin/login
      |
Email + Password
      |
Spring Security
      |
ROLE_ADMIN
      |
Admin Dashboard
```

The admin link may be visible in the public site's footer. Hiding the link is not considered a security mechanism.

Admin APIs must enforce `ROLE_ADMIN` on the backend.

Customer registration must never be allowed to choose `ADMIN` as a role.

## 6. User Data Model

Initial `users` table:

```text
users
--------------------------------
id
name
email                 UNIQUE
phone                 UNIQUE, nullable
password_hash         nullable
role
auth_provider
email_verified
phone_verified
created_at
updated_at
```

`password_hash` is nullable because V1 customers authenticate through Google OIDC or Email OTP rather than a password.

Possible values:

```text
role:
CUSTOMER
ADMIN

auth_provider:
GOOGLE
EMAIL_OTP
```

The model remains extensible for future authentication methods.

## 7. Core Database Model

### products

```text
id
name
description
price
image_url
stock
category
is_active
created_at
updated_at
```

### addresses

```text
id
user_id
name
phone
address_line
city
state
pincode
created_at
updated_at
```

### carts

```text
id
user_id
created_at
updated_at
```

### cart_items

```text
id
cart_id
product_id
quantity
```

### orders

```text
id
user_id
total_amount
status
payment_status
shipping_address
created_at
updated_at
```

### order_items

```text
id
order_id
product_id
quantity
price
```

`order_items.price` stores the product price at the time of purchase. It must not depend on the product's current price.

### payments

```text
id
order_id
payment_id
amount
status
payment_method
created_at
updated_at
```

## 8. Product Image Storage

Images are stored outside PostgreSQL.

The database stores only the image URL/object reference.

Development:

```text
Spring Boot
     |
MinIO
```

Production:

```text
Spring Boot
     |
Amazon S3
```

Use an abstraction:

```text
ImageStorageService
       |
       +-- MinioImageStorageService
       |
       +-- S3ImageStorageService
```

Business logic should depend on `ImageStorageService`, not directly on MinIO or S3.

This allows the storage provider to change without rewriting product logic.

## 9. Customer Checkout Flow

```text
Browse products
      |
Add to cart
      |
View cart
      |
Checkout
      |
Authenticated?
   /        \
 No          Yes
 |            |
Login         Address
 |            |
Google/Otp    Order summary
      \       /
       \     /
        Payment
           |
      Payment verified
           |
      Order created
           |
    Order confirmation
```

Payment success must be verified by the backend. The backend must not trust a frontend-only "payment successful" response.

## 10. Payment Integration

Razorpay is the planned V1 payment gateway.

Expected flow:

```text
Customer
   |
Checkout
   |
Spring Boot creates payment/order request
   |
React opens Razorpay checkout
   |
Customer completes payment
   |
Payment response/webhook
   |
Backend verifies payment/signature
   |
Payment marked successful
   |
Order finalized
```

Payment gateway charges are business operating costs and should be paid by the client, not included indefinitely in the development fee.

## 11. API Security

Public endpoints may include:

```text
GET /api/products
GET /api/products/{id}
POST /api/auth/customer/otp/request
POST /api/auth/customer/otp/verify
GET /api/auth/google/...
```

Authenticated customer endpoints:

```text
POST /api/cart/items
PUT  /api/cart/items/{id}
DELETE /api/cart/items/{id}
POST /api/orders
GET  /api/orders/my-orders
```

Admin-only endpoints:

```text
POST   /api/admin/products
PUT    /api/admin/products/{id}
DELETE /api/admin/products/{id}
GET    /api/admin/orders
GET    /api/admin/orders/{id}
PUT    /api/admin/orders/{id}/status
```

Backend authorization must enforce roles even if the frontend hides UI controls.

## 12. Admin Portal

The admin portal is part of the same React application for V1 but has its own protected layout.

```text
/admin/login

/admin
/admin/dashboard
/admin/products
/admin/products/new
/admin/orders
/admin/orders/{id}
```

Admin UI:

```text
Admin Layout
├── Sidebar
│   ├── Dashboard
│   ├── Products
│   ├── Orders
│   └── Settings
└── Main Content
```

## 13. Redis and Kafka Decision

### Redis

Not required for V1.

Potential future uses:
- OTP storage with TTL
- Rate limiting
- Product caching
- Frequently accessed data
- Temporary authentication state

### Kafka

Not required for V1.

Kafka becomes useful if the system later introduces event-driven workloads such as:

```text
Order Created
     |
   Kafka
  /  |   \
Email Inventory Analytics
```

For the current business scale, Kafka would add operational complexity without enough benefit.

## 14. Nginx and Deployment

Nginx can be used as a reverse proxy if the chosen cloud architecture benefits from it.

V1 should be Dockerized:

```text
docker-compose.yml

frontend
backend
postgres
minio (development)
```

Production should preferably use managed PostgreSQL and S3 rather than running everything on one server indefinitely.

Potential production architecture:

```text
Internet
   |
HTTPS / Reverse Proxy
   |
React Frontend
   |
Spring Boot API
   |
Managed PostgreSQL

Spring Boot -> Amazon S3
Spring Boot -> Razorpay
Spring Boot -> Email Provider
```

## 15. Development and Git Strategy

Suggested repository:

```text
fruit-powder-ecommerce/
├── frontend/
├── backend/
├── docker-compose.yml
├── README.md
└── docs/
```

Suggested branches:

```text
main
develop
feature/auth
feature/products
feature/cart
feature/orders
feature/payment
feature/admin
feature/deployment
```

Build incrementally and commit each meaningful feature.

## 16. V1 Delivery Phases

### Phase 1 — Foundation
- Repository setup
- React setup
- Spring Boot setup
- PostgreSQL setup
- Docker setup
- Environment configuration

### Phase 2 — Product Catalogue
- Product entity
- Product APIs
- Product UI
- Search/filter
- Product image upload
- MinIO integration

### Phase 3 — Customer Authentication
- Google OIDC
- Email OTP
- JWT issuance
- Spring Security
- CUSTOMER role
- Protected customer APIs

### Phase 4 — Cart and Checkout
- Cart
- Cart items
- Address
- Order creation
- Order items
- Price snapshot

### Phase 5 — Payment
- Razorpay integration
- Payment verification
- Payment status
- Order confirmation

### Phase 6 — Admin
- Admin login
- Admin role
- Admin dashboard
- Product management
- Order management
- Order status updates

### Phase 7 — Production
- S3 integration
- Production PostgreSQL
- Docker deployment
- HTTPS
- Nginx if required
- Environment/secrets configuration
- Basic logging and error handling

## 17. Definition of Done for V1

V1 is complete when:

- A visitor can browse the catalogue without logging in.
- A visitor can add products to a cart.
- Checkout requires customer authentication.
- Customer can authenticate using Google or Email OTP.
- Customer receives an application JWT after successful authentication.
- Customer can provide a delivery address.
- Customer can pay through Razorpay.
- Backend verifies payment before finalizing the order.
- Customer can view previous orders.
- Admin can securely log in.
- Admin APIs reject non-admin users.
- Admin can manage products.
- Admin can upload product images.
- Admin can view and update orders.
- PostgreSQL stores transactional data.
- Development images use MinIO.
- Production images can use S3 without changing business logic.
- Application runs using Docker.
- Application can be deployed to a cloud environment.
- Secrets are stored outside source control.

## 18. Future V2 Candidates

After V1 is stable, possible additions include:

- Phone + SMS OTP
- Redis
- Kafka/event-driven order processing
- Email/SMS order notifications
- Coupons
- Product reviews
- Wishlist
- Delivery tracking
- GST invoices
- Advanced analytics
- Inventory management
- Multiple warehouses
- Customer support
- CI/CD with GitHub Actions
- Separate admin subdomain/application
- CDN for product images

## 19. Commercial Scope

The initial friend/client development budget discussed is approximately **₹15,000 for V1**.

This should be treated as a defined development scope rather than unlimited future changes.

The following should be paid/owned separately by the business:
- Domain
- Cloud hosting
- Managed database
- S3/storage usage
- Email provider
- Payment gateway transaction fees
- Any SMS/OTP provider
- Other third-party service costs

Future features outside V1 should be estimated separately.

## 20. Architecture Principle

The main design principle for V1 is:

> **Build a modular monolith with clear interfaces so that authentication, image storage, payment, and other external integrations can change without rewriting core business logic.**

The system should be simple enough to deliver quickly, but structured enough to evolve into a larger production application if the business grows.
