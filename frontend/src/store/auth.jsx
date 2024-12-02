import { createContext, useContext, useEffect, useState } from "react";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const AuthorizationToken = `Bearer ${token}`;
  const [isLoading, setIsLoading] = useState(true);
  const storeTokenInLS = (serverToken) => {
    setToken(serverToken);
    localStorage.setItem("token", serverToken);
  };

  const fetchUserInfo = async () => {
    setIsLoading(true);
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/user-info", {
        headers: { Authorization: `Bearer ${token}` },
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

  useEffect(() => {
    fetchUserInfo();
  }, [token, navigate]);

  const handleLogout = () => {
    console.log("navbar", token);
    setToken("");
    toast.success("Logged out successfully");
    navigate("/");
  };


  const getUserData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/user", {
        method: "GET",
        headers: {
          Authorization: AuthorizationToken,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.userData);
        setIsLoading(false);
        console.log(data);
      } else {
        console.error("Error fetching user data");
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //------------
  //services
  //------------
  const getServices = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/data/service", {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        console.log("serviec", data.msg);
        setServices(data.msg);
      }
    } catch (error) {
      console.log(`servicess reeoe from front end ${error}`);
    }
  };
  useEffect(() => {
    getServices();
    if (token) {
      getUserData();
    }
  }, [token]); // Fetch user data whenever token changes

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isLoggedIn,
        storeTokenInLS,
        userInfo,
        handleLogout,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
