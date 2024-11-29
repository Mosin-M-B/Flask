// src/components/Signup.js
import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mobile, setMobile] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate();
  
  const handleSignup = async () => {
    // Basic client-side validation
    if (!username || !email || !password) {
      setError('All fields are required!')
      return
    }

    // Check for valid email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    // Check for valid mobile number format
    const mobileRegex = /^[0-9]{10}$/
    if (!mobileRegex.test(mobile)) {
      setError('Please enter a valid 10-digit mobile number')
      return
    }

    // Check for valid password format
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long and contain at least one letter and one number')
      return
    }



    try {
      const response = await axios.post('http://localhost:5000/signup', { username, email, password , mobile })
      setSuccess(response.data.msg)
      setUsername('')
      setEmail('')
      setPassword('')
      setMobile('')
      setError('')
    } catch (error) {
      setError('Signup failed, please try again')
    }
    if (success) {
      // Redirect to the login page on successful signup
      window.location.href = '/'
    }
  }

  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="w-full max-w-sm p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Signup</h2>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center mb-4">{success}</p>}

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
          <input
            type="number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Mobile Number"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSignup}
          className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Signup
        </button>
        <div className="mt-4 text-center">
          <p className="text-sm">
            already have an account?{" "}
            <span
              onClick={() => navigate("/")}
              className="text-blue-500 hover:underline cursor-pointer"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
