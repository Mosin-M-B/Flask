import { Img } from "react-image";
import { Heart, MessageCircle, Send, Bookmark, Link } from "lucide-react";
import {  Spinner } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
export const Posts = ({ id, user, image, likes, caption, avatar }) => {
  const navigate = useNavigate();
  function cleanPath(path) {
    // Use a regular expression to remove any duplicate slashes
    return path.replace(/^\/static\/uploads\//, "");
  }
  let cleanedPath = cleanPath(avatar);
  console.log(image);

  return (
    <div className="bg-white xl:border xl:border-gray-200 xl:rounded-md sm:w-full">
      <div className="p-4 flex items-center cursor-pointer" onClick={() => navigate(`/profile/${user}`)}>
        {/* User avatar */}

        <img
          src={"http://localhost:5000/" + cleanedPath}
          alt={user}
          className="w-8 h-8 bg-gray-200 rounded-full mr-2 "
        />

        <span className="font-semibold">{user}</span>
       
      </div>

      {/* Post image with a loader */}
      <Img
        src={"http://localhost:5000/" + image}
        alt="Post"
        width={400}
        height={400}
        className="w-full h-auto object-cover flex justify-center items-center"
        loader={<Spinner />}
      />

      <div className="p-4">
        <div className="flex justify-between mb-2">
          <div className="flex space-x-4">
            <Heart className="w-6 h-6" />
            <MessageCircle className="w-6 h-6" />
            <Send className="w-6 h-6" />
          </div>
          <Bookmark className="w-6 h-6" />
        </div>
        <p className="font-semibold mb-1">{likes} likes</p>
        <p>
          <span className="font-semibold mr-2">{user}</span>
          {caption}
        </p>
      </div>
    </div>
  );
};
