import { Avatar, Button, Spinner } from "@material-tailwind/react";
import { fetchUserInfo } from "../store/userService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function SuggestedUsers() {
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
    return <Spinner className="h-10 w-10" />;
  }
  console.log("userInfo", userInfo);

  // This would typically come from an API
  function cleanPath(path) {
    // Use a regular expression to remove any duplicate slashes
    return path.replace(/^\/static\/uploads\//, "");
  }
  let cleanedPath = cleanPath(userInfo.avatar);
  console.log("cleandedPath", cleanedPath);

  return (
    <div className="bg-white p-4 rounded-md border border-gray-200 fixed">
      <h2 className="font-semibold text-gray-500 mb-4">Profile</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar
              src={'http://localhost:5000/'+cleanedPath || "https://docs.material-tailwind.com/img/face-2.jpg"}
              alt={userInfo.username}
              size="xl"
              className="mr-4"
            />
            <div>
              <p className="font-semibold">{userInfo.username}</p>
              <p className="text-sm text-gray-500">{userInfo.fullName}</p>
            </div>
          </div>
          <Button
            variant="link"
            color="white"
            className="hover:text-white hover:bg-black"
            onClick={() => navigate("/account")}
          >
            Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
