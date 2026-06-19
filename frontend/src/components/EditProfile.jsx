import React, { useState } from "react";
import UserCard from "./UserCard";
import axios from "../utils/axiosInstance";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Check } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { Avatar, AvatarImage } from "@/components/ui/avatar";

const EditProfile = ({ user }) => {
  console.log(user);
  const [photo, setPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    firstName,
    lastName,
    age,
    headline,
    location,
    about,
    gender,
    photoUrl,
    skills,
    linkedIn,
    instagram,
    twitter,
    github,
    profileCompleted,
  } = user;
  const [formData, setFormData] = useState({
    firstName: firstName,
    lastName: lastName,
    photoUrl: photoUrl,
    headline: headline,
    location: location,
    age: age,
    about: about,
    gender: gender?.toLowerCase(),
    skills: skills,
    linkedIn: linkedIn,
    instagram: instagram,
    twitter: twitter,
    github: github,
  });
  //upload photo
  const handlePhotoUpload = async (file) => {
    try {
      setUploading(true);

      const formDataImage = new FormData();

      formDataImage.append("photo", file);

      const res = await axios.post(
        BASE_URL + "/profile/upload-photo",
        formDataImage,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setFormData((prev) => ({
        ...prev,
        photoUrl: res.data.photoUrl,
      }));
    } catch (error) {
      console.log(error);
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const addSkill = (skill) => {
    if (formData.skills.includes(skill)) return;

    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, skill],
    }));
  };
  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleEditProfile = async () => {
    try {
      const res = await axios.patch(BASE_URL + "/profile/edit", formData, {
        withCredentials: true,
      });
      console.log(res.data);
      toast.success(res.data.msg);
      dispatch(addUser(res?.data?.data));
      setTimeout(() => {
        console.log("Redirecting to feed");
        navigate("/feed");
      }, 2000);
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.msg);
      }
      console.log("error: " + error.message);
    }
  };
  return (
    <div className="max-w-6xl mx-auto p-6 flex flex-col-reverse md:flex-row lg:grid-cols-2 gap-8">
      {/* LEFT SIDE */}

      <Card className="rounded-2xl py-4">
        <CardHeader>
          <CardTitle className="text-lg sm:text-2xl">
            {profileCompleted ? "Profile" : "Complete your profile"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <Input
            type="text"
            name="headline"
            maxLength={80}
            onChange={handleChange}
            value={formData.headline}
            required
            placeholder="Headline"
            className="text-xs sm:text-sm"
          />
          <Input
            type="text"
            name="firstName"
            onChange={handleChange}
            value={formData.firstName}
            required
            placeholder="First Name"
            className="text-xs sm:text-sm"
          />

          <Input
            type="text"
            onChange={handleChange}
            value={formData.lastName}
            required
            name="lastName"
            className="text-xs sm:text-sm"
            placeholder="Last Name"
          />
          <Input
            type="text"
            onChange={handleChange}
            value={formData.location}
            required
            name="location"
            className="text-xs sm:text-sm"
            placeholder="Location"
          />

          <Input
            type="text"
            name="age"
            onChange={handleChange}
            value={formData.age}
            required
            className="text-xs sm:text-sm"
            placeholder="Age"
          />
          <Select
            value={formData.gender}
            onValueChange={(value) => {
              setFormData((prev) => ({
                ...prev,
                gender: value,
              }));
            }}
            name="gender"
          >
            <SelectTrigger className="w-full max-w-48">
              <SelectValue placeholder="Select a gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Gender</SelectLabel>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <div>
            <label className="cursor-pointer my-2 mx-2 inline-flex items-center rounded-md">
              Update Profile Picture
            </label>
            <Input
              id="photo-upload"
              type="file"
              accept="image/*"
              name="photoUrl"
              className="text-xs sm:text-sm"
              onChange={(e) => {
                const file = e.target.files[0];

                if (file) {
                  setPhoto(file);
                  handlePhotoUpload(file);
                }
              }}
            />
          </div>
          <Textarea
            type="text"
            name="about"
            maxLength={400}
            onChange={handleChange}
            value={formData.about}
            required
            placeholder="Write something about yourself..."
            className="min-h-32 text-xs sm:text-sm"
          />

          <div className="space-y-4">
            {/* SELECT */}

            <Select onValueChange={addSkill}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select skills" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Skills</SelectLabel>

                  {[
                    // Frontend
                    "HTML",
                    "CSS",
                    "TypeScript",
                    "React",
                    "Next.js",
                    "Vue.js",
                    "Nuxt.js",
                    "Angular",
                    "Svelte",
                    "Redux",
                    "Tailwind CSS",
                    "Bootstrap",
                    "Material UI",
                    "Shadcn UI",
                    "jQuery",

                    // Backend
                    "Node.js",
                    "Express.js",
                    "NestJS",
                    "Django",
                    "Flask",
                    "FastAPI",
                    "Spring Boot",
                    "Laravel",
                    "Ruby on Rails",
                    "ASP.NET",
                    "GraphQL",
                    "REST API",

                    // Databases
                    "MongoDB",
                    "MySQL",
                    "PostgreSQL",
                    "SQLite",
                    "Redis",
                    "Firebase",
                    "Supabase",
                    "Oracle",
                    "MariaDB",

                    // Programming Languages
                    "C",
                    "C++",
                    "Java",
                    "Python",
                    "JavaScript",
                    "Go",
                    "Rust",
                    "PHP",
                    "Ruby",
                    "Swift",
                    "Kotlin",
                    "Dart",
                    "R",

                    // Mobile Development
                    "React Native",
                    "Flutter",
                    "Android",
                    "iOS",
                    "Expo",

                    // DevOps & Cloud
                    "Docker",
                    "Kubernetes",
                    "AWS",
                    "Azure",
                    "Google Cloud",
                    "Vercel",
                    "Netlify",
                    "CI/CD",
                    "GitHub Actions",
                    "Jenkins",
                    "Nginx",

                    // Tools
                    "Git",
                    "GitHub",
                    "GitLab",
                    "Postman",
                    "Webpack",
                    "Vite",
                    "Babel",
                    "Figma",
                    "Linux",

                    // Testing
                    "Jest",
                    "Mocha",
                    "Cypress",
                    "Playwright",
                    "Selenium",

                    // AI / Data
                    "Machine Learning",
                    "Deep Learning",
                    "TensorFlow",
                    "PyTorch",
                    "OpenAI API",
                    "LangChain",
                    "Data Science",
                    "Pandas",
                    "NumPy",

                    // Cybersecurity
                    "Cyber Security",
                    "Ethical Hacking",
                    "Penetration Testing",

                    // Blockchain
                    "Blockchain",
                    "Solidity",
                    "Web3.js",
                    "Ethereum",

                    // Other
                    "Socket.io",
                    "Prisma",
                    "Mongoose",
                    "Three.js",
                    "Electron",
                    "RabbitMQ",
                    "Kafka",
                  ].map((skill) => (
                    <SelectItem
                      key={skill}
                      value={skill}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center  justify-between w-full">
                        <span>{skill}</span>

                        {formData.skills.includes(skill) && (
                          <Check className="h-4 w-4 ml-2 text-green-500" />
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* SKILLS BADGES */}

            <div className="flex flex-wrap gap-2">
              {formData.skills &&
                formData.skills.map((skill) => (
                  <Badge
                    key={skill}
                    className="flex bg-secondary text-gray-700 dark:text-white items-center gap-1 px-3 py-3 text-xs sm:text-sm"
                  >
                    {skill}

                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10  p-0.5"
                    >
                      <X className="w-3 h-3 dark:text-white" />
                    </button>
                  </Badge>
                ))}
            </div>
          </div>
          <Input
            className="text-xs sm:text-sm"
            type="text"
            name="github"
            onChange={handleChange}
            value={formData.github}
            required
            placeholder="Github URL"
          />

          <Input
            className="text-xs sm:text-sm"
            type="text"
            onChange={handleChange}
            value={formData.linkedIn}
            required
            name="linkedIn"
            placeholder="LinkedIn URL"
          />
          <Input
            className="text-xs sm:text-sm"
            type="text"
            name="twitter"
            onChange={handleChange}
            value={formData.twitter}
            required
            placeholder="Twitter URL"
          />
          <Input
            className="text-xs sm:text-sm"
            type="text"
            name="instagram"
            onChange={handleChange}
            value={formData.instagram}
            required
            placeholder="Instagram URL"
          />

          <Button
            onClick={handleEditProfile}
            className=" text-xs sm:text-sm w-full"
          >
            Save Profile
          </Button>
        </CardContent>
      </Card>

      {/* RIGHT SIDE */}

      <Card className="rounded-2xl overflow-hidden">
        <div className="h-30 bg-gradient-to-r from-indigo-500 to-purple-500" />

        <CardContent className="relative pt-0">
          <Avatar className="w-20 h-20 sm:w-32 sm:h-32 border-4 border-background -mt-16">
            {formData.photoUrl ? (
              <AvatarImage src={formData.photoUrl} />
            ) : (
              <AvatarImage src="https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2558760599.jpg" />
            )}
          </Avatar>

          <div className="mt-4">
            <h2 className="text-lg sm:text-xl font-bold">
              {formData.firstName +
                " " +
                (!formData.lastName ? "" : formData.lastName)}
            </h2>
            <p className="text-xs sm:text-sm">{formData.headline}</p>
            {formData.location && (
              <p className="text-muted-foreground flex items-center text-xs sm:text-sm gap-2 mt-2">
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
                {formData.location}
              </p>
            )}

            {formData.age && formData.gender && (
              <p className="text-muted-foreground text-xs sm:text-sm  mt-2">
                {formData.age +
                  " | " +
                  formData.gender.charAt(0).toUpperCase() +
                  formData.gender.slice(1)}
              </p>
            )}
            <p className="text-muted-foreground mt-2 text-xs sm:text-sm ">
              {formData.about}
            </p>
            <div className="flex space-x-2 flex-wrap gap-2 items-center justify-center lg:flex mb-8 px-4 py-2 rounded-full mx-auto mt-4  w-fit border-neutral-200 dark:border-white/[0.2]">
              {formData.skills &&
                formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className=" bg-secondary text-xs sm:text-sm px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
            </div>
            <div className="flex space-x-2 items-center justify-start lg:flex mb-8 px-4 py-2 rounded-full mx-auto  w-fit border-neutral-200 dark:border-white/[0.2]">
              {formData.github && (
                <Link to={formData.github} target="_blank">
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
                      fillRule="evenodd"
                      d="M12.006 2a9.847 9.847 0 0 0-6.484 2.44 10.32 10.32 0 0 0-3.393 6.17 10.48 10.48 0 0 0 1.317 6.955 10.045 10.045 0 0 0 5.4 4.418c.504.095.683-.223.683-.494 0-.245-.01-1.052-.014-1.908-2.78.62-3.366-1.21-3.366-1.21a2.711 2.711 0 0 0-1.11-1.5c-.907-.637.07-.621.07-.621.317.044.62.163.885.346.266.183.487.426.647.71.135.253.318.476.538.655a2.079 2.079 0 0 0 2.37.196c.045-.52.27-1.006.635-1.37-2.219-.259-4.554-1.138-4.554-5.07a4.022 4.022 0 0 1 1.031-2.75 3.77 3.77 0 0 1 .096-2.713s.839-.275 2.749 1.05a9.26 9.26 0 0 1 5.004 0c1.906-1.325 2.74-1.05 2.74-1.05.37.858.406 1.828.101 2.713a4.017 4.017 0 0 1 1.029 2.75c0 3.939-2.339 4.805-4.564 5.058a2.471 2.471 0 0 1 .679 1.897c0 1.372-.012 2.477-.012 2.814 0 .272.18.592.687.492a10.05 10.05 0 0 0 5.388-4.421 10.473 10.473 0 0 0 1.313-6.948 10.32 10.32 0 0 0-3.39-6.165A9.847 9.847 0 0 0 12.007 2Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              )}
              {formData.linkedIn && (
                <Link to={formData.linkedIn} target="_blank">
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
                      fillRule="evenodd"
                      d="M12.51 8.796v1.697a3.738 3.738 0 0 1 3.288-1.684c3.455 0 4.202 2.16 4.202 4.97V19.5h-3.2v-5.072c0-1.21-.244-2.766-2.128-2.766-1.827 0-2.139 1.317-2.139 2.676V19.5h-3.19V8.796h3.168ZM7.2 6.106a1.61 1.61 0 0 1-.988 1.483 1.595 1.595 0 0 1-1.743-.348A1.607 1.607 0 0 1 5.6 4.5a1.601 1.601 0 0 1 1.6 1.606Z"
                      clipRule="evenodd"
                    />
                    <path d="M7.2 8.809H4V19.5h3.2V8.809Z" />
                  </svg>
                </Link>
              )}
              {formData.twitter && (
                <Link to={formData.twitter} target="_blank">
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

              {formData.instagram && (
                <Link to={formData.instagram} target="_blank">
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
                      fillRule="evenodd"
                      d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProfile;
