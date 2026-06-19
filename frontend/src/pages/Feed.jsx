import axios from "../utils/axiosInstance";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addFeed } from "../utils/feedSlice";
import UserCard from "../components/UserCard";
import { useNavigate } from "react-router-dom";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const user = useSelector((store) => store.user);
  console.log(feed);
  const dispatch = useDispatch();
  const getFeed = async () => {
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res.data.feed));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feed) return;
  if (feed.length <= 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="text-4xl sm:text-8xl">👨‍💻</div>

        <h2 className="text-md sm:text-3xl font-bold mt-4">
          No More Developers Found
        </h2>

        <p className="text-gray-500 mt-3 max-w-md text-xs px-4 sm:text-base">
          You've successfully reviewed every developer on DevPairr. Time to grab
          a coffee ☕ while we find more amazing people for you.
        </p>
      </div>
    );
  }
  return (
    feed && (
      <div>
        <UserCard user={feed[feed.length - 1]} />
      </div>
    )
  );
};

export default Feed;
