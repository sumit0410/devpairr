import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import axios from "axios";
import { BASE_URL } from "./utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "./utils/userSlice";

const Body = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  useEffect(() => {
    // redirect ONLY from landing page
    if (user && location.pathname === "/") {
      navigate("/feed");
    }
  }, [user, location.pathname]);
  const fetchProfile = async () => {
    try {
      const profile = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(profile.data));
      // console.log(profile.data);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/");
      }
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);
  return (
    <div>
      <Navbar />
      <div className="min-h-screen">
        {" "}
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Body;
