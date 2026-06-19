import axios from "../utils/axiosInstance";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequest, removeRequest } from "../utils/requestsSlice";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const getRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequest(res.data.data));
    } catch (error) {
      console.log(error);
    }
  };

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true },
      );
      dispatch(removeRequest(_id));
      if (status === "rejected") {
        toast.error("Request Rejected");
      } else {
        toast.success("Request Accepted");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRequests();
  }, []);

  if (!requests) return;
  return (
    requests && (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-lg sm:text-base md:text-2xl font-bold">
              Pending Requests
            </h1>

            <p className=" text-xs sm:text-base md:text-sm text-muted-foreground mt-1">
              Connect and chat with developers
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
              <div className="text-4xl sm:text-8xl">👨‍💻</div>

              <h2 className="text-md sm:text-3xl font-bold mt-4">
                No Pending Requests Found
              </h2>
            </div>
          ) : (
            requests.map((request) => {
              const {
                firstName,
                lastName,
                age,
                photoUrl,
                gender,
                headline,
                about,
              } = request.fromUserId;
              return (
                <Card
                  key={request._id}
                  className="rounded-2xl transition hover:shadow-lg"
                >
                  <CardContent className=" flex justify-between items-center p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar className="w-12 h-12">
                            {photoUrl ? (
                              <AvatarImage src={photoUrl} />
                            ) : (
                              <AvatarImage src="https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2558760599.jpg" />
                            )}
                          </Avatar>
                        </div>

                        <div>
                          <h2 className="font-semibold text-sm sm:text-lg">
                            {firstName + " " + (!lastName ? "" : lastName)}
                          </h2>

                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {headline}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}

                    <div className="flex flex-col-reverse sm:flex-row items-center gap-3">
                      <Button
                        onClick={() => reviewRequest("rejected", request._id)}
                        className="flex text-xs sm:text-sm"
                      >
                        Reject
                      </Button>
                      <Button
                        onClick={() => reviewRequest("accepted", request._id)}
                        variant="outline"
                        className="flex text-xs sm:text-sm"
                      >
                        Accept
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    )
  );
};

export default Requests;
