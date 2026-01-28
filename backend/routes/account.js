/**
 * account.js
 * -----------
 * Handles:
 * 1. Fetching account balance
 * 2. Transferring money between users
 *
 * DESIGN:
 * - Local/dev → NO transactions (stable, fast)
 * - Production → MongoDB transactions (atomic, safe)
 * - Controlled using USE_TRANSACTIONS env flag
 */

const express = require("express");
const mongoose = require("mongoose");
const { authMiddleware } = require("../middleware");
const { Account } = require("../db");

const router = express.Router();

/**
 * GET /balance
 * ------------
 * Returns the logged-in user's balance
 */
router.get("/balance", authMiddleware, async (req, res) => {
    try {
        const account = await Account.findOne({ userId: req.userId });

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        res.json({ balance: account.balance });
    } catch (err) {
        console.error("Balance error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

/**
 * POST /transfer
 * --------------
 * Transfers money from logged-in user to another user
 *
 * SAFETY:
 * - Local: sequential updates (safe for dev)
 * - Prod: MongoDB transaction (atomic)
 */
router.post("/transfer", authMiddleware, async (req, res) => {
    const { amount, to } = req.body;

    // Basic validation
    if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
    }

    try {
        /**
         * 🔹 LOCAL / DEV MODE (NO TRANSACTIONS)
         * Used to avoid replica-set instability on localhost
         */
        if (process.env.USE_TRANSACTIONS !== "true") {
            const fromAccount = await Account.findOne({ userId: req.userId });
            const toAccount = await Account.findOne({ userId: to });

            if (!fromAccount || fromAccount.balance < amount) {
                return res.status(400).json({ message: "Insufficient balance" });
            }

            if (!toAccount) {
                return res.status(400).json({ message: "Invalid recipient" });
            }

            fromAccount.balance -= amount;
            toAccount.balance += amount;

            await fromAccount.save();
            await toAccount.save();

            return res.json({
                message: "Transfer successful (safe mode)"
            });
        }

        /**
         * 🔹 PRODUCTION MODE (TRANSACTIONS ENABLED)
         */
        const session = await mongoose.startSession();

        try {
            await session.withTransaction(async () => {
                const fromAccount = await Account.findOne(
                    { userId: req.userId }
                ).session(session);

                if (!fromAccount || fromAccount.balance < amount) {
                    throw new Error("Insufficient balance");
                }

                const toAccount = await Account.findOne(
                    { userId: to }
                ).session(session);

                if (!toAccount) {
                    throw new Error("Invalid recipient");
                }

                fromAccount.balance -= amount;
                toAccount.balance += amount;

                await fromAccount.save({ session });
                await toAccount.save({ session });
            });

            res.json({
                message: "Transfer successful (transactional)"
            });

        } finally {
            session.endSession();
        }

    } catch (err) {
        console.error("Transfer failed:", err.message);
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
