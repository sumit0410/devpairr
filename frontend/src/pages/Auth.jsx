import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInWithPopup } from "firebase/auth";

import { auth, provider } from "../utils/firebase";

const AuthDialog = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  //sign up....
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [signUpData, setSignUpData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.post(
        BASE_URL + "/signup",
        { ...signUpData },
        { withCredentials: true },
      );
      // console.log(res.data.data);
      toast.success(res.data.msg, {
        position: "top-center",
      });
      dispatch(addUser(res?.data?.data));
      setTimeout(() => {
        navigate("/profile");
      }, 0);
    } catch (error) {
      //   console.log(error);

      if (error.response?.data) {
        setError(error.response.data);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  //login....
  const [error, setError] = useState("");
  const [loginData, setLoginData] = React.useState({
    email: "",
    password: "",
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.post(BASE_URL + "/login", loginData, {
        withCredentials: true,
      });
      dispatch(addUser(res.data.user));
      toast.success(res.data.msg, {
        position: "top-center",
      });
      console.log("Redirecting to feed");
      setTimeout(() => {
        navigate("/feed");
      }, 0);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  // google login.....
  const handleGoogleAuth = async () => {
    try {
      setGoogleLoading(true);
      provider.setCustomParameters({
        prompt: "select_account",
      });
      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      console.log(user);
      const res = await axios.post(
        BASE_URL + "/auth/google",
        {
          name: user.displayName,
          email: user.email,
        },
        {
          withCredentials: true,
        },
      );

      dispatch(addUser(res.data.user));
      toast.success(res.data.msg, {
        position: "top-center",
      });

      console.log(res.data.profileCompleted);
      if (res.data.profileCompleted) {
        setTimeout(() => {
          navigate("/feed");
        }, 10);
      } else {
        setTimeout(() => {
          navigate("/profile");
        }, 10);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.msg);
      }
      console.log(error);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className=" text-xs sm:text-sm rounded-full px-4 py-2"
        >
          Get Started
        </Button>
      </DialogTrigger>

      <DialogContent className="overflow-hidden border-none p-0 rounded-3xl">
        <div className="grid md:grid-cols-1">
          <div className="p-8 sm:p-10">
            <DialogHeader className="">
              <DialogTitle className="text-xl sm:text-3xl font-bold">
                {isLogin ? "Welcome back" : "Create account"}
              </DialogTitle>

              <DialogDescription className="text-xs sm:text-sm">
                {isLogin
                  ? "Login to continue your developer journey."
                  : "Join the developer community today."}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-8 space-y-4">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    onChange={handleSignUpChange}
                    className="h-11 text-xs sm:text-sm rounded-xl"
                    placeholder="First Name"
                    name="firstName"
                    value={signUpData.firstName}
                  />

                  <Input
                    name="lastName"
                    value={signUpData.lastName}
                    onChange={handleSignUpChange}
                    className="h-11 text-xs sm:text-sm rounded-xl"
                    placeholder="Last Name"
                  />
                </div>
              )}

              <Input
                type="email"
                placeholder="Email address"
                className="h-11 text-xs sm:text-sm rounded-xl"
                name="email"
                value={isLogin ? loginData.email : signUpData.email}
                onChange={isLogin ? handleLoginChange : handleSignUpChange}
              />

              <Input
                type="password"
                name="password"
                placeholder="Password"
                className="h-11 text-xs sm:text-sm rounded-xl"
                value={isLogin ? loginData.password : signUpData.password}
                onChange={isLogin ? handleLoginChange : handleSignUpChange}
              />
              <p className="text-red-500 text-left my-1">{error}</p>
              <Button
                onClick={isLogin ? handleLogin : handleSignUp}
                className="w-full text-xs sm:text-sm h-11 rounded-xl mt-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isLogin ? "Logging in..." : "Creating account..."}
                  </>
                ) : isLogin ? (
                  "Login"
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>
            <div className="flex items-center my-2">
              <div className="grow border-t-[0.1px] border-gray-300"></div>

              <span className="mx-4 text-sm text-gray-500">or</span>

              <div className="grow border-t-[0.1px] border-gray-300"></div>
            </div>
            <div>
              <Button
                variant="outline"
                className="w-full text-xs sm:text-sm"
                onClick={handleGoogleAuth}
                disabled={googleLoading}
              >
                {googleLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Continue with Google"
                )}
              </Button>
            </div>

            <div className="mt-6 text-center text-xs sm:text-sm">
              {isLogin ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={() => {
                      setError("");
                      setIsLogin(false);
                    }}
                    className="font-medium hover:underline"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => {
                      setError("");
                      setIsLogin(true);
                    }}
                    className="font-medium hover:underline"
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
