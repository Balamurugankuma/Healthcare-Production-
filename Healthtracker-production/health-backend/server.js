require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : ["http://localhost:3000", "http://127.0.0.1:3000"];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Rejected origin: ${origin}`);
      callback(new Error("CORS policy: Origin not allowed"));
    }
  },
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["X-Total-Count"],
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));


app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


connectDB();


app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});


app.use("/api/auth", require("./routes/auth"));
app.use("/api/health", require("./routes/health"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/treatments", require("./routes/treatment"));
app.use("/api/medicines", require("./routes/medicine"));
app.use("/api/ai", require("./routes/ai"));


if (process.env.NODE_ENV === "production") {
  const frontendBuildPath = path.join(__dirname, "../health-frontend/build");

  app.use(express.static(frontendBuildPath, { maxAge: "1d" }));

  app.use((req, res, next) => {
    if (req.originalUrl.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
}


app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});


app.use((err, req, res, next) => {
  console.error("[Error]", err.message);
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
  console.log(`🔐 Allowed CORS origins: ${allowedOrigins.join(", ")}`);
});