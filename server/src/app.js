import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Parse allowed origins from env (comma-separated if you want to add more later)
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : [];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests like Postman or server-to-server without origin
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: Origin ${origin} not allowed`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow cookies/auth headers
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(cookieParser());

// Middleware to parse JSON and URL-encoded data
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static("public")); // Serve static files from the "public" folder

// Basic health check route
app.get("/", (_, response) => {
  response.status(200).send("Server is working fine");
});

// Import Routes
import userRouter from "./routes/user.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import videoRouter from "./routes/video.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";
import viewRouter from "./routes/view.routes.js";
import healthcheckRouter from "./routes/healthcheck.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import { ApiError } from "./utils/ApiError.js";

// Declare routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/views", viewRouter);
app.use("/api/v1/healthchecks", healthcheckRouter);
app.use("/api/v1/dashboards", dashboardRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
      data: err.data,
    });
  }

  // Generic error handler
  if (process.env.NODE_ENV === 'development') {
    console.error(err); // Log error in development mode for debugging
  }

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

export { app };
