import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Home = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  // Fetch user information on component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the JWT token from localStorage
        if (!token) {
          navigate("/login"); // If no token, redirect to login page
          return;
        }
        
        const response = await axios.get("http://localhost:5000/user-info", {
          headers: {
            Authorization: `Bearer ${token}` // Send token in Authorization header
          }
        });

        if (response.data.user) {
          setUserInfo(response.data.user);
        } else {
          toast.error("User information not found.");
        }
      } catch (error) {
        toast.error("Failed to fetch user info.");
        navigate("/login"); // Redirect to login if there's an error
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    toast.success("Logged out successfully");
    navigate("/"); // Redirect to login page after logout
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Welcome to the Home Page</h2>

      {userInfo ? (
        <div className="mb-4">
          <p><strong>Username:</strong> {userInfo.username}</p>
          <p><strong>Email:</strong> {userInfo.email}</p>
          <p><strong>Mobile:</strong> {userInfo.mobile}</p>
        </div>
      ) : (
        <p>Loading user info...</p>
      )}

      <button
        onClick={handleLogout}
        className="mt-4 py-2 px-4 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
