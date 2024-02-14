import { Route, Routes } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RequireAuth from "./components/layout/RequireAuth";
import Subreddit from "./pages/Subreddit";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Profile from "./pages/Profile";
import UpdatePost from "./pages/UpdatePost";
import Notification from "./pages/Notification";

function App() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  if (urlParams.get("token")) {
    localStorage.setItem("token", urlParams.get("token") as string);
  }

  return (
    <div className="h-full">
      <div className="relative h-full antialiased font-Inter">
        <div className="relative flex flex-col min-h-screen">
          <div className="flex-grow flex-1">
            <Routes>
              <Route element={<Layout />}>
                <Route path="login" element={<Login />} />
                <Route element={<RequireAuth />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/r/:subredditName" element={<Subreddit />} />
                  <Route
                    path="/post/create/r/:subredditName"
                    element={<CreatePost />}
                  />
                  <Route path="/post/create/r/" element={<CreatePost />} />
                  <Route
                    path="/post/update/r/:postId"
                    element={<UpdatePost />}
                  />
                  <Route path="/r/:subredditName/post/:id" element={<Post />} />
                  <Route path="/u/:username" element={<Profile />} />
                  <Route
                    path="/u/:username/notification"
                    element={<Notification />}
                  />
                </Route>
              </Route>
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
