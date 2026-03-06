const {Pool} = require("pg");// import Pool class from pg module

// create a new pool instance with configuration from environment variables
const pools = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: Number(process.env.DB_POOL_MAX) || 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 4000,
});


// Event listeners for pool
pools.on("connect", () => {
  console.log("🟢 PostgreSQL pool connected");
});


// Handle errors on the pool
pools.on("error", (err) => {
    console.error("🔴 PostgreSQL pool error", err);
    process.exit(1);
})


// Export the configured pool
module.exports = pools;