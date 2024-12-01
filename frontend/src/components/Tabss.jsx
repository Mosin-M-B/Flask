import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import Login from "./Login";
import Signup from "./Signup";
import { useEffect, useState } from "react";
import Logo from "./Logo";

export function Tabss() {
  const [type, setType] = useState("login");

  useEffect(() => {
    console.log("Tab type changed to:", type);
  }, [type]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 w-full">
      
      {/* Tabs Component */}
      <Tabs
        value={type} // Controlled value for Tabs
        onChange={(value) => setType(value)} // Update the state when Tabs change
        className="h-[80vh] xl:w-[50%] sm:w-[90%]"
      >
        {/* Tabs Header */}
        <TabsHeader className="z-10 sticky top-0 bg-white shadow-md">
          {/* Individual Tabs */}
          <Tab value="login">Log In</Tab>
          <Tab value="signup">Sign Up</Tab>
        </TabsHeader>

        {/* Tabs Body */}
        <TabsBody>
          <TabPanel value="login" className="flex gap-4 items-center">
            {/* Pass setType as a prop to Login */}
            <Login setType={setType} />
            <Logo/>
          </TabPanel>
          <TabPanel value="signup" className="flex gap-4 items-center">
            {/* Pass setType as a prop to Signup */}
            <Signup setType={setType} />
            <Logo/>
          </TabPanel>
        </TabsBody>
      </Tabs>
    </div>
  );
}
