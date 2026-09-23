import React, { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL;


export function AuthProvider({ children }) {
// AUTHENTICATION STATE
// null = NOT authenticated / not logged in

// object = AUTHENTICATED / logged in
// example: { username: "Nikke" }
    // setUser(null); 
    // // -> NOT authenticated
// setUser({ username: "Nikke" }); 
// // -> AUTHENTICATED
 const [user, setUser] = useState(null);

 // DEBUG: See whenever the authentication user state changes
useEffect(() => {
  console.log("AUTH STATE CHANGED, LOGGED IN:", user);
}, [user]);
 

 // user === null    -> loggedIn = false
 // user !== null    -> loggedIn = true
    const loggedIn = user !== null;

 const [accessToken, setAccessToken] = useState(null);
 const [loading, setLoading] = useState(true);


 // Tarkista sessio sivun latautuessa
 useEffect(() => {
 refreshToken();
 }, []);


 const login = async (email, password) => {
 const res = await fetch(`${API_URL}/user/login`, {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 credentials: "include", // Lähetä ja vastaanota cookies
 body: JSON.stringify({ email, password }),
 });

 if (!res.ok) {
 const error = await res.json();
 throw new Error(error.error || "Login failed");
 }

 const data = await res.json();

  // This changes user from null -> user object
  // Therefore loggedIn automatically changes from false -> true
 setUser({ username: data.username });

 setAccessToken(data.accessToken);
 return data;
 };


 // LOGOUT
 const logout = async () => {

 await fetch(`${API_URL}/user/logout`, { 
    method: "POST",
    credentials: "include",
 });
 // asettaa userin tilaan null = logged out
 setUser(null);
 setAccessToken(null);
 };

 const refreshToken = async () => {
 try {
 const res = await fetch(`${API_URL}/user/refresh`, {
 method: "POST",
 credentials: "include", // Lähetä cookie
 });

 if (res.ok) {
 const data = await res.json();
 setAccessToken(data.accessToken);

 // Dekoodaa username tokenista
 const payload = JSON.parse(atob(data.accessToken.split('.')[1]));
 setUser({ username: payload.username });

 return data.accessToken; // Palauta uusi token


 } else if (res.status === 401 || res.status === 403) {
 // Käyttäjä ei ole kirjautuneena
 // user = null -> loggedIn = false
 setUser(null);
 setAccessToken(null);
 return null;

 } else {
 console.error("Unexpected error during token refresh:", res.status);
 return null;
 }

 } catch (error) {
 console.error("Token refresh failed:", error);
 return null;

 } finally {
 setLoading(false);
 }
 };

 // Authorized fetch joka automaattisesti uusii tokenin tarvittaessa
 const authorizedFetch = async (url, options = {}) => {
 if (!accessToken) {
 throw new Error("Not authenticated");
 }

 // Lisää Authorization header
 const headers = {
 ...options.headers,
 'Authorization': `Bearer ${accessToken}`,
 };

 // Tee ensimmäinen pyyntö
 let response = await fetch(url, { ...options, headers });

 // Jos saimme 401 (Unauthorized), yritä uusia token ja uudelleen
 if (response.status === 401) {
 const newToken = await refreshToken();
 if (!newToken) {

 // Token refresh epäonnistui - käyttäjä ei ole enää kirjautunut
 throw new Error('Session expired. Please login again.');
 }

 // Yritä uudelleen uudella tokenilla
 headers['Authorization'] = `Bearer ${newToken}`;
 response = await fetch(url, { ...options, headers });
 }

 return response;
 };

 const value = {
 user,

  // NEW: Make loggedIn available to all components using useAuth()
  // gpt sloppia, lisäsin tuon loggedIn niin authContext koodi vähän selkeämpi
 loggedIn,
 accessToken,
 login,
 logout,
 refreshToken,
 authorizedFetch,
 loading,
 };
return React.createElement(
    AuthContext.Provider,
    { value: value },
    children
);}
export function useAuth() {
 return useContext(AuthContext);
}
