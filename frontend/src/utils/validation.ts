export const validateName = (name: string): { isValid: boolean; message?: string } => {
  if (!name || !name.trim()) {
    return { isValid: false, message: 'Full name is required' };
  }
  if (name.trim().length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters long' };
  }
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  if (!nameRegex.test(name.trim())) {
    return { isValid: false, message: 'Name can only contain letters and spaces' };
  }
  return { isValid: true };
};

export const validateEmail = (email: string): { isValid: boolean; message?: string } => {
  if (!email || !email.trim()) {
    return { isValid: false, message: 'Email address is required' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  return { isValid: true };
};

export const validatePhone = (phone: string | number): { isValid: boolean; message?: string } => {
  const phoneStr = phone ? phone.toString().trim() : '';
  if (!phoneStr) {
    return { isValid: false, message: 'Phone number is required' };
  }
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phoneStr)) {
    return { isValid: false, message: 'Phone number must be a valid 10-digit mobile number' };
  }
  return { isValid: true };
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  return { isValid: true };
};

export const validateConfirmPassword = (password: string, confirmPassword: string): { isValid: boolean; message?: string } => {
  if (!confirmPassword) {
    return { isValid: false, message: 'Confirm password is required' };
  }
  if (password !== confirmPassword) {
    return { isValid: false, message: 'Password and Confirm Password must match' };
  }
  return { isValid: true };
};
