// src/components/Signup.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button, Input, Typography } from "@material-tailwind/react";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    // Basic client-side validation
    if (!username || !email || !password || !mobile) {
      toast.error("All fields are required!",{
        icon: '😵',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      return;
    }

    // Check for valid email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address",{
        icon: '😵‍💫',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      return;
    }

    // Check for valid mobile number format
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      toast.error("Please enter a valid 10-digit mobile number",{
        icon: '😵‍💫',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      
      return;
    }

    // Check for valid password format
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be at least 8 characters long and contain at least one letter and one number"
      );
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/signup", {
        username,
        email,
        password,
        mobile,
      });
      setSuccess(response.data.msg);
      setUsername("");
      setEmail("");
      setPassword("");
      setMobile("");
      setError("");
      toast.success("Account created Successfully !!",{
        icon: '🎉',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    } catch (error) {
      toast.error("Signup failed, please try again",{
        icon: '😵‍💫',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    }
    if (success) {
      // Redirect to the login page on successful signup
      toast.success("Account created Successfully !!",{
        icon: '🎉',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      navigate("/home");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="w-full max-w-sm p-8 bg-white shadow-md rounded-lg flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center mb-6">Signup</h2>
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          size="lg"
          label="Username"
        />

        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          size="lg"
          label="Email"
        />
    
        <Input
          type="text"
          maxLength={10}
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          size="lg"
          label="Mobile Number"
        />
        
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          size="lg"
          label="Password"
        />

        <Button fullWidth onClick={handleSignup}>
          Signup
        </Button>
        
        <Typography variant="small" className="mt-6 flex justify-center">
          Don&apos;t have an account?
          <Typography
            as="a"
            onClick={() => navigate("/")}
            variant="small"
            color="blue-gray"
            className="ml-1 font-bold cursor-pointer"
          >
            Login
          </Typography>
        </Typography>
      </div>
    </div>
  );
};

export default Signup;
