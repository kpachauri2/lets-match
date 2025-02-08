// backend/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { GoogleSpreadsheet } = require('google-spreadsheet');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Fixed password and secret message
const PASSWORD = 'mySecret123'; // Change this
let secretMessage = 'Happy Propose Day! 💖 Will you be mine?';

// Google Sheets setup
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
async function logFailedAttempt(name, ip) {
    await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    await sheet.addRow({ Name: name, IP: ip, Timestamp: new Date().toLocaleString() });
}

// API to check password and recipient name
app.post('/unlock', async (req, res) => {
    const { name, password } = req.body;
    if (password === PASSWORD) {
        res.json({ success: true, message: secretMessage });
    } else {
        await logFailedAttempt(name, req.ip);
        res.json({ success: false, message: 'Match Failed 💔' });
    }
});

// API to update secret message (Admin)
app.post('/admin/update-message', (req, res) => {
    const { newMessage, adminPassword } = req.body;
    if (adminPassword === PASSWORD) {
        secretMessage = newMessage;
        res.json({ success: true, message: 'Message updated!' });
    } else {
        res.status(403).json({ success: false, message: 'Unauthorized' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
