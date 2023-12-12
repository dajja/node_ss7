const fs = require('fs');
const path = require('path');

const pathFb = path.join(__dirname, '../feedback.json');
const file = fs.readFileSync(pathFb, 'utf-8');
const data = JSON.parse(file);

const checkExist = (req, res, next) => {
    const { id } = req.params;
    let index = data.findIndex(e => e.id == id);
    if (index != -1) {
        next();
    } else {
        res.status(400).json({
            message: "Feedback not found"
        })
    }
}

module.exports = checkExist;