const mysql = require('mysql2/promise')
const dotenv = require('dotenv')

dotenv.config()

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

const connectMySQL = async (retries = 5, delay = 3000) => {
  // Kyu retry? MySQL container start hota hai lekin
  // andar ready hone mein time lagta hai
  // App pehle start ho jaati hai — isliye wait karo
  for (let i = 1; i <= retries; i++) {
    try {
      const connection = await pool.getConnection()
      console.log('✅ MySQL connected successfully')
      connection.release()
      return // connected — bahar niklo loop se
    } catch (error) {
      console.log(`⏳ MySQL not ready, attempt ${i}/${retries}...`)

      if (i === retries) {
        console.error('❌ MySQL connection failed after all retries:', error.message)
        process.exit(1)
      }

      // delay milliseconds wait karo phir dobara try karo
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}

module.exports = { pool, connectMySQL }