// User authentication and session management for HotelManolo backend
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, 'users.json');

// Load or initialize users
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    // Default admin user: 26649110E / admin
    const defaultUsers = [{ username: '26649110E', password: bcrypt.hashSync('admin', 10) }];
    fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
    return defaultUsers;
  }
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

const users = loadUsers();

function findUser(username) {
  return users.find(u => u.username === username);
}

function addUser(username, password) {
  if (findUser(username)) throw new Error('User already exists');
  const hash = bcrypt.hashSync(password, 10);
  users.push({ username, password: hash });
  saveUsers(users);
}

function verifyUser(username, password) {
  const user = findUser(username);
  if (!user) return false;
  return bcrypt.compareSync(password, user.password);
}

module.exports = {
  sessionMiddleware: session({
    secret: process.env.SESSION_SECRET || 'hotelmanolo_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true },
  }),
  verifyUser,
  addUser,
  findUser,
};
