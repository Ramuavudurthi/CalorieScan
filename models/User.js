const bcrypt = require('bcryptjs');
const connection = require('../config/db');

class User {
    constructor(id, name, email, phone, password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone; // Add phone to the constructor
        this.password = password;
    }

    static async register(name, email, phone, password, role = 'user') {
        const hashedPassword = await bcrypt.hash(password, 10);
        return new Promise((resolve, reject) => {
            connection.execute(
                'INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)', 
                [name, email, phone, hashedPassword, role],
                (err, result) => {
                    if (err) {
                        console.error('Error executing MySQL query:', err);
                        return reject(err);
                    }
                    resolve({ id: result.insertId, name, email, phone, password: hashedPassword, role });
                }
            );
        });

    }

    static async findByEmail(email) {
        return new Promise((resolve, reject) => {
            connection.execute(
                'SELECT * FROM users WHERE email = ?',
                [email],
                (err, results) => {
                    if (err) reject(err);
                    // Check if we found a user
                    if (results.length > 0) {
                        resolve(results[0]); // Return the first matching user
                    } else {
                        resolve(null); // No user found
                    }
                }
            );
        });
    }

    static async validatePassword(user, password) {
        return bcrypt.compare(password, user.password); // Compare the plain password with the hashed one
    }

    // New method to find user by ID
    static async findById(id) {
        return new Promise((resolve, reject) => {
            connection.execute(
                'SELECT * FROM users WHERE id = ?',
                [id],
                (err, results) => {
                    if (err) reject(err);
                    // Check if we found a user
                    if (results.length > 0) {
                        resolve(results[0]); // Return the first matching user
                    } else {
                        resolve(null); // No user found
                    }
                }
            );
        });
    }
}

module.exports = User;
