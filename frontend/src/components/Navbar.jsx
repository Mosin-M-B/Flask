import { Home, Search, PlusSquare, Heart, User, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export const Nav = () => {
  const tokens = localStorage.getItem("token");
  const [token, setToken] = useState(tokens);
  const navigate = useNavigate();
  console.log(token);


    const handleLogout = () => {
        console.log("navbar",tokens);
        localStorage.removeItem("token");
        toast.success("Logged out successfully");
        navigate("/");
      };

  
  return (
    <nav className="fixed left-0 right-0 bg-white border-b border-gray-200 top-auto bottom-0 md:top-0 md:bottom-auto z-20 xl:hidden">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 ">
          
          <div className="flex items-center space-x-4 sm:w-full sm:justify-center sm:gap-[10%]">
            <Link to="/home" className="text-gray-700 hover:text-black">
              <Home className="w-6 h-6" />
            </Link>
            <Link to="/search" className="text-gray-700 hover:text-black">
              <Search className="w-6 h-6" />
            </Link>
            <Link to="/create" className="text-gray-700 hover:text-black">
              <PlusSquare className="w-6 h-6" />
            </Link>
            <Link to="/activity" className="text-gray-700 hover:text-black">
              <Heart className="w-6 h-6" />
            </Link>
            <Link to="/account" className="text-gray-700 hover:text-black">
              <User className="w-6 h-6" />
            </Link>
            
          </div>
        </div>
      </div>
    </nav>
  );
};
