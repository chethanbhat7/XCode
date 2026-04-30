// Email validation
export function validateEmail(email: string): { valid: boolean; error?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || email.trim() === "") {
    return { valid: false, error: "Email is required" };
  }
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Invalid email format" };
  }
  return { valid: true };
}

// Password validation
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password || password.trim() === "") {
    return { valid: false, error: "Password is required" };
  }
  if (password.length < 6) {
    return { valid: false, error: "Password must be at least 6 characters" };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one uppercase letter" };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one lowercase letter" };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: "Password must contain at least one number" };
  }
  return { valid: true };
}

// Name validation
export function validateName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim() === "") {
    return { valid: false, error: "Full name is required" };
  }
  if (name.length < 2) {
    return { valid: false, error: "Full name must be at least 2 characters" };
  }
  if (name.length > 100) {
    return { valid: false, error: "Full name must be less than 100 characters" };
  }
  return { valid: true };
}

// Role validation
export function validateRole(role: string): { valid: boolean; error?: string } {
  if (role !== "manager" && role !== "developer") {
    return { valid: false, error: "Role must be either 'manager' or 'developer'" };
  }
  return { valid: true };
}

// Full registration validation
export function validateRegistration(
  name: string,
  email: string,
  password: string,
  role: string
): { valid: boolean; errors: { [key: string]: string } } {
  const errors: { [key: string]: string } = {};

  const nameCheck = validateName(name);
  if (!nameCheck.valid) errors.name = nameCheck.error || "";

  const emailCheck = validateEmail(email);
  if (!emailCheck.valid) errors.email = emailCheck.error || "";

  const passwordCheck = validatePassword(password);
  if (!passwordCheck.valid) errors.password = passwordCheck.error || "";

  const roleCheck = validateRole(role);
  if (!roleCheck.valid) errors.role = roleCheck.error || "";

  return { valid: Object.keys(errors).length === 0, errors };
}
