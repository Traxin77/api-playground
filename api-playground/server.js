/*const express = require('express');
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
})*/

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');

const app = express();
const db = new sqlite3.Database(':memory:');

// Set up middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));

// Create the users table and add a default user
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT)");
    db.run("INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)", ["kunal", "kunal"]);
});

// Serve login.html by default
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            req.session.user = row;
            res.status(200).json({ message: "Login successful" });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    });
});

// Registration endpoint
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, password], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: "User registered successfully" });
    });
});

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
}

// API request endpoint
app.post('/api_request', isAuthenticated, async (req, res) => {
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
});


