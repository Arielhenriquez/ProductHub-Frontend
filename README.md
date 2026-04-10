# ProductHub Frontend

Angular 19 e-commerce SPA with an admin panel, deployed on **Azure Static Web Apps** and connected to a REST API running on **Azure Container Apps**.

**Frontend**
- **Live app:** https://lemon-ground-02ebc910f.6.azurestaticapps.net
- **Repo / branch:** https://github.com/Arielhenriquez/ProductHub-Frontend/tree/init-ecommerce

**Backend**
- **API:**  https://producthub-api.wittysea-8d0d5478.eastus.azurecontainerapps.io/swagger/index.html
- **Repo:** https://github.com/Arielhenriquez/ProductHub

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Angular 19.2 (standalone components) |
| Language | TypeScript 5.7 |
| Styles | SCSS |
| HTTP | Angular HttpClient + interceptors |
| Auth | JWT stored in `localStorage` |
| Alerts | SweetAlert2 |
| Testing | Karma + Jasmine |
| Node.js (CI) | 22 |

---

## Azure resources

| Resource | Type | Details |
|---|---|---|
| **Azure Static Web Apps** | Frontend host | `lemon-ground-02ebc910f.6.azurestaticapps.net` — serves the built Angular app |
| **Azure Container Apps** | Backend API | `producthub-api.wittysea-8d0d5478.eastus.azurecontainerapps.io` (East US) — ASP.NET Core REST API with JWT · [repo](https://github.com/Arielhenriquez/ProductHub) |

---

## Project structure

```
src/app/
├── core/
│   ├── api/            # Base HTTP service & API config
│   ├── constants/      # Base URL, storage keys, error helpers
│   ├── guards/         # authGuard · guestGuard · adminGuard
│   ├── interceptors/   # auth-token · auth-error · loading
│   └── services/       # auth · products · categories · users · product-images · loading
├── components/         # Shared UI: store-header · store-footer · product-grid · product-filters
└── features/
    ├── ecommerce/      # Public/customer-facing pages
    │   ├── home
    │   ├── products
    │   ├── product-detail
    │   ├── login · register · forgot-password · reset-password
    │   └── forbidden
    └── admin/          # Back-office (adminGuard protected)
        ├── admin-dashboard
        ├── admin-products
        ├── admin-categories
        ├── admin-users
        └── admin-layout · admin-header · admin-sidebar
```

---

## Routes

| Path | Component | Guard |
|---|---|---|
| `/` | Home | `authGuard` |
| `/products` | Products list | `authGuard` |
| `/products/:id` | Product detail | `authGuard` |
| `/login` | Login | `guestGuard` |
| `/register` | Register | `guestGuard` |
| `/forgot-password` | Forgot password | `guestGuard` |
| `/reset-password` | Reset password | `guestGuard` |
| `/admin` | Admin layout | `authGuard` + `adminGuard` |
| `/admin/dashboard` | Dashboard | inherited |
| `/admin/products` | Manage products | inherited |
| `/admin/categories` | Manage categories | inherited |
| `/admin/users` | Manage users | `adminGuard` |
| `/forbidden` | 403 page | — |

---

## Running locally

### Prerequisites
- Node.js 22+
- Angular CLI 19 (`npm i -g @angular/cli`)

### Steps

```bash
# 1. Clone and switch to the branch
git clone https://github.com/Arielhenriquez/ProductHub-Frontend.git
cd ProductHub-Frontend
git checkout init-ecommerce

# 2. Install dependencies
npm ci

# 3. Start dev server (http://localhost:4200)
npm start
```

The app calls the production API at:
```
https://producthub-api.wittysea-8d0d5478.eastus.azurecontainerapps.io/api
```
No proxy configuration needed — the URL is hardcoded in `src/app/core/constants/api.constants.ts`.

### Other useful commands

```bash
npm run build          # production build → dist/product-hub/browser/
npm run watch          # incremental dev build
npm test               # unit tests with Karma
```

---

## CI/CD — GitHub Actions

File: `.github/workflows/azure-static-web-apps.yml`

**Trigger:** every push or PR targeting the `init-ecommerce` branch.

**Pipeline steps:**
1. Checkout code
2. Setup Node.js 22 with npm cache
3. `npm ci`
4. `npm run build -- --configuration production`
5. Deploy `dist/product-hub/browser/` to Azure Static Web Apps

**Required secret (GitHub → Settings → Secrets):**

| Secret | Description |
|---|---|
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | Deployment token from the Azure Static Web Apps resource |

When a PR is **closed**, the workflow tears down the staging environment automatically.

---

## Authentication flow

1. User logs in → API returns a JWT.
2. Token saved to `localStorage` under key `producthub_accessToken`.
3. User object saved under `producthub_user`.
4. `auth-token.interceptor` attaches `Authorization: Bearer <token>` to every outgoing request.
5. `auth-error.interceptor` catches 401/403 and redirects accordingly.
6. `authGuard` / `guestGuard` / `adminGuard` protect routes based on token presence and user role.
