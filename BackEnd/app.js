const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api", userRoutes);

module.exports = app;
