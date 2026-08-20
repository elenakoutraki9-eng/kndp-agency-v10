import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import Landing from "@/pages/Landing";
import Admin from "@/pages/Admin";
import useIsMobile from "@/hooks/useIsMobile";

function App() {
  const isMobile = useIsMobile();
  return (
    <MotionConfig
      skipAnimations={isMobile}
      reducedMotion={isMobile ? "always" : "never"}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  );
}

export default App;
