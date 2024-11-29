import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Home = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const navigate = useNavigate();

  // Fetch user information on component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/user-info", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.user) {
          setUserInfo(response.data.user);
          fetchUploadedFiles(); // Fetch uploaded files once the user is loaded
        } else {
          toast.error("User information not found.");
        }
      } catch (error) {
        toast.error("Failed to fetch user info.");
        navigate("/login");
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const fetchUploadedFiles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/get-content", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUploadedFiles(response.data.files);
    } catch (error) {
      toast.error("Failed to fetch uploaded files.");
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success("File uploaded successfully.");
        fetchUploadedFiles(); // Refresh the uploaded files
      } else {
        toast.error("Failed to upload the file.");
      }
    } catch (error) {
      toast.error("Upload failed.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
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

      {/* File Upload Form */}
      <div className="mt-6">
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*,application/pdf"
          className="mb-4"
        />
        <button
          onClick={handleUpload}
          className="mt-4 py-2 px-4 bg-blue-500 text-white rounded"
        >
          Upload
        </button>
      </div>

      {/* Display Uploaded Files */}
      <div className="mt-8">
        <h3 className="text-xl font-bold">Uploaded Files:</h3>
        <ul className="mt-4">
          {uploadedFiles.map((file, index) => (
            <li key={index} className="mb-4">
              {file.type === "image" ? (
                <img src={file.url} alt={file.name} className="w-32 h-32 object-cover" />
              ) : (
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  {file.name}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>

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
