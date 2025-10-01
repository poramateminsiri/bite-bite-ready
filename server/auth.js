/**
 * BetterAuth Configuration
 * Authentication setup for admin panel
 */

const { betterAuth } = require("better-auth");
const Database = require("better-sqlite3");
const path = require("path");

// Initialize BetterAuth with SQLite database
const auth = betterAuth({
  database: new Database(path.join(__dirname, "database.db")),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // For internal admin, we don't need email verification
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "staff",
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 8, // 8 hours
    updateAge: 60 * 60 * 24, // Update session every 24 hours
  },
  trustedOrigins: [
    "http://localhost:5173",
    "http://localhost:8080",
    "http://localhost:8081",
    "http://localhost:8082",
  ],
});

module.exports = { auth };
