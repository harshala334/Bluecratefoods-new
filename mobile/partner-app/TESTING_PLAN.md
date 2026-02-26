# 🚚 BlueCrateFoods Partner App Testing Plan

## 1. Executive Summary
The Partner App is the operational backbone for restaurants and drivers. Unlike the User App, which focuses on "Discovery," this app focuses on **Reliability** and **Real-Time Data**. A missed notification means a delayed order.

## 2. Testing Pyramid Strategy

### 📐 Layer 1: Unit Testing (Logic)
**Goal:** Verify business rules and data transformation.
- **Tool**: `Jest`
- **Critical Scope**:
    - **Socket.io Handlers**: ensuring events (`order:new`, `order:cancelled`) update the store state correctly.
    - **Status Transitions**: Validating only legal state moves (e.g., `Preparing` -> `Ready`, NOT `Preparing` -> `Delivered`).
    - **Offline Queue**: If internet is lost, ensure status updates queue up and sync later.

### 🔗 Layer 2: Integration Testing (Components)
**Goal:** Verify UI updates when data changes.
- **Tool**: `React Native Testing Library`
- **Scope**:
    - **Order Dashboard**: simulating a "New Order" event and verifying the list updates without a manual refresh.
    - **Permissions**: Granting/Denying Location permissions for drivers.

### 📱 Layer 3: End-to-End (E2E) Testing
**Goal:** Simulate a full delivery cycle.
- **Tool**: **Maestro** (Recommended).
- **Critical Flows**:
    1.  **Merchant Flow**: Login -> Receive "Ding" (New Order) -> Accept Order -> Mark Ready.
    2.  **Driver Flow**: Go Online -> Receive Job -> Navigate to Restaurant -> Confirm Pickup -> Navigate to Customer -> Confirm Delivery.

---

## 3. Specialized Testing Needs

### ⚡ Real-Time & Network Testing (Unique to Partner App)
- **Socket Disconnects**: Simulate switching from Wi-Fi to 4G. Does the "You are disconnected" banner appear?
- **Background Execution**: Does the app keep the screen awake (WakeLock) or play sound when an order comes in while the phone is locked?

### 🔋 Battery & Resource Testing
- **Long-Running**: Drivers run the app for 8+ hours. Test for memory leaks that crash the app after 4 hours.
- **GPS Usage**: Ensure location tracking doesn't drain >20% battery/hour.

---

## 4. Pre-Launch Checklist (Partner Specific)

- [ ] **Wake Lock**: Screen stays on for kitchen display mode.
- [ ] **Loud Ringtone**: Notification sound plays even in Silent Mode (if customized).
- [ ] **Tablet Support**: Layout works on cheap Android tablets often used in kitchens.
- [ ] **Crash Recovery**: If app crashes, does it restore the current active order state immediately?

## 5. Recommended Tools
1.  **Jest**: For logic.
2.  **Maestro**: For flow automation.
3.  **Socket.io-client-mock**: For mocking server events in unit tests.
