import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card } from '@material-tailwind/react';
import { Grid, MessageCircle, Settings } from 'lucide-react';
import { Img } from "react-image";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Logo from "./Logo";

export const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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

  if (isLoading) {
    return <div>Loading...</div>;
  }
  console.log("userInfo",userInfo);
  
  return (
    <div className="xl:w-[900px] container xl:ml-[20%] px-4 py-8 flex gap-8 xl:pt-24 xl:space-y-0 flex-col sm:pt-20 ">
      <div className="w-1/3 xl:block sm:hidden"></div>
      <div className="flex flex-col md:flex-row">
        {/* Profile Header */}
        <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
          <img
            src="./assets/logo.png"
            alt="Profile Picture"
            width={150}
            height={150}
            className="rounded-full"
          />
        </div>
        <div className="flex-grow">
          <div className="flex flex-col md:flex-row md:items-center mb-4">
            <h1 className="text-2xl font-bold mr-4"> {userInfo?.username}</h1>
            <div className="flex mt-2 md:mt-0">
              <Button className="mr-2" onClick={()=> navigate("/account/edit-profile")}>Edit Profile</Button>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex mb-4">
            <span className="mr-6"><strong>100</strong> posts</span>
            <span className="mr-6"><strong>1,234</strong> followers</span>
            <span><strong>567</strong> following</span>
          </div>
          <div>
            <h2 className="font-bold">{userInfo?.fullName}</h2>
            <p className="w-1/2">{userInfo?.bio}</p>
            <a href="#" className="text-blue-600">{userInfo?.website}</a>
          </div>
        </div>
      </div>

      {/* Posts Grid and Sidebar */}
      <div className="mt-8 flex flex-col md:flex-row">
        <div className="flex-grow">
          <div className="border-t border-gray-300 pt-4">
            <Button variant="ghost" className="mr-4">
              <Grid className="h-4 w-4 mr-2" /> Posts
            </Button>
            <Button variant="ghost">
              <MessageCircle className="h-4 w-4 mr-2" /> Tagged
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
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
