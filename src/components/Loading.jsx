import React, { useEffect, useState } from "react";
import { proloaderAnim } from "../animations";
import "./Loading.css";

const Loading = () => {
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    // Run the animation
    proloaderAnim();
    
    // Hide the preloader after animation completes (adjust timing as needed)
    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 4000); // 4 seconds total 

    return () => clearTimeout(timer);
  }, []);

  // Don't render anything once animation is done
  if (!showPreloader) return null;

  return (
    <div className="Proloader">
      <div className="text-container">
        <span>Parents,</span>
        <span>Daycares,</span>
        <span>All together..</span>
      </div>
    </div>
  );
};

export default Loading;