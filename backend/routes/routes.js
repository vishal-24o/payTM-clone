const express = require("express");
const userRoutes = require("./user");

const router = express.Router();

router.use("/user", userRoutes);

router.get("/", (req, res) => {
    res.send("Backend is running");
});

module.exports = router;
