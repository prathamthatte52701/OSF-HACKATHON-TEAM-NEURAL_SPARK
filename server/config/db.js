const mongoose = require('mongoose')
const dns = require('dns')

dns.setDefaultResultOrder('ipv4first')

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('MongoDB connection failed: MONGODB_URI is missing')
    throw new Error('MONGODB_URI_MISSING')
  }

  let retries = 5
  while (retries) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 30000,
        family: 4,
        tls: true,
        tlsAllowInvalidCertificates: false,
      })
      console.log('MongoDB Connected ✅')
      return mongoose.connection
    } catch (err) {
      retries--
      console.error(`DB connection failed: ${err.message}. Retries left: ${retries}`)
      if (retries === 0) throw err
      await new Promise(res => setTimeout(res, 5000))
    }
  }
}

module.exports = connectDB
