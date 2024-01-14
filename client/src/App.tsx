import { Route, Routes } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Home from "./pages/Home";

function App() {
  return (
    <div className="h-full">
      <div className="relative h-full antialiased font-Inter">
        <div className="relative flex flex-col min-h-screen">
          <div className="flex-grow flex-1">
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
              </Route>
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
