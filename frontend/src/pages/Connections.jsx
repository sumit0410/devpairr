import axios from "../utils/axiosInstance";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

import { Avatar, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Chat from "./Chat";

const Connections = () => {
  const [search, setSearch] = useState("");
  const [openChat, setOpenChat] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const connections = useSelector((store) => store.connections);
  // console.log(connections);
  const dispatch = useDispatch();
  const getConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (error) {
      console.log(error);
    }
  };

  const filteredConnections = (connections || []).filter((user) => {
    const fullName = `${user?.firstName} ${user?.lastName}`.toLowerCase();

    const searchText = search.toLowerCase();

    return (
      fullName.includes(searchText) ||
      user.about?.toLowerCase().includes(searchText)
      // user.skills.some((skill) => skill.toLowerCase().includes(searchText))
    );
  });
  useEffect(() => {
    getConnections();
  }, []);
  if (!connections) return;
  return (
    connections && (
      <div className="max-w-6xl mx-auto p-6">
        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-lg sm:text-base md:text-2xl font-bold">
              Your Connections
            </h1>

            <p className=" text-xs sm:text-base md:text-sm text-muted-foreground mt-1">
              Connect and chat with developers
            </p>
          </div>

          <Input
            placeholder="Search by name, skill..."
            className="max-w-sm text-xs sm:text-base md:text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* CONNECTIONS GRID */}

        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          {connections.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
              <div className="text-4xl sm:text-8xl">👨‍💻</div>

              <h2 className="text-md sm:text-3xl font-bold mt-4">
                No Connections Found
              </h2>
            </div>
          ) : (
            filteredConnections.map((item) => {
              const {
                _id,
                firstName,
                lastName,
                age,
                photoUrl,
                gender,
                location,
                about,
                skills,
                headline,
                linkedIn,
                instagram,
                github,
                twitter,
              } = item;
              return (
                <Card
                  key={_id}
                  className="rounded-2xl transition hover:shadow-lg"
                >
                  <CardContent className=" flex justify-between items-center p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={photoUrl} />
                          </Avatar>
                        </div>

                        <div>
                          <h2 className=" font-semibold text-sm sm:text-lg">
                            {firstName + " " + (!lastName ? "" : lastName)}
                          </h2>

                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {headline}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}

                    <div className="flex flex-col-reverse sm:flex-row items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="flex text-xs sm:text-base md:text-sm"
                            onClick={() => {
                              setSelectedUser(item);
                              setOpenChat(true);
                            }}
                          >
                            Message
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <div className="flex items-center py-2 gap-3">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={photoUrl} />
                              </Avatar>
                              <div>
                                <DialogTitle className="text-base sm:text-base md:text-sm">
                                  {firstName +
                                    " " +
                                    (!lastName ? "" : lastName)}
                                </DialogTitle>
                                <DialogDescription className="text-xs">
                                  {headline}
                                </DialogDescription>
                              </div>
                            </div>
                          </DialogHeader>
                          {selectedUser && (
                            <Chat
                              targetUserId={selectedUser._id}
                              targetUser={selectedUser}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="text-xs sm:text-base md:text-sm"
                          >
                            View Profile
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <div className="flex items-center gap-2">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={photoUrl} />
                              </Avatar>
                              <div>
                                <DialogTitle>
                                  {firstName +
                                    " " +
                                    (!lastName ? "" : lastName)}
                                </DialogTitle>
                                <DialogDescription className="text-xs">
                                  {headline}
                                </DialogDescription>
                              </div>
                            </div>

                            {location && (
                              <DialogDescription className="flex items-center gap-1">
                                {" "}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  class="lucide lucide-map-pin-icon lucide-map-pin"
                                >
                                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                                  <circle cx="12" cy="10" r="3" />
                                </svg>
                                {location}
                              </DialogDescription>
                            )}
                            <DialogDescription>{about}</DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <div className="flex items-center gap-2">
                              {github && (
                                <Link to={github} target="_blank">
                                  {" "}
                                  <svg
                                    className=" text-gray-700 dark:text-white"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      fill-rule="evenodd"
                                      d="M12.006 2a9.847 9.847 0 0 0-6.484 2.44 10.32 10.32 0 0 0-3.393 6.17 10.48 10.48 0 0 0 1.317 6.955 10.045 10.045 0 0 0 5.4 4.418c.504.095.683-.223.683-.494 0-.245-.01-1.052-.014-1.908-2.78.62-3.366-1.21-3.366-1.21a2.711 2.711 0 0 0-1.11-1.5c-.907-.637.07-.621.07-.621.317.044.62.163.885.346.266.183.487.426.647.71.135.253.318.476.538.655a2.079 2.079 0 0 0 2.37.196c.045-.52.27-1.006.635-1.37-2.219-.259-4.554-1.138-4.554-5.07a4.022 4.022 0 0 1 1.031-2.75 3.77 3.77 0 0 1 .096-2.713s.839-.275 2.749 1.05a9.26 9.26 0 0 1 5.004 0c1.906-1.325 2.74-1.05 2.74-1.05.37.858.406 1.828.101 2.713a4.017 4.017 0 0 1 1.029 2.75c0 3.939-2.339 4.805-4.564 5.058a2.471 2.471 0 0 1 .679 1.897c0 1.372-.012 2.477-.012 2.814 0 .272.18.592.687.492a10.05 10.05 0 0 0 5.388-4.421 10.473 10.473 0 0 0 1.313-6.948 10.32 10.32 0 0 0-3.39-6.165A9.847 9.847 0 0 0 12.007 2Z"
                                      clip-rule="evenodd"
                                    />
                                  </svg>
                                </Link>
                              )}

                              {linkedIn && (
                                <Link to={linkedIn} target="_blank">
                                  {" "}
                                  <svg
                                    className=" text-gray-700 dark:text-white"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="25"
                                    height="25"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      fill-rule="evenodd"
                                      d="M12.51 8.796v1.697a3.738 3.738 0 0 1 3.288-1.684c3.455 0 4.202 2.16 4.202 4.97V19.5h-3.2v-5.072c0-1.21-.244-2.766-2.128-2.766-1.827 0-2.139 1.317-2.139 2.676V19.5h-3.19V8.796h3.168ZM7.2 6.106a1.61 1.61 0 0 1-.988 1.483 1.595 1.595 0 0 1-1.743-.348A1.607 1.607 0 0 1 5.6 4.5a1.601 1.601 0 0 1 1.6 1.606Z"
                                      clip-rule="evenodd"
                                    />
                                    <path d="M7.2 8.809H4V19.5h3.2V8.809Z" />
                                  </svg>
                                </Link>
                              )}
                              {twitter && (
                                <Link to={twitter} target="_blank">
                                  <svg
                                    className="text-gray-700 dark:text-white"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.31l-4.934-6.89Z" />
                                  </svg>
                                </Link>
                              )}
                              {instagram && (
                                <Link to={instagram} target="_blank">
                                  <svg
                                    className=" text-gray-700 dark:text-white"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="22"
                                    height="22"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      fill="currentColor"
                                      fill-rule="evenodd"
                                      d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z"
                                      clip-rule="evenodd"
                                    />
                                  </svg>
                                </Link>
                              )}
                            </div>
                            <DialogClose asChild>
                              <Button variant="outline">Close</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
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

export default Connections;
