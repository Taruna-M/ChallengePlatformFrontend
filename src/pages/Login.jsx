import { useForm } from "react-hook-form";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/auth/login/", data);
      const { access, refresh } = response.data;

      // Store tokens securely
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      console.log("Login: access token", access);

      // Set authorization header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;

      alert("Login successful!");
      navigate("/dashboard");  // Redirect after successful login
    } catch (error) {
      // Handle errors properly
      if (error.response) {
        setErrorMessage(error.response.data.detail || "Invalid username or password.");
      } else {
        setErrorMessage("Something went wrong. Try again later.");
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder="Username" {...register("username")} required />
        <input type="password" placeholder="Password" {...register("password")} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
