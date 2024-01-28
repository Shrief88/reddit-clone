import { Route, Routes } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RequireAuth from "./components/layout/RequireAuth";
import Subreddit from "./pages/Subreddit";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";

function App() {
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
                  <Route path="/post/create/r/:subredditName" element={<CreatePost />} />
                  <Route path="/post/create/r/" element={<CreatePost />} />
                  <Route path="/r/:subredditName/post/:id" element={<Post />} />
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
