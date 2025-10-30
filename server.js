// Import required modules
const express = require("express");
const app = express();

// ---------------------------
// Middleware 1: Request Logger
// ---------------------------
const loggerMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};

// Apply logging middleware globally
app.use(loggerMiddleware);

// ---------------------------
// Middleware 2: Token Authentication
// ---------------------------
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authorization header missing or incorrect",
    });
  }

  const token = authHeader.split(" ")[1];

  if (token !== "mysecrettoken") {
    return res.status(403).json({
      message: "Invalid or expired token",
    });
  }

  next();
};

// ---------------------------
// Routes
// ---------------------------
app.get("/public", (req, res) => {
  res.status(200).send("This is a public route. No authentication required.");
});

app.get("/protected", authMiddleware, (req, res) => {
  res
    .status(200)
    .send("You have accessed a protected route with a valid Bearer token!");
});

// ---------------------------
// Start Server
// ---------------------------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
