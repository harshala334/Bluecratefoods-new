# 🌐 BlueCrateFoods Web Client Testing Plan

## 1. Executive Summary
The Web Client serves two key personas: **Customers** (ordering food) and **Admins** (managing the platform). The testing strategy must ensure a seamless e-commerce experience and a reliable back-office dashboard.

## 2. Testing Pyramid Strategy

### 📐 Layer 1: Unit Testing (Jest)
**Goal:** Verify components and logic in isolation.
- **Tool**: `Jest` + `React Testing Library`
- **Scope**:
    - **Utilities**: Price formatters, date helpers.
    - **Hooks**: Custom hooks like `useCart` or `useAuth`.
    - **Components**: Ensuring atomic components (Buttons, Inputs) render and handle events correctly.

### 🔗 Layer 2: Integration Testing
**Goal:** Verify page-level interactions.
- **Tool**: `React Testing Library`
- **Scope**:
    - **Forms**: Validating "Contact Us" or "Login" forms show errors on invalid input.
    - **Data Fetching**: Mocking API calls to ensure pages load correctly with data (Server Components & Client Components).

### 🖥️ Layer 3: End-to-End (E2E) Testing
**Goal:** Simulate real browser interactions across devices.
- **Recommended Tool**: **Playwright** (Industry standard for Next.js, reliable, handles multiple tabs/browsers).
- **Critical Flows**:
    1.  **Customer Checkout**: Homepage -> Catalog -> Add to Cart -> Checkout -> Payment Mock.
    2.  **Admin Dashboard**: Login as Admin -> View Orders -> Change Status -> Verify Update.
    3.  **Responsive Check**: Verify layout shifts correctly from Desktop -> Tablet -> Mobile.

---

## 3. Specialized Testing Needs

### 🔍 SEO & Metadata Testing
- **Tools**: Playwright / Google Lighthouse CI.
- **Check**: Verify every page has unique `<title>` and `<meta name="description">` tags.
- **OpenGraph**: Verify social sharing cards (OG Images) generate correctly.

### ⚡ Performance & Core Web Vitals
- **Lighthouse CI**: Run audits on every PR.
- **Metrics**:
    - **LCP (Largest Contentful Paint)**: < 2.5s
    - **CLS (Cumulative Layout Shift)**: < 0.1
    - **FID (First Input Delay)**: < 100ms

### 🌍 Cross-Browser Testing
- **Browsers**: Chrome, Firefox, Safari (WebKit), Edge.
- **Playwright** handles this automatically by running tests against all 3 engines.

---

## 4. Pre-Launch Checklist (Web Specific)

- [ ] **Favicons**: Correctly display in all browsers.
- [ ] **404 Page**: Custom, helpful "Page Not Found" exists.
- [ ] **Broken Links**: Run a crawler to ensure no internal links are broken.
- [ ] **HTTPS**: implementation is widely secure.

## 5. Recommended Tools
1.  **Jest**: Logic & Component Unit Tests.
2.  **Playwright**: Best-in-class E2E for modern web.
3.  **Lighthouse**: Performance benchmarking.
