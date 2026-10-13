import {
       getAll,
       addOne,
       authenticateUser,
       saveRefreshToken,
       getUserByRefreshToken,
       clearRefreshToken,
       deleteUser
} from "../models/usermodel.js";

import {
       generateAccessToken,
       generateRefreshToken,
       verifyRefreshToken
} from "../middleware/jwt.js";

// Fetches all the users
export async function getUsers(req, res, next) {
       try {
              const users = await getAll();
              res.json(users);
       } catch (err) {
              next(err);
       }
}

// Register a new user
export async function addUser(req, res, next) {
       try {
              const { username, email, password } = req.body;

              if (!username || !email || !password) {
                     return res.status(400).json({
                            error: "Username, email and password are required"
                     });
              }


              // Makes sure the password has at least one uppercase letter, a number, and a minimum length of 8 characters

              const hasUppercase = /[A-Z]/.test(password);
              const hasNumber = /[0-9]/.test(password);
              const MinLength = password.length >= 8;

              if (!hasUppercase || !hasNumber || !MinLength) {
                     return res.status(400).json({
                            error: "Password requires one uppercase letter, one number, and be at least 8 characters long"
                     });
              }


              const user = await addOne(username, email, password);

              res.status(201).json({
                     message: "User created successfully",
                     username: user.username,
                     email: user.email

              });


              // !!! username also has to be unique

       } catch (err) {

              if (err.code === '23505') {
                     return res.status(409).json({ error: "Username already exists" });
              }
              next(err);
       }
}

// Login 

export async function login(req, res, next) {
       try {
              const { email, password } = req.body;
              if (!email || !password) {
                     return res.status(400).json({
                            error: "Email and password are required"
                     });

              }
              const user = await authenticateUser(email, password);
              if (!user) {
                     return res.status(401).json({ error: "Invalid email or password" });
              }



              // Create tokens
              const accessToken = generateAccessToken(user);
              const refreshToken = generateRefreshToken(user);



              // Saves the refresh token in the database

              await saveRefreshToken(user.id, refreshToken);


              // Sets the refresh token to HTTP-only cookie
              res.cookie("refreshToken", refreshToken, {
                     httpOnly: true, // no JavaScript
                     secure: process.env.NODE_ENV === "production",
                     sameSite: "strict", // CSRF-security
                     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
              });


              res.json({
                     message: "Login successful",
                     id: user.id,
                     username: user.username,
                     email: user.email,
                     accessToken
              });


       } catch (err) {
              next(err);
       }
}


// Refreshes the access token
export async function refreshAccessToken(req, res, next) {
       try {
              const refreshToken = req.cookies.refreshToken;
              if (!refreshToken) {
                     return res.status(401).json({ error: "Refresh token required" });
              }


              // Validates the refresh token
              const decoded = verifyRefreshToken(refreshToken);
              if (!decoded) {
                     return res.status(403).json({ error: "Invalid or expired refresh token" });
              }


              // Makes sure the token is in the database
              const user = await getUserByRefreshToken(refreshToken);
              if (!user) {
                     return res.status(403).json({ error: "Invalid refresh token" });
              }


              // Create new access token
              const accessToken = generateAccessToken(user);
              res.json({ accessToken });
       } catch (err) {
              next(err);
       }
}


// Logout
export async function logout(req, res, next) {
       try {
              const refreshToken = req.cookies.refreshToken;
              if (refreshToken) {
                     const user = await getUserByRefreshToken(refreshToken);

                     // Remove refresh token from database
                     if (user) {
                            await clearRefreshToken(user.id);
                     }
              }

              // Remove cookies
              res.clearCookie("refreshToken");
              res.json({ message: "Logout successful" });

       } catch (err) {
              next(err);
       }
}


export async function deleteprofile(req, res, next) {
       try {
              const { email, password } = req.body;

              const user = await authenticateUser(email, password);

              if (!user) {
                     return res.status(401).json({
                            error: "Incorrect email or password"
                     });
              }

              await deleteUser(user.id);

              res.clearCookie("refreshToken");

              res.json({
                     message: "Profile deleted successfully"
              });
       } catch (err) {
              next(err);
       }
}







