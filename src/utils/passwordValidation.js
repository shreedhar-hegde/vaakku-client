export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

export function getPasswordRequirements(password) {
  const p = typeof password === 'string' ? password : '';
  return [
    { label: `At least ${PASSWORD_MIN_LENGTH} characters`, met: p.length >= PASSWORD_MIN_LENGTH },
    { label: 'One lowercase letter', met: /[a-z]/.test(p) },
    { label: 'One uppercase letter', met: /[A-Z]/.test(p) },
    { label: 'One number', met: /[0-9]/.test(p) },
    { label: 'One special character (!@#$%^&* etc.)', met: /[^A-Za-z0-9]/.test(p) },
    { label: `At most ${PASSWORD_MAX_LENGTH} characters`, met: p.length <= PASSWORD_MAX_LENGTH },
  ];
}

export function validatePassword(password) {
  if (typeof password !== 'string' || !password.trim()) return 'Password is required';
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return `Password must be at most ${PASSWORD_MAX_LENGTH} characters`;
  }
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Password must contain at least one special character';
  return null;
}
