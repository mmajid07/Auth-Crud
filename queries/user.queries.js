import db from "../config/db.js";

// Get All Users
const getAllUsers = (callback) => {
  db.query("Select * FROM users", callback);
};

//Get Singal User
const getSingleUser = (id, callback) => {
  db.query("SELECT * FROM users WHERE id = ?", [id], callback);
};

//Create User
const createUser = (user, callback) => {
  db.query(
    "INSERT INTO users (name , email , password) values(?, ?, ?)",
    [user.name, user.email, user.password],
    callback
  );
};

// const Check User if Already exisit
const checkUserAlreadyExsist = (email, callback) => {
  db.query(`SELECT * FROM users WHERE email = ?`, [email], callback);
};

// Update User
const updateUser = (id, user, callback) => {
  db.query(
    "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?",
    [user.name, user.email, user.password, id],
    callback
  );
};

// Delete User
const deleteUser = (id, callback) => {
  db.query("DELETE FROM users WHERE id = ?", [id], callback);
};

// Login User
const loginUser = (email, callback) => {
  db.query("SELECT * FROM users WHERE email = ?", [email], callback);
};

export default {
  getAllUsers,
  getSingleUser,
  createUser,
  checkUserAlreadyExsist,
  updateUser,
  deleteUser,
  loginUser,
};
