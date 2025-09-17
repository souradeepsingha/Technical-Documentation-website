const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// ---------------- LOGGER MIDDLEWARE ----------------
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ---------------- STATIC FILES ----------------
app.use(express.static(path.join(__dirname, "public")));
console.log("📂 Serving static files from:", path.join(__dirname, "public"));

app.get("/", (req, res) => {
  console.log("➡️  Serving index.html");
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ---------------- NEW CODE START ----------------

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log("⚙️ Body parser enabled");

// Firebase Admin SDK
const admin = require("firebase-admin");

// Load service account key (download from Firebase console and place in project root)
const serviceAccount = require("./serviceAccountKey.json");
console.log("🔑 Service account key loaded");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
console.log("🔥 Firebase Admin initialized");

// Middleware to verify Firebase ID token
async function verifyToken(req, res, next) {
  console.log("🔍 Checking Authorization header...");
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken) {
    console.warn("❌ Unauthorized: No token provided");
    return res.status(401).send("Unauthorized: No token provided");
  }

  try {
    console.log("🛂 Verifying token...");
    const decoded = await admin.auth().verifyIdToken(idToken);
    console.log("✅ Token verified:", decoded.uid);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    return res.status(401).send("Unauthorized: Invalid token");
  }
}

// Example protected API
app.get("/profile", verifyToken, (req, res) => {
  console.log("📡 /profile accessed by user:", req.user.uid);
  res.json({
    message: "✅ User verified on server",
    user: req.user,
  });
});

// ---------------- NEW CODE END ----------------

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
