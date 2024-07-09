import { useContext, useState } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {updateUser} = useContext(AuthContext);
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    setError('')
   const formData = new FormData(e.target);
   const data = {
      username: formData.get("username"),
      password: formData.get("password"),
   }
   try {
     const response = await apiRequest.post("/auth/login", data);
      updateUser(response.data)
    navigate("/")
   }catch(err){
      console.log(err)
      setError(err.response.data.message)
    
    }finally{
      setLoading(false)
    }

   
  };

  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <input name="username" required type="text" placeholder="Username" />
          <input name="password" required type="password" placeholder="Password" />
          <button disabled={loading} >Login</button>
          {error && <span style={{color: "red"}}>Something went wrong!</span>}
          <Link to="/register">{"Don't"} you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Login;
