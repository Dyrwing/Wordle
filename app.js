const express = require('express')
const app = express()
const path = require('path');
var logger = require('morgan');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const e = require('express');
require('dotenv').config();

// log requests
app.use(logger('dev'));
// Tell express to expet json data
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, "public")))


// Secret key and initialization vector should be managed securely.
const algorithm = 'aes-256-cbc';
//const secretKey = crypto.randomBytes(32); // Ensure you store this key securely
//const hexKey = secretKey.toString('hex');
//console.log("HEX KEY", hexKey);

//const secretKey = "<Buffer 2e 7c ac 74 78 29 f5 14 b7 59 6d ac 26 72 e1 a0 dc 29 cc fb 13 8d 60 3e a1 21 34 92 44 72 6c 8d>"
//console.log(typeof secretKey);
//const secretKEYYYY = "<Buffer 2e 7c ac 74 78 29 f5 14 b7 59 6d ac 26 72 e1 a0 dc 29 cc fb 13 8d 60 3e a1 21 34 92 44 72 6c 8d>"
//console.log("SECRET", secretKey);
//console.log("SECRET", secretKEYYYY);

const secretKey = Buffer.from(process.env.SECRET_KEY, 'hex');
console.log("SECRET", secretKey);


app.get("/getLink/:word", (req, res) => {
    try {
        let word = req.params.word;
        const { iv, encryptedData } = encrypt(word);
        
        const link = `http://170.64.145.73/play?word=${encodeURIComponent(encryptedData)}&iv=${encodeURIComponent(iv)}`;
        console.log(link);
        res.send(link);
    } catch (error) {
        console.error("Encryption error:", error);
        res.status(500).send("Encryption failed");
    }
})

app.post("/decodeWord", (req, res) => {
    try {
        const data = req.body;
        console.log(data.iv, data.customWord);

        if (!data.iv || !data.customWord) {
            return res.status(400).send("Both 'iv' and 'customWord' are required");
        }

        const decryptedWord = decrypt(data.iv, data.customWord);
        console.log("THIS IS THE WORD", decryptedWord);
        res.send(decryptedWord);
    } catch (error) {
        console.error("Decryption error:", error);
        res.status(500).send("Decryption failed");
    }
    
})

app.get('/play', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/index.html'));

});

// Encryption function
function encrypt(text) {
    let ivEncrypt = crypto.randomBytes(16); // Initialization vector
    let cipher = crypto.createCipheriv(algorithm, secretKey, ivEncrypt);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    console.log("ENCRYPTED", encrypted);
    console.log("IV", ivEncrypt.toString('hex'));

    return { iv: ivEncrypt.toString('hex'), encryptedData: encrypted };
}

// Decryption function
function decrypt(iv, encryptedData) {
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

app.listen(3000, () => console.log('Example app listening on port 3000!'))