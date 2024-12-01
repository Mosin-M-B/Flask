import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Button, Typography, Input } from "@material-tailwind/react";

const Login = ({ setType }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email && !username) {
      toast.error("Email or Username is required!");
      return;
    }
    if (!password) {
      toast.error("Password is required!");
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        email,
        password,
      });
      if (response.data.success) {
        // Store the token in local storage
        localStorage.setItem('token', response.data.token);
        navigate("/home");
        toast.success("Account Logged In Successfully !!",{
          icon: '🎉',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      } else {
        toast.error("Invalid credentials",{
          icon: '😵‍💫',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      }
    } catch (error) {
      toast.error("Login failed",{
        icon: '😵‍💫',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    }
  };
  

  return (
    <div className="w-full max-w-sm p-8 bg-white shadow-md rounded-lg flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      <Input
        type="text"
        size="lg"
        label="Email or Username"
        value={email || username}
        onChange={(e) => {
          const value = e.target.value;
          if (value.includes("@")) {
            setEmail(value);
            setUsername("");
          } else {
            setUsername(value);
            setEmail("");
          }
        }}
      />
      <Input
        size="lg"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button fullWidth onClick={handleLogin}>
        Login
      </Button>
      {/* <Typography variant="small" className="mt-6 flex justify-center">
        Don’t have an account?
        <Typography
          as="a"
          onClick={() => {
            setType("signup");
            console.log("setType");
            
          }} // Call setType to switch tab
          variant="small"
          color="blue"
          className="ml-1 font-bold cursor-pointer"
        >
          Sign up
        </Typography>
      </Typography> */}
    </div>
  );
};

export default Login;
