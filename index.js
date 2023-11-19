const express = require("express");
const cors = require("cors");


const connection = require("./connection")
const userRoutes = require("./routes/user")
const categoryRoute = require("./routes/category")
const productRoute = require("./routes/product")
const billRoutes = require("./routes/bill")
const dashboardRoutes = require("./routes/dashbord")
const app = express();

app.use(cors())
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use("/user", userRoutes)
app.use("/category", categoryRoute)
app.use("/product", productRoute)
app.use("/bill", billRoutes)
app.use("/dashboard", dashboardRoutes)

module.exports = app
