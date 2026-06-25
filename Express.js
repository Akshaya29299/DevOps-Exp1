const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files (CSS, JS, Images)
app.use(express.static(__dirname));

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "24wh1a05b0"
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
        return;
    }
    console.log("Connected to MySQL Database");
});

// Home Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "reistration.html"));
});

// Handle Registration Form
app.post("/register", (req, res) => {

    const { fullname, email, phone, organization, event } = req.body;

    const sql = `
        INSERT INTO registrations
        (fullname, email, phone, organization, event_name)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [fullname, email, phone, organization, event],
        (err, result) => {

            if (err) {
                console.error(err);
                return res.send("Database Error: " + err.message);
            }

            console.log("Registration Saved. ID:", result.insertId);

            res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Success</title>
                    <style>
                        body{
                            font-family:Arial,sans-serif;
                            display:flex;
                            justify-content:center;
                            align-items:center;
                            height:100vh;
                            background:#f5f5f5;
                        }

                        .card{
                            background:white;
                            padding:30px;
                            border-radius:12px;
                            box-shadow:0 0 20px rgba(0,0,0,0.1);
                            text-align:center;
                        }

                        a{
                            display:inline-block;
                            margin-top:15px;
                            text-decoration:none;
                            background:#2575fc;
                            color:white;
                            padding:10px 20px;
                            border-radius:8px;
                        }
                    </style>
                </head>
                <body>

                    <div class="card">
                        <h2>Registration Successful!</h2>
                        <p>Your details have been saved.</p>
                        <a href="/">Register Another Participant</a>
                    </div>

                </body>
                </html>
            `);
        }
    );
});

// View All Registrations
app.get("/registrations", (req, res) => {

    db.query(
        "SELECT * FROM registrations ORDER BY id DESC",
        (err, results) => {

            if (err) {
                return res.send("Database Error");
            }

            let html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Registrations</title>

                <style>
                    body{
                        font-family:Arial,sans-serif;
                        padding:20px;
                    }

                    table{
                        width:100%;
                        border-collapse:collapse;
                    }

                    th,td{
                        border:1px solid #ddd;
                        padding:10px;
                        text-align:left;
                    }

                    th{
                        background:#2575fc;
                        color:white;
                    }

                    tr:nth-child(even){
                        background:#f5f5f5;
                    }
                </style>
            </head>
            <body>

            <h1>Registered Participants</h1>

            <table>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Organization</th>
                    <th>Event</th>
                    <th>Date</th>
                </tr>
            `;

            results.forEach(row => {

                html += `
                <tr>
                    <td>${row.id}</td>
                    <td>${row.fullname}</td>
                    <td>${row.email}</td>
                    <td>${row.phone}</td>
                    <td>${row.organization}</td>
                    <td>${row.event_name}</td>
                    <td>${row.created_at}</td>
                </tr>
                `;
            });

            html += `
            </table>

            </body>
            </html>
            `;

            res.send(html);
        }
    );
});

// Start Server
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});