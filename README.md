Portfolio Frontend

Frontend for my personal portfolio site, live at anwarali.netlify.app. Built with React and Vite, connected to a Node/Express/MongoDB backend that I also built and deployed separately.

The site isn't just a static page — there's a private admin panel built into it where I can log in and manage the content shown on the public site (skills, projects, resume, and incoming contact messages) without touching code.

What's in it


Public pages: Home, Skills, Projects, Resume, Contact
A protected admin dashboard (login required) with separate managers for skills, projects, resume data, and contact messages
A floating contact widget on the public pages for quick WhatsApp/call access
Route protection for the admin area, so dashboard routes aren't accessible without logging in


Tech stack

React, Vite, React Router, plain CSS (custom design system, no UI framework)

Project structure

src/
  assets/componants/
    portfolio.jsx           Main layout / routing shell
    pages/                  Public pages (home, skills, project, resume, contact)
    pages/dashboard/        Admin panel (login, dashboard, and manager components)
    PrivateRoute.jsx        Route guard for admin pages
  services/api.js           API calls to the backend

Running it locally

git clone https://github.com/Anwar8755/portfolio-frontend.git
cd portfolio-frontend
npm install
npm run dev

The app expects the backend API to be running and reachable — set the API URL in a .env file if it's not already pointing to the deployed backend.

Deployment

Deployed on Netlify. The backend is deployed separately on Render.

Backend repo: https://github.com/Anwar8755/portfolioB

Notes

This is an ongoing project — I keep adding to it as I build out new sections of the portfolio. The live site is the best way to see it in action: anwarali.netlify.app
