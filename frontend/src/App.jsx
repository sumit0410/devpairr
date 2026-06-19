import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Body from "./Body";
// import Login from "./pages/Login";
import Profile from "./pages/Profile";
// import SignUp from "./pages/SignUp";
import { Provider, useSelector } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./pages/Feed";
import { Toaster } from "react-hot-toast";
import Connections from "./pages/Connections";
import Requests from "./pages/Requests";
import Chat from "./pages/Chat";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/chat/:targetUserId" element={<Chat />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,

              style: {
                // background: "#18181b",
                color: "#fff",
                border: "1px solid #3f3f46",
                borderRadius: "16px",
                padding: "8px 12px",
                fontSize: "12px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
              },

              success: {
                style: {
                  background: "(228, 233, 237);, 1",
                  color: "black",
                  border: ".5px solid rgba(70,70,70,0.3)",
                },

                iconTheme: {
                  primary: "#22c55e",
                  secondary: "#fff",
                },
              },

              error: {
                style: {
                  background: "rgba(239,68,68,0.1)",
                  color: "#f87171",
                  border: "1px solid rgba(239,68,68,0.2)",
                },

                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
