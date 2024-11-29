// src/components/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@material-tailwind/react";
import { Input } from "@material-tailwind/react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Use navigate hook to redirect

  console.log(email, username, password);

  const id = username || email;

  const handleLogin = async () => {
    if (!id || !password) {
      toast.error("All fields are required!");
      return;
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be at least 8 characters long and contain at least one letter and one number"
      );
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        email,
        password,
      });
      if (response.data.success) {
        // Redirect to the home page on successful login
        navigate("/home");
        toast.success("Login Successfully!!");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 bg-white shadow-md rounded-lg flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        {/* {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )} */}

        <Input
          type="text"
          size="lg"
          label="Email or Username"
          value={email || username}
          onChange={(e) => {
            const value = e.target.value;
            // Check if the value contains '@' to decide if it's an email or username
            if (value.includes("@")) {
              setEmail(value); // Set it as email
              setUsername(""); // Clear username
            } else {
              setUsername(value); // Set it as username
              setEmail(""); // Clear email
            }
          }}
        />

        <Input size="lg" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <Button fullWidth onClick={handleLogin}>
          Login
        </Button>
        {/* Sign Up Link */}
        <div className="mt-4 text-center">
          <p className="text-sm">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-500 hover:underline cursor-pointer"
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
