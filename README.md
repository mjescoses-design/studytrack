# StudyTrack

StudyTrack is a web app where students record their study sessions. Each session stores a subject, topic, duration in minutes, date, and notes. A dashboard at the top shows the total number of sessions, the total study time, and the most-studied subject.

**Live URL:** https://studytrack-zodu.onrender.com

Note: the app is on a free hosting plan, so the first load after a period of inactivity can take about 50 seconds.

## Features

- Add a study session
- View all saved study sessions
- Edit a session
- Delete a session
- Dashboard with total sessions, total study time, and top subject

## Technology Stack

- Node.js and Express (backend and API routes)
- MongoDB Atlas with Mongoose (database)
- HTML, CSS, and JavaScript (frontend)
- Git and GitHub (version control)
- Render (deployment)

## API Routes

- `GET /api/sessions` - get all sessions
- `POST /api/sessions` - create a session
- `PUT /api/sessions/:id` - update a session
- `DELETE /api/sessions/:id` - delete a session

## How to Run Locally

1. Clone the repository and open the folder.
2. Install the dependencies: