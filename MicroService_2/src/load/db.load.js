const pool = require("../config/db.config") // import the configured database pool


// Function to check database connection
const loadDB = async () => {
    try {
        await pool.query(`select 1`)
        console.log("✅ PostgreSQL Ready.")
    } catch (error) {
        console.error("Database connection failed:", error.message)
        process.exit(1)
    }
}

// Export the loadDB function
module.exports = { loadDB } 