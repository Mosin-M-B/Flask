import {
    Avatar,
    Button,
    Card,
    Input,
    Textarea,
  } from "@material-tailwind/react";
  import axios from "axios";
  import { useEffect, useState } from "react";
  import toast from "react-hot-toast";
  import { useNavigate } from "react-router-dom";
  
  export const EditProfile = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [avatar, setAvatar] = useState(null);
    const tokens = localStorage.getItem("token");
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchUserInfo = async () => {
        setIsLoading(true);
        if (!tokens) {
          navigate("/");
          return;
        }
  
        try {
          const response = await axios.get("http://localhost:5000/user-info", {
            headers: { Authorization: `Bearer ${tokens}` },
          });
          if (response.data.user) {
            setUserInfo(response.data.user);
          } else {
            toast.error("User information not found.");
          }
        } catch (error) {
          toast.error("Failed to fetch user info.");
          navigate("/");
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchUserInfo();
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
  
      try {
        const response = await axios.post(
          "http://localhost:5000/update-profile",
          formData,
          {
            headers: {
              Authorization: `Bearer ${tokens}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success(response.data.msg);
      } catch (error) {
        toast.error("Failed to update profile.");
      }
    };
  
    if (isLoading) {
      return <div>Loading...</div>;
    }
  
    return (
      <div className="sm:pt-16">
        <Card className="w-full max-w-2xl mx-auto p-6">
          <h1 className="text-2xl font-bold">Edit Profile</h1>
  
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar src={userInfo?.avatar || "./assets/logo.png"} alt="avatar" />
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
                  value={userInfo?.username || "User"}
                  onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
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
              Submit
            </Button>
          </form>
        </Card>
      </div>
    );
  };
  