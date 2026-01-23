/**
 * user.js
 * -------
 * Handles:
 * - User signup (with hashed password)
 * - User signin (with bcrypt comparison)
 * - Fetch current user
 * - Update user details
 * - Delete user
 */

const { Router } = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { User, Account } = require("../db");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");

const router = Router();

/**
 * VALIDATION SCHEMAS
 */
const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string().min(6)
});

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
});

/**
 * POST /signup
 */
router.post("/signup", async (req, res) => {
  try {
    console.log("SIGNUP BODY:", req.body);

    const { success } = signupBody.safeParse(req.body);
    if (!success) {
      return res.status(411).json({ message: "Invalid inputs" });
    }

    const existingUser = await User.findOne({
      username: req.body.username
    });

    if (existingUser) {
      return res.status(411).json({
        message: "Email already taken"
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      username: req.body.username,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    });

    await Account.create({
      userId: user._id,
      balance: 1000
    });

    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      message: "User created successfully",
      token
    });

  } catch (err) {
    console.error("❌ SIGNUP ERROR:", err);
    return res.status(500).json({
      message: "Signup failed",
      error: err.message
    });
  }
});


/**
 * POST /signin
 */
router.post("/signin", async (req, res) => {
    console.log("SIGNIN BODY:", req.body); // 🔍 DEBUG

    const { success } = signinBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({ message: "Invalid inputs" });
    }

    const user = await User.findOne({ username: req.body.username });
    if (!user) {
        return res.status(411).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(
        req.body.password,
        user.password
    );

    if (!passwordMatch) {
        return res.status(411).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { userId: user._id },
        JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.status(200).json({ token });
});

module.exports = router;
