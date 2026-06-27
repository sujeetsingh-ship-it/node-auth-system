const fs = require('fs')
const path = require('path')
const { pool, connectMySQL } = require('./mysql.config')

const runMigrations = async () => {
  // Pehle MySQL connect karo
  await connectMySQL()

  // migrations folder ka full path lo
  // __dirname = current file ka folder
  // Kyu path.join? Har OS pe / aur \ alag hota hai
  // path.join automatically sahi karta hai
  const migrationsPath = path.join(__dirname, 'migrations')

  // Folder ki saari files lo
  const files = fs.readdirSync(migrationsPath)
    .filter(file => file.endsWith('.sql')) // sirf .sql files chahiye
    .sort() // 001 pehle, 002 baad mein — ORDER zaroori hai
            // Kyu? 002 mein users table ka reference hai
            // Agar 002 pehle chali toh error aayega

  console.log(`📂 Found ${files.length} migration files`)

  // Har file ek ek karke chalao
  for (const file of files) {
    const filePath = path.join(migrationsPath, file)

    // File ka content padho — string ke roop mein
    const sql = fs.readFileSync(filePath, 'utf8')

    try {
      await pool.query(sql)
      console.log(`✅ Migrated: ${file}`)
    } catch (error) {
      console.error(`❌ Failed: ${file}`, error.message)
      // Ek bhi fail ho toh band karo
      // Kyu? Aadhi migration se zyada kharab hoga
      process.exit(1)
    }
  }

  console.log('🎉 All migrations complete!')
  process.exit(0) // success ke saath band karo
}

runMigrations()