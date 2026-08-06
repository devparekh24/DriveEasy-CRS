const mongoose = require('mongoose');
const dns = require('dns');
const app = require('./app')
const dotenv = require('dotenv')
dotenv.config()

// In development, force Google/Cloudflare DNS — fixes SRV lookup failures
// when the local router DNS (e.g. 192.168.0.1) can't resolve SRV records.
// Not needed on hosted platforms (Render, Vercel, etc.) which have proper DNS.
if (process.env.NODE_ENV === 'development') {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
    console.log('Using Google/Cloudflare DNS for SRV resolution (dev mode)');
}

const db = process.env.DB.replace('<PASSWORD>', process.env.DB_PASSWORD);

const connectWithRetry = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            console.log(`MongoDB connection attempt ${i + 1}/${retries}...`);
            await mongoose.connect(db);
            console.log('Database Connected Successfully...');
            return;
        } catch (err) {
            console.log(`Connection attempt ${i + 1} failed: ${err.message}`);
            if (i < retries - 1) {
                console.log('Retrying in 3 seconds...');
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }
    }

    console.error('All MongoDB connection attempts failed.');
    console.error('\nPossible fixes:');
    console.error('  1. Check your internet connection');
    console.error('  2. Whitelist your IP in MongoDB Atlas (Network Access)');
    console.error('  3. Check if a firewall/VPN is blocking connections');
    process.exit(1);
};

const port = process.env.PORT || 8000;
const env = process.env.NODE_ENV || 'production';

app.listen(port, () => {
    console.log(`Connection established with the server on port : ${port} in ${env} mode`);
    connectWithRetry();
})