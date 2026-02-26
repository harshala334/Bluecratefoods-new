# Meta Pixel Events Documentation

This file lists all the Meta Pixel events currently identified and tracked in the codebase.

## Standard Events

### 1. PageView
- **Trigger**: Fires on every page load and route change.
- **Location**: `src/pages/_app.tsx`
- **Data**: None (Standard PageView)

### 2. Lead
- **Trigger**: Fires when a user submits an enquiry, requests a quote, requests a sample, or shows interest in downloading the app.
- **Locations**:
    - `src/components/EnquiryModal.tsx`: General Enquiry
        - Data: `{ content_name: 'Enquiry' }`
    - `src/pages/b2b.tsx`: B2B Quote Request
        - Data: `{ content_name: 'B2B Quote' }`
    - `src/pages/b2b.tsx`: B2B Sample Request
        - Data: `{ content_name: 'B2B Sample' }`
    - `src/pages/d2c.tsx`: App Download Interest
        - Data: `{ content_name: 'App Download Interest' }`

### 3. InitiateCheckout
- **Trigger**: Fires when a user clicks "Proceed to Checkout" on the Cart page.
- **Location**: `src/pages/cart.tsx`
- **Data**:
    ```javascript
    {
      value: total_amount,
      currency: 'USD',
      num_items: item_count
    }
    ```

### 4. Purchase
- **Trigger**: Fires when a user successfully places an order on the Checkout page.
- **Location**: `src/pages/checkout.tsx`
- **Data**:
    ```javascript
    {
      value: total_amount,
      currency: 'USD',
      num_items: item_count,
      content_ids: [list_of_product_ids],
      content_type: 'product'
    }
    ```

### 5. AddToCart
- **Trigger**: Fires when a user adds an item to their cart.
- **Locations**:
    - `src/pages/restaurants/[id].tsx`: Adding a restaurant menu item
        - Data:
        ```javascript
        {
          content_name: item_name,
          content_ids: [item_id],
          content_type: 'product',
          value: item_price,
          currency: 'USD'
        }
        ```
    - `src/pages/recipes/[id].tsx`: Adding recipe ingredients to cart
        - Data:
        ```javascript
        {
          content_name: recipe_name,
          content_ids: [`recipe-${recipe_id}`],
          content_type: 'product',
          value: total_cost,
          currency: 'USD'
        }
        ```

### 6. CompleteRegistration
- **Trigger**: Fires when a new user successfully signs up.
- **Location**: `src/pages/register.tsx`
- **Data**: `{ content_name: 'New User Signup' }`
