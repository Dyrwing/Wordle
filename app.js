const express = require('express')
const app = express()
const path = require('path');
var logger = require('morgan');

// log requests
app.use(logger('dev'));
// Tell express to expet json data
app.use(express.json());
app.use('/public' , express.static(path.join(__dirname, "public")))


app.listen(3000, () => console.log('Example app listening on port 3000!'))