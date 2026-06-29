const jwt  = require('jsonwebtoken')
const User = require('../models/User')

const getBearerToken = (req) => {
  if (!req.headers.authorization?.startsWith('Bearer ')) return null
  return req.headers.authorization.split(' ')[1]
}

const protect = async (req, res, next) => {
  const token = getBearerToken(req)

  if (!token) {
    return res.status(401).json({ message: 'Pehle login karo' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password')
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' })
    }
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Session expire ho gaya — dobara login karo' })
  }
}

const optional = async (req, res, next) => {
  const token = getBearerToken(req)
  if (!token) return next()

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password')
  } catch {}
  next()
}

module.exports = protect
module.exports.optional = optional
