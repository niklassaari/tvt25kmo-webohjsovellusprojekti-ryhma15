import pool from "./database.js";
import bcrypt from "bcryptjs";
const SALT_ROUNDS = 10;



// Create user
export async function addOne(username, email, password) {

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const result = await pool.query(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",

    [username, email, hashedPassword]
  );
  return result.rows[0];
}

// Get all users
export async function getAll() {

  const result = await pool.query("SELECT id, username, email FROM users");
  return result.rows;
}



// Validate user during login
export async function authenticateUser(email, password) {

  const result = await pool.query(
    "SELECT id, username, email, password FROM users WHERE email = $1",
    [email]
  );
  if (result.rows.length === 0) {
    return null;
  }


  const user = result.rows[0];

  const isValid = await bcrypt.compare(password, user.password);
  if (isValid) {
    return {
      id: user.id,
      username: user.username,
      email: user.email
    };
  }
  return null;
}



// Store refresh token
export async function saveRefreshToken(id, refreshToken) {

  const result = await pool.query(
    "UPDATE users SET refresh_token = $1 WHERE id = $2 RETURNING id",
    [refreshToken, id]
  );
  return result.rows[0];
}


// Fetch the user using the refresh token
export async function getUserByRefreshToken(refreshToken) {
  const result = await pool.query(
    "SELECT id, username, email FROM users WHERE refresh_token = $1",
    [refreshToken]
  );
  return result.rows.length > 0 ? result.rows[0] : null;
}

// Delete profile
export async function deleteUser(id) {
  const result = await pool.query(
    'DELETE FROM users WHERE id = $1 RETURNING id',
    [id]
  );

  return result.rows[0];
}


// Delete refresh token (logout)
export async function clearRefreshToken(id) {
  const result = await pool.query(
    "UPDATE users SET refresh_token = NULL WHERE id = $1 RETURNING id",
    [id]
  );
  return result.rows[0];
}
