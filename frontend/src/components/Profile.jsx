import { useEffect, useState } from "react";
import { Avatar, Button, Card, Spinner } from "@material-tailwind/react";
import { Grid, MessageCircle, Settings } from "lucide-react";
import { Img } from "react-image";
import { useNavigate } from "react-router-dom";

import { fetchImages, fetchUserInfo } from "../store/userService";

export const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const tokens = localStorage.getItem("token");
  const navigate = useNavigate();
  const [allImages, setAllImages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false); // State for controlling the modal visibility
  const [selectedImage, setSelectedImage] = useState(null); // State to store the selected image URL

  useEffect(() => {
    const getUserInfo = async () => {
      setIsLoading(true);
      if (!tokens) {
        navigate("/");
        return;
      }

      const user = await fetchUserInfo(tokens, navigate);
      if (user) setUserInfo(user);
      setIsLoading(false);
    };

    getUserInfo();
    fetchImages(tokens, setAllImages);
  }, [tokens, navigate]);

  if (isLoading) {
    return <Spinner className="h-10 w-10" />;
  }

  // Function to clean the image URL
  function cleanPath(path) {
    return path.replace(/^\/static\/uploads\//, '');
  }

  let cleanedPath = cleanPath(userInfo.avatar);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);  // Set the selected image URL
    setModalOpen(true);  // Open the modal
  };

  const handleCloseModal = () => {
    setModalOpen(false);  // Close the modal
  };
  console.log(userInfo);
  console.log("cleaned path",cleanedPath);
  
  
  return (
    <div className="xl:pt-[5%] xl:ml-[20%] xl:w-[900px] sm:w-full sm:ml-0  sm:p-1">
      <div className="w-1/3 xl:block sm:hidden"></div>
      <div className="flex flex-col md:flex-row p-10">
        <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
          <Avatar
            src={ 'http://localhost:5000/'+ cleanedPath || "https://docs.material-tailwind.com/img/face-2.jpg"}
            alt="avatar"
            size="xxl"
          />
        </div>
        <div className="flex-grow">
          <div className="flex flex-col md:flex-row md:items-center mb-4">
            <h1 className="text-2xl font-bold mr-4"> {userInfo?.username}</h1>
            <div className="flex mt-2 md:mt-0">
              <Button
                className="mr-2"
                onClick={() => navigate("/account/edit-profile")}
              >
                Edit Profile
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex mb-4">
            <span className="mr-6">
              <strong>{allImages.length}</strong> posts
            </span>
            <span className="mr-6">
              <strong>1,234</strong> followers
            </span>
            <span>
              <strong>567</strong> following
            </span>
          </div>
          <div>
            <h2 className="font-bold">{userInfo?.fullName}</h2>
            <p className="xl:w-1/2">{userInfo?.bio}</p>
            <a
              href={userInfo?.website}
              target="_blank"
              className="text-blue-600"
            >
              {userInfo?.website}
            </a>
          </div>
        </div>
      </div>

      {/* Posts Grid and Sidebar */}
      <div className="mt-8 flex flex-col md:flex-row">
        <div className="flex-grow">
          <div className="border-t border-gray-300 pt-4 sm:flex sm:justify-center gap-3">
            <Button variant="ghost" className="w-32 flex gap-1 items-center">
              <Grid className="h-4 w-4 mr-2" /> Posts
            </Button>
            <Button variant="ghost" className="w-32 flex gap-1 items-center">
              <MessageCircle className="h-4 w-4 " /> Tagged
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 p-2">
            {allImages.map((file, i) => (
              <Card 
                key={i} 
                className="aspect-square flex justify-center items-center cursor-pointer"
                onClick={() => handleImageClick(`http://localhost:5000/static/uploads/${file.name}`)}  // Trigger the modal on card click
              >
               {file.name.endsWith(".pdf") ? (
              <embed
                src={`http://localhost:5000/static/uploads/${file.name}`}
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
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for Displaying Image */}
      {modalOpen && (
        <div 
        className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50"
        onClick={handleCloseModal}  // Close modal when the background is clicked
      >
        <div 
          className="bg-white p-4 rounded-lg max-w-3xl max-h-screen overflow-auto"
          onClick={(e) => e.stopPropagation()}  // Prevent closing when clicking inside the modal box
        >
          <button 
            onClick={handleCloseModal} 
            className="absolute top-2 right-2 text-xl text-gray-500"
          >
            X
          </button>
          <img
            src={selectedImage}
            alt="Selected"
            className="w-full max-h-[80vh] object-contain"
          />
        </div>
      </div>
      
      )}
    </div>
  );
};
