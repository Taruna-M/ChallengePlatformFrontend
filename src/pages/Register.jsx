import { useForm } from "react-hook-form";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Register = () => {
  const { register, handleSubmit, setError, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState("");

  const onSubmit = async (data) => {
    try {
      await axios.post("/auth/register/", data);
      alert("Registration successful! You can now log in.");
      navigate("/login");
    } catch (error) {
      if (!error.response) {
        setGlobalError("Server is not responding. Please try again later.");
        return;
      }

      console.log("Error:", error.response.data);

      const errorData = error.response.data;

      if (errorData.username) {
        setError("username", { type: "manual", message: errorData.username[0] });
      }
      if (errorData.email) {
        setError("email", { type: "manual", message: errorData.email[0] });
      }
      if (errorData.password) {
        setError("password", { type: "manual", message: errorData.password[0] });
      }

      setGlobalError("Please fix the errors before submitting.");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {globalError && <p style={{ color: "red" }}>{globalError}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input type="text" placeholder="Username" {...register("username")} required />
          {errors.username && <p style={{ color: "red" }}>{errors.username.message}</p>}
        </div>

        <div>
          <input type="email" placeholder="Email" {...register("email")} required />
          {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
        </div>

        <div>
          <input type="password" placeholder="Password" {...register("password")} required />
          {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
