// test-env.js
import dotenv from "dotenv";

dotenv.config();

console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID || "NOT FOUND");
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET || "NOT FOUND");

// Run this with: node test-env.js
