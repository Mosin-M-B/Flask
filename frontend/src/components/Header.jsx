import { Search, LogOut } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";

export const Header = () => {
  const tokens = localStorage.getItem("token");
  const [token, setToken] = useState(tokens);
  const navigate = useNavigate();
  console.log(token);

  const handleLogout = () => {
    console.log("navbar", tokens);
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/");
  };
  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-10 xl:top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold flex items-center justify-between gap-4">
              <Logo/>Ocean Notes
            </Link>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0 xl:block sm:hidden">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-gray-100 rounded-md py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <button className="ml-4 p-2 rounded-full hover:bg-gray-100">
              <LogOut
                className="h-6 w-6 text-gray-500"
                onClick={handleLogout}
              />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
