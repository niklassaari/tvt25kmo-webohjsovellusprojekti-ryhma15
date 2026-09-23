import pool from "./database.js";
import bcrypt from "bcryptjs";
const SALT_ROUNDS = 10;

// Luo käyttäjä
export async function addOne(username, email, password) {
 
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

 const result = await pool.query(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",

 [username, email, hashedPassword]
 );
 return result.rows[0];
}

// Hae kaikki käyttäjät
export async function getAll() {

 const result = await pool.query("SELECT id, username, email FROM users");
 return result.rows;
}


// Validoi käyttäjä kirjautumisessa
export async function authenticateUser(email, password) {

    // pitää ehkä muuttaa $2 jos rakenne vastaa tarpeeks sitä ekaa draftiä, ku id on ekana enne emailia
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



// Tallenna refresh token
export async function saveRefreshToken(id, refreshToken) {

 const result = await pool.query(
 "UPDATE users SET refresh_token = $1 WHERE id = $2 RETURNING id",
 [refreshToken, id]
 );
 return result.rows[0];
}


// Hae käyttäjä refresh tokenin perusteella
export async function getUserByRefreshToken(refreshToken) {
 const result = await pool.query(
        "SELECT id, username, email FROM users WHERE refresh_token = $1",
 [refreshToken]
 );
 return result.rows.length > 0 ? result.rows[0] : null;
}

// tänne jonnekin tilinpoisto
export async function deleteUser(id) {
  const result = await pool.query(
    'DELETE FROM users WHERE id = $1 RETURNING id',
    [id]
  );

  return result.rows[0];
}


// Poista refresh token (logout)
export async function clearRefreshToken(id) {
 const result = await pool.query(
 "UPDATE users SET refresh_token = NULL WHERE id = $1 RETURNING id",
 [id]
 );
 return result.rows[0];
}
