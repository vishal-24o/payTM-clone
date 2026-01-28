require("dotenv").config();

const express = require("express");
const cors = require("cors");

const routes = require("./routes/routes");
const accountRoutes = require("./routes/account");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", routes);
app.use("/api/v1/account", accountRoutes);

app.listen(3000, () => {
    console.log("listening on 3000");
});
