import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState } from "react";
import useTrackVisit from "./hooks/useTrackVisit";
import Loader from "./assets/componants/Loader";
import './App.css';
import FloatingContact from "./assets/componants/pages/FloatingContact";
import AiChat from "./assets/componants/pages/AiChat";
import Home from "./assets/componants/pages/home";
import Portfolio from "./assets/componants/portfolio";
import Project from "./assets/componants/pages/project";
import ProjectDetail from "./assets/componants/pages/ProjectDetail";
import Contact from "./assets/componants/pages/contact";
import Skills from "./assets/componants/pages/skills";
import Resume from "./assets/componants/pages/resume";
import Dashboard from "./assets/componants/pages/dashboard/Dashboard";
import Login from "./assets/componants/pages/dashboard/Login";
import PrivateRoute from "../src/assets/componants/PrivateRoute";
import SkillManager from "./assets/componants/pages/dashboard/SkillManager";
import ProjectManager from "./assets/componants/pages/dashboard/ProjectManager";
import ContactManager from "./assets/componants/pages/dashboard/ContactManager";
import ResumeManager from "./assets/componants/pages/dashboard/ResumeManager";
import PromptManager from "./assets/componants/pages/dashboard/PromptManager";
import AvailabilityManager from "./assets/componants/pages/dashboard/AvailabilityManager";
import AboutManager from "./assets/componants/pages/dashboard/AboutManager";
import TimelineManager from "./assets/componants/pages/dashboard/TimelineManager";
import WhyWorkWithMeManager from "./assets/componants/pages/dashboard/WhyWorkWithMeManager";
import TestimonialsManager from "./assets/componants/pages/dashboard/TestimonialsManager";
import EducationManager from "./assets/componants/pages/dashboard/EducationManager";


function PublicLayout({ children }) {
  useTrackVisit();
  return (
    <>
      <Portfolio />
      <AiChat />
      <FloatingContact />
      {children}
    </>
  );
}

function App() {
  const [loaded, setLoaded] = useState(() => {
    return sessionStorage.getItem("portfolioLoaded") === "true";
  });

  const handleComplete = () => {
    sessionStorage.setItem("portfolioLoaded", "true");
    setLoaded(true);
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <PublicLayout><Home /></PublicLayout>
    },
    {
      path: "/project",
      element: <PublicLayout><Project /></PublicLayout>
    },
    {
      path: "/project/:id",
      element: <PublicLayout><ProjectDetail /></PublicLayout>
    },
    {
      path: "/skills",
      element: <PublicLayout><Skills /></PublicLayout>
    },
    {
      path: "/contact",
      element: <PublicLayout><Contact /></PublicLayout>
    },
    {
      path: "/resume",
      element: <PublicLayout><Resume /></PublicLayout>
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/admin-dashboard",
      element: (
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      ),
      children: [
        { path: "",             element: <></>               },
        { path: "skills",       element: <SkillManager />    },
        { path: "projects",     element: <ProjectManager />  },
        { path: "messages",     element: <ContactManager />  },
        { path: "resume",       element: <ResumeManager />   },
        { path: "prompt",       element: <PromptManager />   },
        { path: "availability", element: <AvailabilityManager /> },
        { path: "about",        element: <AboutManager />    },
        { path: "timeline",     element: <TimelineManager /> },
        { path: "why-work-with-me", element: <WhyWorkWithMeManager /> },
        { path: "testimonials", element: <TestimonialsManager /> },
        { path: "education", element: <EducationManager /> },
      ],
    }
  ]);

  return (
    <>
      {!loaded && <Loader onComplete={handleComplete} />}
      <RouterProvider router={router} />
    </>
  );
}

export default App;