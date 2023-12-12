const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const port = 8000
var cors = require('cors')
const router = require("./feedback");

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


app.use("/api/v1/feedbacks", router);

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
