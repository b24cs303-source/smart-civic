# Smart Civic — AI-powered Civic Complaint Assistant

A polished, responsive React demo that connects a **Citizen Portal** and an **Admin Portal** in one application.

## Features

### Citizen portal
- Role-specific demo login
- Citizen dashboard and personal complaint history
- Submit a complaint with title, description, location and optional image preview
- Rule-based AI-style category, department and priority suggestions
- Complaint reference ID and status tracking

### Admin portal
- Overview of all civic complaints
- Search and filter by status, priority, category, ID, title or location
- Update complaint status; changes appear in the citizen portal
- City insights with charts and category distribution

### Shared functionality
- Both portals use the same browser `localStorage` data store
- Seeded sample complaints for a ready-to-show demonstration
- Responsive desktop and mobile layouts

## Run locally

You need Node.js 18 or later.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

To create a production build:

```bash
npm run build
npm run preview
```

## Demo login

| Portal | Email | Password |
|---|---|---|
| Citizen | `citizen@smartcivic.in` | `citizen123` |
| Admin | `admin@smartcivic.in` | `admin123` |

## Suggested demo flow

1. Sign in to the Citizen Portal.
2. Submit a complaint such as “Large pothole near the main road”.
3. Note the complaint reference ID.
4. Sign out and enter the Admin Portal.
5. Open **Complaint management** and search for the new complaint.
6. Change its status to **In Progress** or **Resolved**.
7. Sign out and return to the Citizen Portal to see the updated status.

## Important project notes

This is a **frontend demonstration build**. Login credentials are demo-only, and complaint data is stored in the browser's local storage. The AI assistant currently uses transparent keyword-based rules to demonstrate classification, department routing and priority suggestions. It does not yet call a trained machine-learning model, municipal API, real map service, or secure server.

For a production deployment, add a Flask/Node backend, MongoDB, server-side authentication and role permissions, secure image storage, a trained NLP/image model, and official municipal integrations. Do not use the demo credentials or local storage for real citizen data.
