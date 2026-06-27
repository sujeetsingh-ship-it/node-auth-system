const express = require('express')
const dotenv = require('dotenv')
const { connectMySQL } = require('./config/mysql.config')
const { connectMongoDB } = require('./config/mongodb.config')

dotenv.config()

const app = express()

// JSON body parse karne ke liye
// Kyu? Bina iske req.body undefined hoga
app.use(express.json())

// Health check route
// Kyu? Docker aur servers ko pata chale 
// ki app zinda hai ya nahi
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  })
})

// App start karne ka function
const startApp = async () => {
  // Pehle DBs connect karo, phir server start karo
  // Kyu? Agar DB nahi chala aur server 
  // start ho gaya toh requests fail hongi
  await connectMySQL()
  await connectMongoDB()

  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
  })
}

startApp()