/**
 * Validation utilities
 */

export const validation = {
  // Email validation
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Password validation (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
  password: (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },

  // Phone validation (basic)
  phone: (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
  },

  // Name validation (at least 2 characters)
  name: (name: string): boolean => {
    return name.trim().length >= 2;
  },

  // Required field
  required: (value: string): boolean => {
    return value.trim().length > 0;
  },

  // Zip code validation
  zipCode: (zipCode: string): boolean => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zipCode);
  },
};

// Error messages
export const validationMessages = {
  email: 'Please enter a valid email address',
  password: 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number',
  phone: 'Please enter a valid phone number',
  name: 'Name must be at least 2 characters',
  required: 'This field is required',
  zipCode: 'Please enter a valid zip code',
};

export default validation;
