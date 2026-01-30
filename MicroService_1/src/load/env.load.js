
// Load and validate environment variables
module.exports = () => {
    if(!process.env.PORT) {
        console.log("🚨 PORT is not defined in environment variables.");
        console.error("PORT is not defined in environment variables.");
        process.exit(1);
    }

    console.log(`✅ Environment loaded`);
}

