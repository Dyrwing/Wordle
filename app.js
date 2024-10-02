const express = require('express')
const app = express()
const path = require('path');
var logger = require('morgan');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const e = require('express');
require('dotenv').config({ path: 'environment.env' });

// log requests
app.use(logger('dev'));
// Tell express to expet json data
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, "public")))


// Secret key and initialization vector should be managed securely.
const algorithm = 'aes-256-cbc';

const secretKey = Buffer.from(process.env.SECRET_KEY, 'hex');
console.log("SECRET", secretKey);

// Global middleware to remove "/wordle" prefix from the path
app.use((req, res, next) => {
    const currentHost = req.hostname;

    // Check if the host is localhost
    if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
        console.log("Handling request from localhost");
        
        // Modify the request URL by stripping off '/wordle' at the beginning
        if (req.url.startsWith('/wordle')) {
            req.url = req.url.replace(/^\/wordle/, '');  // Remove only the '/wordle' prefix
            console.log("Modified REQ URL:", req.url);
        }
    }

    next();  // Pass control to the next matching route
});

app.get("/getLink/:word", (req, res) => {
    try {
        let word = req.params.word;
        const { iv, encryptedData } = encrypt(word);

         // Access the hostname directly
         const currentHost = req.hostname;  // or req.headers.host
         
         // Determine the base URL based on the current host
         let baseUrl;
 
         if (currentHost === "localhost") {
             baseUrl = "http://localhost:4000";
         } else {
             baseUrl = `http://${currentHost}/wordle`;
         }

        
        const link = `${baseUrl}?word=${encodeURIComponent(encryptedData)}&iv=${encodeURIComponent(iv)}`;
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

app.get('/', (req, res) => {
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

app.listen(4000, () => console.log('Example app listening on port 4000!'))