const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Website A Base API & Headers
const BASE_URL = 'https://app.freeclipping.com/api/user';
const getHeaders = () => ({
  'accept': '*/*',
  'authorization': `Bearer ${process.env.WEBSITE_A_TOKEN}`, // Render Env Variable se aayega
  'content-type': 'application/json',
  'origin': 'https://app.freeclipping.com',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'
});

// Route 1: Submit Social Handle
app.post('/api/submit-handle', async (req, res) => {
    try {
        const { username } = req.body;
        
        const response = await axios.post(`${BASE_URL}/socials`, {
            platform: "YouTube",
            username: username
        }, { headers: getHeaders() });

        // Unki API return karegi ID aur verification string (code)
        // Hum farz kar rahe hain data.id aur data.verification_string aata hai
        res.status(200).json(response.data); 

    } catch (error) {
        console.error("Submit Handle Error:", error?.response?.data || error.message);
        res.status(500).json({ error: 'Failed to submit handle to Website A' });
    }
});

// Route 2: Verify Social Handle
app.post('/api/verify-handle', async (req, res) => {
    try {
        const { website_a_id } = req.body; // e.g. 7689
        
        const response = await axios.post(`${BASE_URL}/socials/${website_a_id}/verify`, {}, { 
            headers: getHeaders() 
        });

        res.status(200).json(response.data);

    } catch (error) {
        console.error("Verify Handle Error:", error?.response?.data || error.message);
        res.status(500).json({ error: 'Failed to verify handle on Website A' });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 KHR Shorts Backend running on port ${PORT}`);
});
