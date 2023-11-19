const express = require("express");
const connection = require("../connection");
const router = express.Router();

const jwt = require("jsonwebtoken")
require("dotenv").config();
const nodemailer = require("nodemailer")

var auth = require("../Authentication/authentication");
var crossCheck = require("../Authentication/crossCheck")

router.post("/signup", (req, res) => {
    let user = req.body;
    query = "select email,password,role,status from user where email=?"
    connection.query(query, [user.email], (err, result) => {
        if (!err) {
            if (result.length <= 0) {
                query = "insert into user(name,contactNumber,email,password,status,role) values(?,?,?,?,'false','user')"
                connection.query(query, [user.name, user.contactNumber, user.email, user.password], (err, result) => {
                    if (!err) {
                        return res.status(200).json({
                            message: "successfully registered"
                        })
                    }
                    else {
                        return res.status(500).json(err)
                    }
                })
            }
            else {
                return res.status(400).json({
                    message: "email already exist"
                })
            }
        }
        else {
            return res.status(500).json(err)
        }
    })

})

router.post("/login", (req, res) => {
    const user = req.body;
    query = "select email, password, role, status from user where email=?";
    connection.query(query, [user.email], (err, result) => {
        if (!err) {
            if (result <= 0 || result[0].password != user.password) {
                return res.status(401).json({
                    message: "incorrect username and password"
                })
            }
            else if (result[0].status === "false") {
                return res.status(401).json({
                    message: "wait for admin approval"
                })
            }
            else if (result[0].password === user.password) {
                const response = { email: result[0].email, role: result[0].role }
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: "20000h" })
                res.status(200).json({ token: accessToken })
            }
            else {
                return res.status(400).json({
                    messge: "something went wrong, try again later"
                })
            }
        }
        else {
            return res.status(500).json(err)
        }
    })
})

const transporter = nodemailer.createTransport({
    host: "smtp.forwardemail.net",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        password: process.env.PASSWORD
    }

})

router.post("/forgortpassword", (req, res) => {
    const user = req.body;
    query = "select email,password from user where email=?";
    connection.query(query, [user.email], (err, result) => {
        if (!err) {
            if (result <= 0) {
                return res.status(200).json({ message: "password sent sucessfully to your mail" })
            }
            else {
                var mailOptions = {
                    from: process.env.EMAIL,
                    to: result[0].email,
                    subject: "Password by nobsafrica",
                    html: '<p><b>Your Login Details</b><br><b>Email: </b>' + result[0].email + '<br><b>Password: ' + result[0].password + '<br><a href="https://localhost:8090/user/login">Click here to login</a></b></p>'
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error)
                    }
                    else {
                        console.log("Email Sent: " + info.response)
                    }
                });
                return res.status(200).json({ message: "password sent sucessfully to your mail" })
            }
        }
        else {
            return res.status(500).json({ err })
        }
    })
})

router.get("/get", auth.authenticateToken, crossCheck.crossCheck, (req, res) => {
    var query = "select id, name , email, contactNumber, status from user where role='user'";
    connection.query(query, (err, result) => {
        if (!err) {
            return res.status(200).json(result)
        }
        else {
            return res.status(500).json(err)
        }
    })
});

router.patch("/update", auth.authenticateToken, crossCheck.crossCheck, (req, res) => {
    let user = req.body;
    var query = "update user set status=? where id=?";
    connection.query(query, [user.status, user.id], (err, result) => {
        if (!err) {
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "user id not found"
                })
            }
            return res.status(200).json({
                message: "User updated sucessfully"
            })
        }
        else {
            return res.status(500).json(err)
        }
    })
});

router.get("/checkToken", auth.authenticateToken, (req, res) => {
    return res.status(200).json({
        message: "true"
    })
})

router.post("/changePassword",auth.authenticateToken, (req, res) => {
    const user = req.body;
    const email = res.locals.email;
    console.log(email);
    var query = "select *from user where email=? and password=?";
    connection.query(query, [email, user.oldPassword], (err, result) => {
        if (!err) {
            if (result.length <= 0) {
                return res.status(400).json({
                    message: "Incorrect old password"
                })
            }
            else if (result[0].password === user.oldPassword) {
                query = "update user set password=? where email=?";
                connection.query(query, [user.newPassword, email], (err, result) => {
                    if (!err) {
                        return res.status(200).json({
                            message: "Password Changed Sucessfully", result
                        })
                    }
                    else {
                        return res.status(500).json(err)
                    }
                })
            }
            else {
                return res.json({
                    message: "Something went wrong, please try again"
                })
            }
        }
        else {
            return res.status(500).json(err)
        }
    })
})

module.exports = router;