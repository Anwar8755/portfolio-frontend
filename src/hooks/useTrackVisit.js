import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function useTrackVisit() {
  const location = useLocation();

  useEffect(() => {
    const track = async () => {
      try {
        await axios.post(`${API_BASE_URL}/analytics/track`, {
          page: location.pathname,
        });
      } catch (err) {
        console.error("Track error:", err);
      }
    };
    track();
  }, [location.pathname]);
}