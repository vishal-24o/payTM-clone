// require("dotenv").config();
// const mongoose = require("mongoose");

// // 🔹 Log URI once for sanity
// console.log("MONGO_URI =", process.env.MONGO_URI);

// // 🔹 Connect to MongoDB (replica set aware)
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => {
//   console.log("✅ MongoDB connected successfully");
// })
// .catch((err) => {
//   console.error("❌ MongoDB connection error:", err);
// });

// // ------------------
// // User Schema
// // ------------------
// const UserSchema = new mongoose.Schema({
//   firstName: {
//     type: String,
//     required: true,
//     maxlength: 50
//   },
//   lastName: {
//     type: String,
//     required: true,
//     maxlength: 50
//   },
//   username: {
//     type: String,
//     required: true,
//     minlength: 6,
//     maxlength: 30,
//     unique: true
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 6
//   }
// });

// // ------------------
// // Account Schema
// // ------------------
// const AccountSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   },
//   balance: {
//     type: Number,
//     required: true
//   }
// });

// const User = mongoose.model("User", UserSchema);
// const Account = mongoose.model("Account", AccountSchema);

// module.exports = {
//   User,
//   Account
// };

require("dotenv").config();
const mongoose = require("mongoose");

console.log("MONGO_URI =", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected (standalone)");
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: { type: String, unique: true },
  password: String
});

const AccountSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  balance: Number
});

const User = mongoose.model("User", UserSchema);
const Account = mongoose.model("Account", AccountSchema);

module.exports = { User, Account };
