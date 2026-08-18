import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css';
import FloatingContact from "./assets/componants/pages/FloatingContact";
import AiChat from "./assets/componants/pages/AiChat";
import Home from "./assets/componants/pages/Home";
import Portfolio from "./assets/componants/portfolio";
import Project from "./assets/componants/pages/project";
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


function PublicLayout({ children }) {
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
          <Dashboard />  /* no floating button on dashboard */
        </PrivateRoute>
      ),
      children: [
        { path: "",         element: <></> },
        { path: "skills",   element: <SkillManager /> },
        { path: "projects", element: <ProjectManager /> },
        { path: "messages", element: <ContactManager /> },
        { path: "resume",   element: <ResumeManager /> },
      ],
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;