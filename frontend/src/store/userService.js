// userService.js
import axios from "axios";
import toast from "react-hot-toast";


const API_BASE_URL = "http://localhost:5000";

export const fetchUserInfo = async (token, navigate) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user-info`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 200 && response.data.user) {
      return response.data.user; // Returns user information including avatar
    } else {
      toast.error("User information not found.");
      navigate("/");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user info:", error.response?.data || error.message);
    toast.error("Failed to fetch user info.");
    navigate("/");
    return null;
  }
};

export const updateUserProfile = async (formData, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/update-profile`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response.data);
    
    toast.success(response.data.msg);
    return true;
  } catch (error) {
    toast.error("Failed to update profile.");
    return false;
  }
};

export const handleLogout = (navigate,setToken) => {
    localStorage.removeItem("token");
    setToken("");
    toast.success("Logged out successfully");
    navigate("/");
  };


export const handleLogin = async ({ email, username, password, navigate }) => {
    if (!email && !username) {
      toast.error("Email or Username is required!");
      return;
    }
    if (!password) {
      toast.error("Password is required!");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        email,
        password,
      });
  
      if (response.data.success) {
        // Store the token in local storage
        localStorage.setItem("token", response.data.token);
        navigate("/home");
        toast.success("Account Logged In Successfully !!", {
          icon: "🎉",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } else {
        toast.error("Invalid credentials", {
          icon: "😵‍💫",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      toast.error("Login failed", {
        icon: "😵‍💫",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };


 