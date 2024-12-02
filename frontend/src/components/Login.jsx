import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "@material-tailwind/react";
import { handleLogin } from "../store/userService";

const Login = ({ setType }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const onLogin = () => {
    handleLogin({ email, username, password, navigate });
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
      <Button fullWidth onClick={onLogin}>
        Login
      </Button>
    </div>
  );
};

export default Login;
