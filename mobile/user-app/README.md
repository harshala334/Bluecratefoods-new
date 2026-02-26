# BlueCrateFoods Mobile App (User App)

A beautiful, feature-rich React Native mobile app for the BlueCrateFoods platform built with Expo, TypeScript, and modern best practices.

## 🎨 Design System

The mobile app exactly matches the web design system:

### Colors
- **Primary**: Turquoise/Teal (`#28b7b5`) - Main brand color
- **Secondary**: Cyan (`#06b6d4`)
- **Accent**: Blue (`#0ea5e9`)
- **Success**: Green (`#22c55e`)
- **Warning**: Yellow/Orange
- **Error**: Red (`#ef4444`)

### Typography
- **Display Font**: Playfair Display (headings)
- **Body Font**: Inter (content)

## 🏗️ Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── common/        # Button, Card, Input, Badge, Loading
│   ├── recipe/        # RecipeCard, IngredientCheckbox, etc.
│   └── cart/          # CartItem, CartSummary
├── screens/           # App screens
│   ├── auth/          # Login, Signup, ForgotPassword
│   ├── home/          # HomeScreen, CategoryScreen
│   ├── recipes/       # RecipeList, RecipeDetail, CookingGuide
│   ├── cart/          # CartScreen, CheckoutScreen
│   ├── orders/        # OrdersList, OrderDetail, OrderTracking
│   └── profile/       # ProfileScreen, AddressScreen, Settings
├── navigation/        # React Navigation setup
├── stores/            # Zustand state management
│   ├── authStore.ts   # Authentication state
│   ├── cartStore.ts   # Shopping cart state
│   └── recipeStore.ts # Recipe data state
├── services/          # API services
│   ├── api.ts         # Axios client with interceptors
│   ├── authService.ts
│   ├── recipeService.ts
│   └── orderService.ts
├── constants/         # Design tokens & config
│   ├── colors.ts      # Color palette
│   ├── typography.ts  # Font system
│   ├── spacing.ts     # Spacing, shadows, border radius
│   └── config.ts      # API URLs, storage keys
├── utils/             # Helper functions
│   ├── storage.ts     # AsyncStorage wrapper
│   ├── validation.ts  # Form validation
│   └── formatters.ts  # Date, price, time formatting
└── types/             # TypeScript definitions
    ├── user.ts
    ├── recipe.ts
    ├── cart.ts
    ├── order.ts
    └── navigation.ts
```

## 📦 Tech Stack

- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **Navigation**: React Navigation v6
- **State Management**: Zustand
- **API Client**: Axios
- **Data Fetching**: React Query
- **Local Storage**: AsyncStorage
- **Icons**: @expo/vector-icons (Ionicons)
- **UI Components**: Custom components matching web design

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
# Install dependencies
cd mobile/user-app
npm install

# Start development server
npm start

# Run on iOS (Mac only)
npm run ios

# Run on Android
npm run android

# Run on web (for testing)
npm run web
```

### Configuration

1. **API Endpoint**: Update `src/constants/config.ts`
```typescript
BASE_URL: 'https://your-api.com'  // Production
BASE_URL: 'http://localhost:8000' // Development
```

2. **Environment Variables**: Create `.env` file
```
API_URL=http://localhost:8000
```

## 🎯 Key Features

### ✅ Implemented
- ✅ Design system (colors, typography, spacing)
- ✅ Component library (Button, Card, Input, Badge, Loading)
- ✅ Recipe card component
- ✅ API service layer with Axios
- ✅ Zustand stores (auth, cart, recipe)
- ✅ TypeScript types
- ✅ Utility functions (storage, validation, formatters)

### 🚧 To Be Implemented
- [ ] Navigation structure
- [ ] Authentication screens (Login, Signup)
- [ ] Home screen with categories
- [ ] Recipe browsing & filtering
- [ ] Recipe detail with ingredient selection
- [ ] Shopping cart
- [ ] Checkout flow
- [ ] Order tracking
- [ ] Push notifications
- [ ] Maps integration

## 📱 Screens Overview

### Authentication
- **Login**: Email/password login
- **Signup**: Create new account
- **Forgot Password**: Reset password flow

### Home
- **Home**: Hero section, category cards (<1min, <10min, <1hr), popular dishes
- **Category**: Filtered recipe list by time category

### Recipes
- **Recipe List**: Browse all recipes with filters
- **Recipe Detail**: Dish info, ingredients with checkboxes, serving size selector
- **Cooking Guide**: Step-by-step instructions with timers

### Cart & Orders
- **Cart**: Selected ingredients, edit quantities
- **Checkout**: Address selection, payment
- **Order Tracking**: Real-time delivery tracking with map
- **Order History**: Past orders

### Profile
- **Profile**: User info, settings
- **Addresses**: Manage delivery addresses
- **Settings**: App preferences, notifications

## 🎨 Component Usage Examples

### Button
```typescript
<Button
  title="Add to Cart"
  onPress={handleAddToCart}
  variant="primary"
  size="large"
  fullWidth
/>
```

### Card
```typescript
<Card variant="elevated">
  <Text>Card content</Text>
</Card>
```

### Input
```typescript
<Input
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
  error={emailError}
  keyboardType="email-address"
/>
```

### Badge
```typescript
<Badge label="Easy" variant="success" />
<Badge label="Medium" variant="warning" />
<Badge label="Hard" variant="error" />
```

### RecipeCard
```typescript
<RecipeCard
  recipe={recipe}
  onPress={() => navigation.navigate('RecipeDetail', { recipeId: recipe.id })}
/>
```

## 🔐 State Management

### Auth Store
```typescript
const { user, isAuthenticated, login, logout } = useAuthStore();

// Login
await login('email@example.com', 'password');

// Logout
await logout();
```

### Cart Store
```typescript
const { items, totalItems, totalPrice, addItem, removeItem } = useCartStore();

// Add to cart
await addItem(ingredient, quantity, recipeId, recipeName);

// Get summary
const summary = getCartSummary();
```

### Recipe Store
```typescript
const { recipes, fetchRecipes, fetchRecipeById } = useRecipeStore();

// Fetch recipes
await fetchRecipes({ timeCategory: '10min' });

// Get single recipe
await fetchRecipeById('recipe-id');
```

## 🌐 API Integration

All API calls go through `src/services/api.ts` which handles:
- Automatic token injection
- Error handling
- Token refresh on 401

```typescript
// Using services
import { recipeService } from '../services/recipeService';

const recipes = await recipeService.getRecipes({ timeCategory: '1min' });
const recipe = await recipeService.getRecipeById('123');
```

## 📝 Development Notes

### Adding New Screens
1. Create screen component in `src/screens/{category}/ScreenName.tsx`
2. Add route to navigation types in `src/types/navigation.ts`
3. Register in navigator (`src/navigation/`)

### Adding New Components
1. Create component in `src/components/{category}/ComponentName.tsx`
2. Export from index file for easy imports
3. Follow existing naming and style conventions

### Styling Guidelines
- Use design tokens from `constants/` folder
- Match web design system exactly
- Use StyleSheet.create for performance
- Keep styles co-located with components

## 🔧 Troubleshooting

### Metro Bundler Issues
```bash
npm start -- --reset-cache
```

### iOS Build Issues
```bash
cd ios && pod install && cd ..
```

### Android Build Issues
```bash
cd android && ./gradlew clean && cd ..
```

## 📄 License

Proprietary - BlueCrateFoods

## 👥 Team

Developed with ❤️ by the BlueCrateFoods team

---

**Note**: This app is in active development. Features will be added incrementally following the implementation phases outlined in the main project documentation.
