// tää pitää pushaa sit, selvitä route jututki

import {
 getAll,
 addOne,
 authenticateUser,
 saveRefreshToken,
 getUserByRefreshToken,
 clearRefreshToken
} from "../models/usermodel.js";

import {
 generateAccessToken,
 generateRefreshToken,
 verifyRefreshToken
} from "../middleware/jwt.js";

// Hae kaikki käyttäjät
export async function getUsers(req, res, next) {
 try {
 const users = await getAll();
 res.json(users);
 } catch (err) {
 next(err);
 }
}

// Rekisteröi uusi käyttäjä
export async function addUser(req, res, next) {
 try {
 const { username, email, password } = req.body;

  if (!username || !email || !password) {
 return res.status(400).json({ error: "Username, email and password are required"
});


 }
    
 
 const user = await addOne(username, email, password);
 res.status(201).json({ message: "User created successfully",
            username: user.username,
            email: user.email
 
}); 


// HUOM: usernamenki pitää sitten ola UQ

} catch (err) {

 if (err.code === '23505') { // PostgreSQL unique violation
 return res.status(409).json({ error: "Username already exists" });
 }
 next(err);
 }
}
// Kirjaudu sisään 
// 
//tähän piti vaihtaa id
export async function login(req, res, next) {
 try {
 const { email, password } = req.body;
 if (!email || !password) {
 return res.status(400).json({ error: "Email and password are required"
});

}
 const user = await authenticateUser(email, password);
 if (!user) {
 return res.status(401).json({ error: "Invalid email or password" });
 }

 // Luo tokenit
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);


        //HUOM: refreshToken taulu pitää sitten olla
 // Tallenna refresh token tietokantaan


 //tuossa alunperin username, vaihdoin id:hen

        await saveRefreshToken(user.id, refreshToken);
 

 // Aseta refresh token HTTP-only cookieen
 res.cookie("refreshToken", refreshToken, {
 httpOnly: true, // Ei JavaScript-pääsyä
 secure: process.env.NODE_ENV === "production", // HTTPS tuotannossa
 sameSite: "strict", // CSRF-suojaus
 maxAge: 7 * 24 * 60 * 60 * 1000, // 7 päivää
 });


 res.json({
 message: "Login successful",
 username: user.username,
 accessToken
 });


 } catch (err) {
 next(err);
 }
}


// Päivitä access token
export async function refreshAccessToken(req, res, next) {
 try {
 const refreshToken = req.cookies.refreshToken;
 if (!refreshToken) {
 return res.status(401).json({ error: "Refresh token required" });
 }


 // Validoi refresh token
 const decoded = verifyRefreshToken(refreshToken);
 if (!decoded) {
 return res.status(403).json({ error: "Invalid or expired refresh token" });
 }


 // Tarkista että token on tietokannassa
 const user = await getUserByRefreshToken(refreshToken);
 if (!user) {
 return res.status(403).json({ error: "Invalid refresh token" });
 }


 // Luo uusi access token
        const accessToken = generateAccessToken(user);
 res.json({ accessToken });
 } catch (err) {
 next(err);
 }
}


// Kirjaudu ulos
export async function logout(req, res, next) {
 try {
 const refreshToken = req.cookies.refreshToken;
 if (refreshToken) {
 const user = await getUserByRefreshToken(refreshToken);
 if (user) {

 // Poista refresh token tietokannasta

 // tässä username alunperin, id oikein

 await clearRefreshToken(user.id);
 }
 }

 
 // Poista cookie
 res.clearCookie("refreshToken");
 res.json({ message: "Logout successful" });
 } catch (err) {
 next(err);
 }
}
