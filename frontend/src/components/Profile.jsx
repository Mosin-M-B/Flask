import { useEffect, useState } from "react";

import { Avatar, Button, Card } from "@material-tailwind/react";
import { Grid, MessageCircle, Settings } from "lucide-react";
import { Img } from "react-image";
import { useNavigate } from "react-router-dom";

import { fetchUserInfo } from "../store/userService";
export const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const tokens = localStorage.getItem("token");
  const navigate = useNavigate();

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
  }, [tokens, navigate]);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  console.log("userInfo", userInfo);
  function cleanPath(path) {
    // Use a regular expression to remove any duplicate slashes
    return path.replace(/^\/static\/uploads\//, '');
}
let cleanedPath = cleanPath(userInfo.avatar);
console.log("cleandedPath",cleanedPath);
  return (
    <div className="xl:pt-[5%] xl:ml-[20%] xl:w-[900px] sm:w-full sm:ml-0  sm:p-1">
      <div className="w-1/3 xl:block sm:hidden"></div>
      <div className="flex flex-col md:flex-row p-10">
        <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
          <Avatar
            src={'http://localhost:5000/'+cleanedPath || "https://docs.material-tailwind.com/img/face-2.jpg"}
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
              <strong>100</strong> posts
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
            {[...Array(9)].map((_, i) => (
              <Card key={i} className="aspect-square">
                <Img
                  src={`https://picsum.photos/300/300`}
                  width={300}
                  height={300}
                  className="object-cover w-full h-full"
                  loader={<div>Loading...</div>}
                  error={<div>Error loading image</div>}
                />
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
