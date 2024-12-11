import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Nav} from "./Navbar"
import SuggestedUsers from "./SuggestedUsers";
import Home2 from "./Home2"
const Home = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const navigate = useNavigate();
  const tokens = localStorage.getItem("token");
  const [token, setToken] = useState(tokens);
  console.log(token);
  
  // Fetch user information on component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      //const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/user-info", {
          headers: { Authorization: `Bearer ${tokens}` },
        });
        if (response.data.user) {
          setUserInfo(response.data.user);
          fetchUploadedFiles(); // Fetch uploaded files once the user is loaded
        } else {
          toast.error("User information not found.");
        }
      } catch (error) {
        toast.error("Failed to fetch user info.");
        navigate("/");
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const fetchUploadedFiles = async () => {
    try {
      // const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/get-content", {
        headers: { Authorization: `Bearer ${tokens}` },
      });
      setUploadedFiles(response.data.files);
    } catch (error) {
      toast.error("Failed to fetch uploaded files.");
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async (event) => {
    // Check the event.target.files
    console.log(event.target.files); // Log to check if files are being captured
  
    const file = event.target.files ? event.target.files[0] : null; // Check if files are available
    if (!file) {
      toast.error("Please select a file!");
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file); // Append the file to the form data
  
    try {
      const response = await axios.post(
        'http://localhost:5000/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${tokens}`, // Include the JWT token for authentication
          },
        }
      );
      console.log(response.data);
      toast.success("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file!");
    }
  };
  
  



  return (
    <div className="pt-[15%] ml-[20%] ">
      <Nav/>
      <h2 className="text-2xl font-bold mb-4">Welcome to the Home Page</h2>

      {userInfo ? (
        <div className="mb-4">
          <p>
            <strong>Username:</strong> {userInfo.username}
          </p>
          <p>
            <strong>Email:</strong> {userInfo.email}
          </p>
          <p>
            <strong>Mobile:</strong> {userInfo.mobile}
          </p>
        </div>
      ) : (
        <p>Loading user info...</p>
      )}

      {/* File Upload Form */}
      <div className="mt-6">
        <form>
          <input
            type="file"
            onChange={handleFileUpload}
            accept="image/*,application/pdf"
          />
        </form>

        <button
          onClick={handleFileUpload}
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
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-32 h-32 object-cover"
                />
              ) : (
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  {file.name}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
      <Home2/>
    </div>
  );
};

export default Home;
