const sequelize = require("../config/db");

const findUserByUsername = async (username) => {
  const [rows] = await sequelize.query(
    "SELECT * FROM users WHERE username = ?",
    {
      replacements: [username],
    }
  );
  return rows[0];
};

const createUser = async (firstname, lastname, username, password) => {
  await sequelize.query(
    "INSERT INTO users (firstname, lastname, username, password) VALUES (?, ?, ?, ?)",
    {
      replacements: [firstname, lastname, username, password],
    }
  );
};

module.exports = { findUserByUsername, createUser };