var express = require("express");
const router = express.Router();
const fs = require('fs');
const path = require('path');

const checkExist = require("./middleware/check");
const pathFb = path.join(__dirname, './feedback.json');
const file = fs.readFileSync(pathFb, 'utf-8');
const data = JSON.parse(file);

router.get("/", (req, res) => {
    res.status(200).json(data);
})

router.get("/:id", checkExist, (req, res) => {
    let { id } = req.params;
    let fbById = data.find(e => e.id == id);
    res.status(200).json({
        message: "ok",
        data: fbById
    })
})

router.post("/", (req, res) => {
    data.unshift(req.body);
    fs.writeFileSync(pathFb, JSON.stringify(data));
    res.status(201).json({
        message: "Feedback successfully",
        data: data
    })
})

router.put("/:id", checkExist, (req, res) => {
    let { id } = req.params;
    let index = data.findIndex(e => e.id == id);
    data.splice(index, 1, req.body);
    fs.writeFileSync(pathFb, JSON.stringify(data));
    res.status(200).json({
        message: "Edit successfully",
        data: data
    })
})

router.delete('/:id', checkExist, (req, res) => {
    let { id } = req.params;
    let index = data.findIndex(e => e.id == id);
    data.splice(index, 1);
    fs.writeFileSync(pathFb, JSON.stringify(data))
    res.status(200).json({
        message: 'Delete successfully',
        data: data
    })
})

module.exports = router;