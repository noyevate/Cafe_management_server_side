const express = require("express");
const connection = require("../connection");
const router = express.Router();
const ejs = require("ejs");
const pdf = require("html-pdf");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
const auth = require("../Authentication/authentication");

router.post("/generteReport", auth.authenticateToken, (req, res) => {
    const generatedUuid = uuidv4();
    console.log(generatedUuid);
    const orderDetails = req.body;
    const productDetailsReport = JSON.parse(orderDetails.productDetails);

    const query = "INSERT INTO bill (name, uuid, email, contactNumber, payentMethod, total, productDetails, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    connection.query(query, [orderDetails.name, generatedUuid, orderDetails.email, orderDetails.contactNumber, orderDetails.payentMethod, orderDetails.totalAmount, orderDetails.productDetails, res.locals.email], (err, result) => {
        if (!err) {
            console.log("Hey");
            ejs.renderFile(path.join(__dirname,'', "report.ejs"), { productDetails: productDetailsReport, name: orderDetails.name, email: orderDetails.email, contactNumber: orderDetails.contactNumber, payentMethod: orderDetails.payentMethod, totalAmount: orderDetails.totalAmount }, (err, results) => {
                if (err) {
                    console.log("Hey2");
                    return res.status(500).json(err);
                } else {
                    console.log("Hey3");
                    const outputFileName = `./generated_file/${generatedUuid}.pdf`;
                    pdf.create(results).toFile(outputFileName, (pdfErr, data) => {
                        if (pdfErr) {
                            console.log(pdfErr);
                            return res.status(500).json(pdfErr);
                        } else {
                            return res.status(200).json({ uuid: generatedUuid });
                        }
                    });
                }
            });
        } else {
            return res.status(500).json(err);
        }
    });
});

module.exports = router;
