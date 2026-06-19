import axios from "../utils/axiosInstance";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

import { useTheme } from "@/components/ThemeProvider";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import AuthDialog from "@/pages/Auth";

const Navbar = () => {
  const { setTheme } = useTheme();

  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <nav className="w-screen mx-auto px-4 sm:px-10 md:px-20 lg:px-22 border-b py-3 flex items-center justify-between">
        <Link to={`${user ? "/feed" : "/"}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              DP
            </div>

            <div className="hidden sm:block">
              <h1 className="font-bold text-lg">DevPairr</h1>

              <p className="text-xs text-muted-foreground">
                Connect Developers
              </p>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {/* <Button variant="ghost">Login</Button> */}
          {user ? (
            <div className="flex gap-2 items-center">
              <p className="text-xs sm:text-base md:text-md">
                Welcome, {user.firstName}
              </p>
              <div>
                <Menubar>
                  <MenubarMenu>
                    <MenubarTrigger>
                      {user.photoUrl ? (
                        <img
                          className="w-8 rounded-full"
                          src={user.photoUrl}
                          alt="UserPhoto"
                        />
                      ) : (
                        <img
                          alt="UserPhoto"
                          className="w-8 rounded-full"
                          src="https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2558760599.jpg"
                        />
                      )}
                    </MenubarTrigger>
                    <MenubarContent>
                      <MenubarGroup>
                        <Link to="/profile">
                          {" "}
                          <MenubarItem className="text-xs sm:text-sm">
                            Profile
                          </MenubarItem>
                        </Link>
                        <Link to="/connections">
                          <MenubarItem className="text-xs sm:text-sm">
                            Connections
                          </MenubarItem>
                        </Link>
                        <Link to="/requests">
                          <MenubarItem className="text-xs sm:text-sm">
                            Pending Requests
                          </MenubarItem>
                        </Link>
                      </MenubarGroup>
                      <MenubarSeparator />
                      <MenubarGroup>
                        <MenubarSub>
                          <MenubarSubTrigger className="text-xs sm:text-sm">
                            Theme
                          </MenubarSubTrigger>
                          <MenubarSubContent>
                            <MenubarGroup>
                              <MenubarItem
                                className="text-xs sm:text-sm"
                                onClick={() => setTheme("light")}
                              >
                                Light
                              </MenubarItem>
                              <MenubarItem
                                className="text-xs sm:text-sm"
                                onClick={() => setTheme("dark")}
                              >
                                Dark
                              </MenubarItem>
                              <MenubarItem
                                className="text-xs sm:text-sm"
                                onClick={() => setTheme("system")}
                              >
                                System
                              </MenubarItem>
                            </MenubarGroup>
                          </MenubarSubContent>
                        </MenubarSub>
                      </MenubarGroup>
                      <MenubarSeparator />
                      <a onClick={handleLogout}>
                        <MenubarGroup>
                          <MenubarItem className="text-xs sm:text-sm">
                            Logout
                          </MenubarItem>
                        </MenubarGroup>
                      </a>
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>
              </div>
            </div>
          ) : (
            <AuthDialog />
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
