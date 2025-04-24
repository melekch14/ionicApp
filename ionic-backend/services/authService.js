const db = require('../db/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'test';

exports.registerUser = async (fullName, email, password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return reject('Hashing failed');

      const query = `INSERT INTO users (fullName, email, password) VALUES (?, ?, ?)`;
      db.run(query, [fullName, email, hashedPassword], function (err) {
        if (err) return reject('User already exists or invalid data');
        resolve('User registered successfully');
      });
    });
  });
};

exports.loginUser = async (email, password) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM users WHERE email = ?`;
    db.get(query, [email], (err, user) => {
      if (err || !user) return reject('User not found');

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (!isMatch) return reject('Invalid credentials');

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
        resolve({ message: 'Login successful', token });
      });
    });
  });
};
