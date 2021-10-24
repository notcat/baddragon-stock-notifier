import express from "express";

// Create express server
const app = express();

// Express config
app.set("port", process.env.PORT || 3000);

export default app;