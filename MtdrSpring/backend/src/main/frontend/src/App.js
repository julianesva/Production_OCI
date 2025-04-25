import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import Navbar from "./components/Navbar/Navbar";
import LeftBar from "./components/LeftBar/LeftBar";

export default function App() {
    return (
      <div className="app">
        <div className='app-main'>
          <Navbar />

          {/* Main Container */}
          <div className="app-main-container">
              {/* Left Bar */}
              <LeftBar />

              {/* Display */}
              <Routes>
                <Route path="/" element={<Dashboard/>} />
              </Routes>
          </div>
        </div>
      </div>
    );
}