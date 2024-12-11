import {
  Avatar,
  Button,
  Card,
  Input,
  Textarea,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserInfo, updateUserProfile } from "../store/userService";
import toast from "react-hot-toast";

export const EditProfile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [avatar, setAvatar] = useState(null);
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
      console.log(user);
      
      if (user) setUserInfo(user);
      setIsLoading(false);
    };

    getUserInfo();
  }, [tokens, navigate]);

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tokens) {
      toast.error("You must be logged in to update your profile.");
      return;
    }

    const formData = new FormData();
    if (avatar) {
      formData.append("file", avatar);
    }
    formData.append("username", userInfo?.username || "User");
    formData.append("fullName", e.target.fullName.value);
    formData.append("website", e.target.website.value);
    formData.append("bio", e.target.bio.value);
    formData.append("email", e.target.email.value);
    formData.append("phone", e.target.phone.value);
    formData.append("gender", e.target.gender.value);

    const success = await updateUserProfile(formData, tokens);
    if (success) {
      // Optionally refetch user data or update UI
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  function cleanPath(path) {
    // Use a regular expression to remove any duplicate slashes
    return path.replace(/^\/static\/uploads\//, '');
}

// Example usage:

let cleanedPath = cleanPath(userInfo.avatar);
console.log("cleandedPath",cleanedPath);

  
  return (
    <div className="sm:pt-16">
      <Card className="w-full max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar src={'http://localhost:5000/'+cleanedPath || "https://docs.material-tailwind.com/img/face-2.jpg"} alt="avatar" width={96} height={96}/>
            <div>
              <label
                htmlFor="avatar"
                className="cursor-pointer text-blue-500 hover:text-blue-600"
              >
                Change Profile Photo
              </label>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Other fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="username">Username</label>
              <Input
                id="username"
                name="username"
                value={userInfo?.username ||""}
                onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
                disabled
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="fullName">Name</label>
              <Input
                id="fullName"
                name="fullName"
                defaultValue={userInfo?.fullName || ""}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="website">Website</label>
              <Input
                id="website"
                name="website"
                defaultValue={userInfo?.website || ""}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="bio">Bio</label>
              <Textarea
                id="bio"
                name="bio"
                className="h-20"
                defaultValue={userInfo?.bio || ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Private Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="email">Email</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={userInfo?.email || ""}
                  onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone">Phone Number</label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={userInfo?.mobile || ""}
                  onChange={(e) => setUserInfo({ ...userInfo, mobile: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="gender">Gender</label>
                <Input
                  id="gender"
                  name="gender"
                  value={userInfo?.gender || ""}
                  onChange={(e) => setUserInfo({ ...userInfo, gender: e.target.value })}
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">
            UPDATE
          </Button>
        </form>
      </Card>
    </div>
  );
};
