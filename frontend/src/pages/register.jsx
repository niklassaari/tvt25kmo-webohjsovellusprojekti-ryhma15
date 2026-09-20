import { useState } from "react";

const Register = () => {


const [newusername, setNewusername] = useState(""); 
const [newemail, setNewemail] = useState(""); 
const [newpassword, setNewpassword] = useState(""); 
// error paskaa
const [message, setMessage] = useState("");




// gpt juttuja, hienosäädän sitten kun taulut jne. on pystyssä
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      username: newusername,
      email: newemail,
      password: newpassword
    };

//TESTI KOODI, palauttaa datan mikä rekisteröinnistä lähtee
console.log("REGISTER DATA SENT:", 
  { username: newusername, email: newemail, password: newpassword 
});

    const response = await fetch("http://localhost:3001/user/register", 
      { 
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify(newUser) 
  });


    // testi, console näyttää mitä rekisteörityminen palauttaa
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


return (

<form onSubmit={handleSubmit}>
  
  
  <div className="form-group">
    
    <input 
    type="text"
    className="userinput" 
    id="exampleInputusername"  
    value={newusername} 
    onChange={(e) => setNewusername(e.target.value)}
    placeholder="Enter new username"/>
  </div>

  <div className="form-group">
    
    <input 
    type="email"
    className="emailinput"
    id="exampleInputEmail1" 
    value={newemail} 
    onChange={(e) => setNewemail(e.target.value)}
    placeholder="Enter new email"/>
  </div>

  <div className="form-group">
  
    <input 
    type="password"
    className="passwordinput"
    id="exampleInputPassword1"
    value={newpassword}
    onChange={(e) => setNewpassword(e.target.value)}
    placeholder="Enter new password"/>
  </div>

  <button type="submit" className="register-submit">
        Register new profile
      </button>

  {message && <p>{message}</p>}


</form>
);
};


export default Register;