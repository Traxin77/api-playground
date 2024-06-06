const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api_request', async (req, res) => {
    const { url, method, headers, params, api_key } = req.body;

    const config = {
        method: method || 'GET',
        url: url,
        headers: headers || {}
    };

    if (api_key) {
        config.headers['Authorization'] = `Bearer ${api_key}`;
    }

    if (method === 'GET') {
        config.params = params || {};
    } else {
        config.data = params || {};
    }

    try {
        const response = await axios(config);
        res.json({
            status_code: response.status,
            headers: response.headers,
            body: response.data
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
})