const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB connected successfully')
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message)
    process.exit(1)
  }
}

// MongoDB disconnect bhi handle karo
// Kyu? App band hote waqt cleanly 
// connection close hona chahiye
// Warna MongoDB mein hanging connections 
// reh jaate hain
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected')
})

// SIGINT = Ctrl+C press kiya
// Kyu handle karo? Taaki gracefully 
// connection close ho, forcefully nahi
process.on('SIGINT', async () => {
  await mongoose.connection.close()
  console.log('MongoDB connection closed on app termination')
  process.exit(0)
})

module.exports = { connectMongoDB }