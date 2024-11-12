// src/components/Signup.js
import React, { useState } from 'react'
import axios from 'axios'

const Signup = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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

    try {
      const response = await axios.post('http://localhost:5000/signup', { username, email, password })
      setSuccess(response.data.msg)
      setUsername('')
      setEmail('')
      setPassword('')
      setError('')
    } catch (error) {
      setError('Signup failed, please try again')
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
      </div>
    </div>
  )
}

export default Signup
