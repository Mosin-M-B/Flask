import { useEffect, useState } from "react";
import { Avatar, Button, Card, Spinner } from "@material-tailwind/react";
import { Grid, MessageCircle, Settings } from "lucide-react";
import { Img } from "react-image";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export const OtherProfile = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [content, setContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/user-profile/${username}`
        );
        setUserData(response.data.user);
        setContent(response.data.content);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
      setIsLoading(false);
    };

    fetchUserProfile();
  }, [username]);

  if (isLoading) {
    return <Spinner className="h-10 w-10" />;
  }

  // Function to clean the image URL
  function cleanPath(path) {
    return path.replace(/^\/static\/uploads\//, "");
  }

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="xl:pt-[5%] xl:ml-[20%] xl:w-[900px] sm:w-full sm:ml-0 sm:p-1">
      <div className="flex flex-col md:flex-row p-10">
        <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
          <Avatar
            src={`http://localhost:5000/${cleanPath(userData.avatar)}` ||
              "https://docs.material-tailwind.com/img/face-2.jpg"}
            alt={userData.username}
            size="xxl"
          />
        </div>
        <div className="flex-grow">
          <div className="flex flex-col md:flex-row md:items-center mb-4">
            <h1 className="text-2xl font-bold mr-4">{userData.fullName || userData.username}</h1>
            <div className="flex mt-2 md:mt-0">
              
            </div>
          </div>
          <div className="flex mb-4">
            <span className="mr-6">
              <strong>{content.length}</strong> posts
            </span>
          </div>
          <div>
            <h2 className="font-bold">{userData.fullName}</h2>
            <p className="xl:w-1/2">{userData.bio}</p>
            <a
              href={userData.website}
              target="_blank"
              className="text-blue-600"
            >
              {userData.website}
            </a>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="mt-8">
        <div className="border-t border-gray-300 pt-4 sm:flex sm:justify-center gap-3">
          <Button variant="ghost" className="w-32 flex gap-1 items-center">
            <Grid className="h-4 w-4 mr-2" /> Posts
          </Button>
          <Button variant="ghost" className="w-32 flex gap-1 items-center">
            <MessageCircle className="h-4 w-4" /> Tagged
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4 p-2">
          {content.map((post, index) => (
            <Card
              key={index}
              className="aspect-square flex justify-center items-center cursor-pointer"
              onClick={() =>
                handleImageClick(`http://localhost:5000/${post.image}`)
              }
            >
              <Img
                src={`http://localhost:5000/${post.image}`}
                alt={post.title}
                width={300}
                height={300}
                className="object-cover w-full h-full"
                loader={<Spinner />}
                error={<div>Error loading image</div>}
              />
            </Card>
          ))}
        </div>
      </div>

      {/* Modal for Displaying Image */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white p-4 rounded-lg max-w-3xl max-h-screen overflow-auto"
            onClick={(e) => e.stopPropagation()}
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
