import React, { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL;


export function AuthProvider({ children }) {


  const [user, setUser] = useState(null);


  // Displays changes to the Auth state in the console
  useEffect(() => {
    console.log("AUTH STATE CHANGED, LOGGED IN:", loggedIn);
  }, [user]);

  // loggedIn variable is for easier userState tracking
  // user === null    -> loggedIn = false
  // user !== null    -> loggedIn = true
  const loggedIn = user !== null;

  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);



  // Checks the session when refreshing page
  useEffect(() => {
    refreshToken();
  }, []);


  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Send and receive cookies
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Login failed");
    }

    const data = await res.json();

    // user = null -> user object
    // loggedIn changes false -> true
    setUser({ id: data.id, username: data.username, email: data.email });

    setAccessToken(data.accessToken);
    return data;
  };


  // LOGOUT
  const logout = async () => {

    await fetch(`${API_URL}/user/logout`, {
      method: "POST",
      credentials: "include",
    });

    // sets user's state to null (= logged out)
    setUser(null);
    setAccessToken(null);
  };

  // authorizedFetch automatically refreshes token when needed
  const authorizedFetch = async (url, options = {}) => {
    if (!accessToken) {
      throw new Error("Not authenticated");
    }

    // Adds authorization header
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
    };

    // First request
    let response = await fetch(url, { ...options, headers });

    // If  401 (Unauthorized), attempt to refresh token and retry
    if (response.status === 401) {
      const newToken = await refreshToken();
      if (!newToken) {

        // Token refresh failed - user is no longer logged in
        throw new Error('Session expired. Please login again.');
      }


      // Try again with new token
      headers['Authorization'] = `Bearer ${newToken}`;
      response = await fetch(url, { ...options, headers });
    }

    return response;
  };



  // Delete profile
  const deleteprofile = async (email, password) => {
    const res = await authorizedFetch(`${API_URL}/user/deleteprofile`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Profile deletion failed");
    }
    setUser(null);
    setAccessToken(null);
  };

  const refreshToken = async () => {
    try {
      const res = await fetch(`${API_URL}/user/refresh`, {
        method: "POST",
        credentials: "include", // Send cookie
      });

      if (res.ok) {
        const data = await res.json();
        setAccessToken(data.accessToken);


        // Decodes username from token
        const payload = JSON.parse(atob(data.accessToken.split('.')[1]));
        setUser({ id: payload.id, username: payload.username, email: payload.email });

        return data.accessToken; // Return new token


      } else if (res.status === 401 || res.status === 403) {
        // User isn't logged in
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



  const value = {
    user,
    loggedIn,
    accessToken,
    login,
    logout,
    deleteprofile,
    refreshToken,
    authorizedFetch,
    loading,
  };
  return React.createElement(
    AuthContext.Provider,
    { value: value },
    children
  );
}
export function useAuth() {
  return useContext(AuthContext);
}
