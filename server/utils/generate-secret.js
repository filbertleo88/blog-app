import crypto from 'crypto';

// generate-secret.js
const secret = crypto.randomBytes(64).toString('hex');
console.log('Your SESSION_SECRET:');
console.log(secret);