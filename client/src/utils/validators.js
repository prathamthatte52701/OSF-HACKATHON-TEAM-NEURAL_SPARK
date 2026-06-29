export const nameRegex = /^[a-zA-Z\s]{3,30}$/
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>/?`~])[^\s]{8,64}$/

export const sanitizeName = (name) => name.trim().replace(/\s+/g, ' ')
export const sanitizeEmail = (email) => email.trim().toLowerCase()

export const validateSignup = (name, email, password) => {
  const errors = {}
  const cleanName  = sanitizeName(name || '')
  const cleanEmail = sanitizeEmail(email || '')

  if (!cleanName)              errors.name = 'Name is required'
  else if (cleanName.length < 3)  errors.name = 'Name must be at least 3 characters'
  else if (cleanName.length > 30) errors.name = 'Name cannot exceed 30 characters'
  else if (!nameRegex.test(cleanName)) errors.name = 'Name can only contain letters and spaces'

  if (!cleanEmail)                    errors.email = 'Email is required'
  else if (!emailRegex.test(cleanEmail)) errors.email = 'Invalid email format'

  if (!password)                  errors.password = 'Password is required'
  else if (password.length < 8)   errors.password = 'Password must be at least 8 characters'
  else if (password.length > 64)  errors.password = 'Password cannot exceed 64 characters'
  else if (/\s/.test(password))   errors.password = 'Password cannot contain spaces'
  else if (!passwordRegex.test(password)) {
    errors.password = 'Password needs uppercase, lowercase, number, and special character'
  }

  return { errors, cleanName, cleanEmail }
}

export const validateLogin = (email, password) => {
  const errors = {}
  const cleanEmail = sanitizeEmail(email || '')
  if (!cleanEmail)  errors.email = 'Email is required'
  if (!password)    errors.password = 'Password is required'
  return { errors, cleanEmail }
}

export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '' }
  let score = 0
  if (password.length >= 8)  score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/\d/.test(password))    score++
  if (/[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>/?`~]/.test(password)) score++

  const labels = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong']
  return { score, label: labels[score] }
}
