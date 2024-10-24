const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize Express
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (like HTML, CSS, etc.)
app.use(express.static(path.join('C:/Users/Annie/Downloads/coffee-shop-website-design-main/public')));

// Connect to MySQL Database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Use your MySQL username
    password: 'annie_sql2005', // Use your MySQL password
    database: 'sipandsavor'
});

// Establish the connection
db.connect((error) => {
    if (error) {
        console.error('Error connecting to MySQL:', error);
        return;
    }
    console.log('Connected to MySQL');
});

 //Signup route
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    // Check if the user already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            return res.send('User already exists.');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error inserting data:', err);
                return res.send('Error occurred while signing up.');
            }
            res.redirect('/login.html');
        });
        
    });
});

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
            return res.send('No user found with this email.');
        }

        const foundUser = results[0];

        // Compare password
        const validPassword = await bcrypt.compare(password, foundUser.password);
        if (validPassword) {
            res.redirect('/index.html'); // Redirect to the home page after login
        } else {
            res.send('Incorrect password.');
        }
    });
});
// Listen on port 3000
// Listen on port 3001 instead of 3000
app.listen(3001, () => {
    console.log('Server started on port 3001.');
});
