const express = require("express");
const connection = require("../connection");
const router = express.Router()
var auth = require("../Authentication/authentication");
var crossCheck = require("../Authentication/crossCheck");

router.post("/add", auth.authenticateToken, (req, res) => {
    let category = req.body;
    query = "insert into category (name) values(?)";
    connection.query(query, [category.name], (err, result) => {
        if (!err) {
            return res.status(200).json({
                message: " Category added Successfully"
            })
        }
        else {
            return res.status(500).json({ err })
        }
    })
})
router.get("/get", auth.authenticateToken, (req, res, next) => {
    var query = "select *from category order by name";
    connection.query(query, (err, result) => {
        if (!err) {
            return res.status(200).json(result)
        }
        else {
            return res.status(500).json(err)
        }
    })
});
router.patch("/update", auth.authenticateToken, crossCheck.crossCheck, (req, res, next) => {
    let product = req.body;
    var query = "update category set name=? where id=?";
    connection.query(query, [product.name, product.id], (err, result) => {
        if (!err) {
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "category id does not found"
                })
            }
            return res.status(200).json({
                message: "category updated successfully"
            })    
        }    
            
        else {
            return res.status(500).json(err)
        }
        
    })
});

module.exports = router;