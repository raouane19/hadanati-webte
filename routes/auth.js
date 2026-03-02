const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");
const nodemailer = require("nodemailer");
require("dotenv").config();

// 1. Configure Email Transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // Use a Google App Password here
    }
});

// ----------------- REGISTER -----------------
router.post("/register/parent", async (req, res) => {
    const { first_name, last_name, email, password, phone } = req.body;

    try {
        const hash = await bcrypt.hash(password, 10);
        // Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        const sql = "INSERT INTO Parents (first_name, last_name, email, password, phone, verification_code) VALUES (?, ?, ?, ?, ?, ?)";
        
        db.query(sql, [first_name, last_name, email, hash, phone, otpCode], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Database error or Email already exists" });
            }

            // Send Email
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Verify your Hadanti Account",
                text: `Hello ${first_name}, your verification code is: ${otpCode}. It will expire soon.`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("Email error:", error);
                    return res.status(500).json({ message: "User saved, but failed to send email." });
                }
                res.json({ message: "Registration successful! Please check your email for the code. ✅" });
            });
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// ----------------- VERIFY OTP -----------------

// ----------------- LOGIN -----------------
// ----------------- LOGIN (PARENTS & DAYCARES) -----------------
router.post("/login", (req, res) => {
    const { email, password, role } = req.body; // role = 'parent' or 'daycare'

    let table = "";
    if (role === "parent") table = "Parents";
    else if (role === "daycare") table = "Daycares";
    else if (role === "admin") table = "Admins";
    else return res.status(400).json({ message: "Invalid role" });

    const sql = `SELECT * FROM ${table} WHERE email = ?`;
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ message: "User not found" });

        const user = results[0];

        // 1. CHECK VERIFICATION STATUS
        // This prevents unverified daycares from logging in
        if (!user.is_verified) {
            return res.status(401).json({ 
                message: "Account not verified. Please check your email for the OTP code." 
            });
        }

        // 2. CHECK PASSWORD
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(403).json({ message: "Wrong password" });

        // 3. GENERATE TOKEN
        const token = jwt.sign(
            { id: user.id, role: role }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
        );

        // 4. DYNAMIC RESPONSE 
        // We return 'name' for Daycares and 'first_name' for Parents
        const displayName = role === "daycare" ? user.name : user.first_name;

        res.json({ 
            message: "Login successful ✅", 
            token,
            user: { 
                id: user.id, 
                email: user.email, 
                name: displayName,
                role: role 
            } 
        });
    });
});

// ----------------- FORGOT PASSWORD -----------------
// Note: the Parents and Daycares tables should each have a `reset_code` VARCHAR(6) column.
router.post("/forgot-password", (req, res) => {
    const { email, role } = req.body;
    let table = "";
    if (role === "parent") table = "Parents";
    else if (role === "daycare") table = "Daycares";
    else return res.status(400).json({ message: "Invalid role" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const sql = `UPDATE ${table} SET reset_code = ? WHERE email = ?`;
    db.query(sql, [code, email], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0)
            return res.status(404).json({ message: "Email not found" });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Hadanti Password Reset",
            text: `Your password reset code is: ${code}. It will expire shortly.`
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.log("Email error:", error);
                return res.status(500).json({ message: "Failed to send email." });
            }
            res.json({ message: "Reset code sent to your email." });
        });
    });
});

// ----------------- RESET PASSWORD -----------------
router.post("/reset-password", async (req, res) => {
    const { email, role, code, newPassword } = req.body;
    let table = "";
    if (role === "parent") table = "Parents";
    else if (role === "daycare") table = "Daycares";
    else return res.status(400).json({ message: "Invalid role" });

    // verify code exists
    const sel = `SELECT id FROM ${table} WHERE email = ? AND reset_code = ?`;
    db.query(sel, [email, code], async (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0)
            return res.status(400).json({ message: "Invalid email or code" });

        try {
            const hash = await bcrypt.hash(newPassword, 10);
            const upd = `UPDATE ${table} SET password = ?, reset_code = NULL WHERE email = ?`;
            db.query(upd, [hash, email], (err) => {
                if (err) return res.status(500).json(err);
                res.json({ message: "Password updated successfully." });
            });
        } catch (e) {
            res.status(500).json(e);
        }
    });
});

// ----------------- DAYCARE REGISTER -----------------
router.post("/register/daycare", async (req, res) => {
    // Destructuring fields based on your provided SQL table
    const { name, email, password, phone, address, capacity, age_range, price } = req.body;

    try {
        const hash = await bcrypt.hash(password, 10);
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        const sql = `INSERT INTO Daycares 
            (name, email, password, phone, address, capacity, age_range, price, verification_code) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        db.query(sql, [name, email, hash, phone, address, capacity, age_range, price, otpCode], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error: Email might already exist or Database connection issue." });
            }

            // Send Verification Email
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Verify your Daycare Account",
                text: `Welcome ${name}! Your daycare verification code is: ${otpCode}.`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("Email error:", error);
                    return res.status(500).json({ message: "Daycare saved, but email failed to send." });
                }
                res.json({ message: "Daycare registration pending. Check email for code! ✅" });
            });
        });
    } catch (err) {
        res.status(500).json(err);
    }
});
// ----------------- DYNAMIC VERIFY OTP -----------------
router.post("/verify-otp", (req, res) => {
    const { email, code, role } = req.body; // Expecting 'parent' or 'daycare'

    let table = "";
    if (role === "parent") table = "Parents";
    else if (role === "daycare") table = "Daycares";
    else return res.status(400).json({ message: "Invalid role" });

    const sql = `SELECT * FROM ${table} WHERE email = ? AND verification_code = ?`;
    
    db.query(sql, [email, code], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(400).json({ message: "Invalid code or email" });

        const updateSql = `UPDATE ${table} SET is_verified = TRUE, verification_code = NULL WHERE email = ?`;
        
        db.query(updateSql, [email], (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: `${role} account verified successfully! ✅` });
        });
    });
});
module.exports = router;