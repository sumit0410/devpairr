import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
// import { Github, Twitter, Linkedin, Heart } from "lucide-react";
const Footer = () => {
  const user = useSelector((store) => store.user);
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* LEFT */}

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold">
            DP
          </div>

          <div>
            <h2 className="font-semibold text-sm">DevPairr.</h2>

            <p className="text-xs text-muted-foreground">Connect Developes</p>
          </div>
        </div>

        {/* CENTER */}

        {user && (
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link
              to="/connections"
              className="hover:text-foreground transition"
            >
              Connections
            </Link>

            <Link to="/requests" className="hover:text-foreground transition">
              Requests
            </Link>

            <Link to="/profile" className="hover:text-foreground transition">
              Profile
            </Link>
          </div>
        )}
      </div>

      {/* BOTTOM */}

      <div className="border-t">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© 2026 Devpairr. All rights reserved.</p>

          <p className="flex items-center gap-1">
            Built with{" "}
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
              className="lucide lucide-heart-icon lucide-heart"
            >
              <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
            </svg>{" "}
            for developers by{" "}
            <a
              href="https://sumit-o9ny.onrender.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Sumit.
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
