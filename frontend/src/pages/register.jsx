import './register.css';
import { useState } from "react";
import { useAuth } from "../context/authContext";

const Register = () => {

  const { loggedIn } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL;

  const [newusername, setNewusername] = useState("");
  const [newemail, setNewemail] = useState("");
  const [newpassword, setNewpassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      username: newusername,
      email: newemail,
      password: newpassword
    };

    console.log("REGISTER DATA SENT:", {
      username: newusername,
      email: newemail,
      password: newpassword
    });

    const response = await fetch(`${API_URL}/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser)
    });

    console.log("Response:", response);
    console.log("Status:", response.status);
    console.log("Content-Type:", response.headers.get("content-type"));

    const data = await response.json();

    if (response.ok) {
      setMessage("Registration successful!");
    } else {
      setMessage("Registration failed.");
    }

    console.log(data);
  };

  // Jos käyttäjä on kirjautunut sisään,
  // Register-sivun sisältöä ei näytetä.
  if (loggedIn) {
    return null;
  }

  return (
    <form className="register-form"onSubmit={handleSubmit}>

      <div className="form-group">
        <input
          type="text"
          className="userinput"
          id="exampleInputusername"
          value={newusername}
          onChange={(e) => setNewusername(e.target.value)}
          placeholder="Enter new username"
        />
      </div>

      <div className="form-group">
        <input
          type="email"
          className="emailinput"
          id="exampleInputEmail1"
          value={newemail}
          onChange={(e) => setNewemail(e.target.value)}
          placeholder="Enter new email"
        />
      </div>

      <div className="form-group">
        <input
          type="password"
          className="passwordinput"
          id="exampleInputPassword1"
          value={newpassword}
          onChange={(e) => setNewpassword(e.target.value)}
          placeholder="Enter new password"
        />
      </div>

      <button type="submit" className="register-submit">
        Register new profile
      </button>

      {message && <p>{message}</p>}

    </form>
  );
};
 
export default Register;