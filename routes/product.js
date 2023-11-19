const express = require("express")
const connetion = require("../connection")
const router = express.Router()

var auth = require("../Authentication/authentication")
var crossCheck = require("../Authentication/crossCheck")
const connection = require("../connection")

router.post("/add", auth.authenticateToken, crossCheck.crossCheck, (req, res) => {
    let product = req.body;
    var query = "insert into product (name, categoryId, description, price, status) values(?,?,?,?, 'true')";
    connection.query(query, [product.name, product.categoryId, product.description, product.price], (err, result) => {
        if (!err) {
            return res.status(200).json({
                message: "Product added successfully"
            })
        }
        else {
            return res.status(500).json(err)
        }
    })
});
router.get("/get", auth.authenticateToken, (req, res) => {
    var query = "select p.id, p.name, p.description, p.price, p.status, c.id as categoryId, c.name as categoryName from product as p INNER JOIN category as c where p.categoryId = c.id";
    connection.query(query, (err, result) => {
        if (!err) {
            return res.status(200).json(result)
        }
        else {
            return res.status(500).json(err)
        }
    })
});

router.get("/getByCategory/:id", auth.authenticateToken, (req, res) => {
    const id = req.params.id;
    var query = "select id, name from product where categoryId = ? and status='true'";
    connection.query(query, [id], (err, result) => {
        if (!err) {
            return res.status(200).json(result)
        }
        else {
            return res.status(500).json(err)
        }
    })
});

router.get("/getById/:id", auth.authenticateToken, (req, res) => {
    const id = req.params.id;
    var query = "select id, name, description, price from product where id=?";
    connection.query(query, [id], (err, result) => {
        if (!err) {
            return res.status(200).json(result[0]);
        }
        else {
            return res.status(500).json(err);
        }
    })
});

router.patch("/update", auth.authenticateToken, crossCheck.crossCheck, (req, res, next) => {
    let product = req.body;
    var query = "update product set name=?, categoryId=?, description =?, price = ? where id=?";
    connection.query(query, [product.name, product.categoryId, product.description, product.price, product.id], (err, result) => {
        if (!err) {
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Product Id not found"
                })
            }
            return res.status(200).json({
                message: "Product Updated Successfully"
            })
        }
        else {
            return res.status(500).json(err)
        }
    })
});

router.delete("/delete/:id", auth.authenticateToken, crossCheck.crossCheck, (req, res, next) => {
    const id = req.params.id;
    var query = "delete from product where id=?";
    connection.query(query, [id], (err, result) => {
        if (!err) {
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Product Id not found"
                })
            }
            return res.status(200).json({
                message: "Product Deleted Successfully"
            })
        }
        else {
            return res.status(500).json(err)
        }
    })
});

router.patch("/updateStatus", auth.authenticateToken, crossCheck.crossCheck, (req, res) => {
    let user = req.body;
    var query = "update product set status=? where id=?"
    connection.query(query, [user.status, user.id], (err, result) => {
        if (!err) {
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Product Id not found"
                })
            }
            return res.status(200).json({
                message: "Product Status Updated Sucessfully "
            })
        }
        else {
            return res.status(500).json(err)
        }
    })
})

module.exports = router