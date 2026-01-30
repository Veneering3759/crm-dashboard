# LeadManager CRM

**LeadManager CRM** is a production-ready, full-stack CRM built to demonstrate clean UI patterns, REST API design, and real-world cloud deployment workflows.

**Live Demo:** https://crm-dashboard-navy.vercel.app  
**Frontend:** Vite + React + Tailwind  
**Backend:** Node.js + Express + MongoDB (Mongoose)

---

## ✨ Why this project exists

Many small teams still manage leads in spreadsheets or inboxes, which leads to missed follow-ups, lost context, and unclear pipelines.

LeadManager CRM solves this by providing:
- A centralized lead dashboard
- Clear status workflows
- Fast search and filtering
- One-click lead → client conversion

Built to demonstrate **real-world UI patterns, API design, and deployment workflows**.

---

## 🧱 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Component-based UI
- Centralized API helper

### Backend
- Node.js + Express
- RESTful API design
- MongoDB Atlas
- Mongoose models

### Deployment
- Frontend: Vercel
- Backend: Render (cold start on first request)

---

## 🔑 Core Features

- Create leads with required validation
- Search and filter leads by name, email, or business
- Status workflow: New → Contacted → Qualified → Closed
- Convert leads into clients (read-only client list)
- Delete confirmation modal to prevent accidental actions
- Responsive tables (no horizontal scrolling)

---

## 📊 API Endpoints

POST /api/leads
GET /api/leads
PATCH /api/leads/:id/status
DELETE /api/leads/:id
POST /api/leads/:id/convert
GET /api/clients


---

## 🎯 What this demonstrates

- Production UI patterns (modals, inline editing, badges)
- Clean REST API design with predictable responses
- State-driven layouts
- Environment-based configuration
- Deployment-ready architecture

---

## 📝 Notes

- First request may be slow due to Render cold start.
- Subsequent requests are fast.

---

## 📎 License

MIT License
