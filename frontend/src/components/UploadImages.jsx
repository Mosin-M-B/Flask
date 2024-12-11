import { useEffect, useState } from "react";
import { ImageUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchUserInfo, fetchImages } from "../store/userService";
import { Button } from "@material-tailwind/react";
import toast from "react-hot-toast";

export const UploadImages = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState(""); // Added state for subject
  const [title, setTitle] = useState(""); // Added state for title
  const [allImages, setAllImages] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const getUserInfo = async () => {
      if (!token) {
        navigate("/");
        return;
      }
      const user = await fetchUserInfo(token, navigate);
      console.log(user.avatar);

      if (user) setUserInfo(user);
    };

    getUserInfo();
    fetchImages(token, setAllImages); // Updated line
  }, [token, navigate]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("username", userInfo?.username || "");
    formData.append("email", userInfo?.email || "");
    formData.append("description", description);
    formData.append("subject", subject); // Add subject to formData
    formData.append("title", title); // Add title to formData
    console.log(file);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        alert(data.msg);
        setFile(null);
        setDescription("");
        setSubject(""); // Reset subject
        setTitle(""); // Reset title
        fetchImages(token, setAllImages); // Updated line
      } else {
        alert(data.msg || "Error uploading file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleDownload = (fileName) => {
    const link = document.createElement("a");
    link.href = `http://localhost:5000/static/uploads/${fileName}`;
    link.download = fileName;
    link.target = "_blank"; 
    link.click();
  };
  const handleDelete = async (fileId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/delete-file/${fileId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success(data.msg);
        setAllImages(allImages.filter((file) => file._id !== fileId)); // Update UI
      } else {
        toast.error(data.msg || "Error deleting file.");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };
  console.log(allImages);
  
  return (
    <div className="container w-[1200px] p-4 ml-[18%] pt-[5%] flex flex-col">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col lg:flex-row gap-4 border p-4 rounded-lg shadow-md w-[900px]"
      >
        {/* Left Input Section */}
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4">
          <label
            htmlFor="uploadImage"
            className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-lg cursor-pointer"
          >
            <input
              type="file"
              id="uploadImage"
              name="image"
              className="hidden"
              onChange={handleFileChange}
              required
            />
            {file ? (
              <img
                src={URL.createObjectURL(file)}
                alt="Uploaded"
                className="w-fill h-full object-cover"
              />
            ) : (
              <ImageUp size={48} className="text-gray-500" />
            )}
          </label>
        </div>

        {/* Right Input Section */}
        <div className="flex-1 space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          ></textarea>
          <div className="text-right">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Upload
            </button>
          </div>
        </div>
      </form>

      {/* Display Uploaded Files */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allImages.map((file, idx) => (
          <div key={idx} className="border rounded-lg p-4">
            <h2 className="font-bold">{file.title}</h2> {/* Display title */}
            <h3 className="font-medium">{file.subject}</h3>{" "}
            {/* Display subject */}
            {/* Check file type (image or PDF) */}
            {file.name.endsWith(".pdf") ? (
              <embed
                src={`http://localhost:5000/uploads/${file.name}`}
                type="application/pdf"
                width="100%"
                height="200px"
              />
            ) : (
              <img
                src={`http://localhost:5000/static/uploads/${file.name}`}
                alt={file.name}
                className="w-full"
              />
            )}
            <p>{file.description}</p>
            <div className="w-full flex justify-between">
              <Button
              onClick={() => handleDownload(file.name)}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Download
            </Button>
            <Button
              onClick={() => {handleDelete(file._id)
                console.log("file id",file._id);
                
              }} // Use the file ID for deletion
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Delete
            </Button>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};
