// Common validation rules for forms
export const ValidationRules = {
  required: (message = "This field is required") => ({
    test: (value: string) => value.trim().length > 0,
    message,
  }),

  email: (message = "Please enter a valid email address") => ({
    test: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message,
  }),

  minLength: (min: number, message?: string) => ({
    test: (value: string) => value.length >= min,
    message: message || `Must be at least ${min} characters`,
  }),

  maxLength: (max: number, message?: string) => ({
    test: (value: string) => value.length <= max,
    message: message || `Must be no more than ${max} characters`,
  }),

  pattern: (pattern: RegExp, message = "Invalid format") => ({
    test: (value: string) => pattern.test(value),
    message,
  }),

  url: (message = "Please enter a valid URL") => ({
    test: (value: string) => {
      try {
        new URL(value)
        return true
      } catch {
        return false
      }
    },
    message,
  }),

  phone: (message = "Please enter a valid phone number") => ({
    test: (value: string) => /^[+]?[\d\s\-()]{10,}$/.test(value.replace(/\s/g, "")),
    message,
  }),

  passwordStrength: (message = "Password must contain uppercase, lowercase, number, and special character") => ({
    test: (value: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value),
    message,
  }),

  custom: (test: (value: string) => boolean, message: string) => ({
    test,
    message,
  }),
}
