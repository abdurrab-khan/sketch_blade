<div align="center">

# 🎨 SketchBlade

**Imagine. Draw. Collaborate.**

_Bring your ideas to life on an infinite canvas that connects you with your team instantly. The modern whiteboard designed for creative minds and remote teams._

[![Live Demo](https://img.shields.io/badge/Live_Demo-sketch--blade.vercel.app-2563eb?style=for-the-badge&logo=vercel)](https://sketch-blade.vercel.app/)

</div>

<br />

<div align="center">

<!-- 🎥 VIDEO PLACEHOLDER: Drop your video demonstration link or GIF here -->

> **📹 Watch SketchBlade in Action:**  
> _(Add your demo video link or GIF here)_

</div>

---

## ✨ Features

- 🎨 **Infinite Canvas & Advanced Tools**  
  Unleash your creativity with a wide array of drawing tools, customizable shapes, smart arrows, and vibrant color palettes. Powered by `tldraw` for a seamless sketching experience.
- ⚡ **Real-time Collaboration**  
  Work together without borders. See your teammates' cursors and edits in real-time, backed by a robust `Socket.io` architecture.

- 📁 **Organized Dashboard**  
  Keep your workspace clutter-free. Manage your diagrams with custom folders, advanced sorting, filtering, and a dedicated favorites system.

- 🌓 **Modern, Beautiful UI/UX**  
  A sleek, eye-catching interface built with a deep dark-mode-first approach. Fluid animations and accessible components make navigation a breeze.

- 🔒 **Secure Authentication**  
  Enterprise-grade security and user management powered by Clerk, ensuring your data and collaborations stay private.

---

## 🛠️ Tech Stack

Designed for performance and scalability, SketchBlade leverages a modern, cutting-edge ecosystem:

### **Frontend**

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![TLDraw](https://img.shields.io/badge/TLDraw-000000?style=for-the-badge&logo=canvas&logoColor=white)

### **Backend**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk_Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)

---

## 🚀 Getting Started (Local Development)

Want to run SketchBlade on your local machine? We've made it incredibly simple using Docker.

### Prerequisites

Ensure you have the following installed on your local machine:

- [Git](https://git-scm.com/)
- [Docker & Docker Compose](https://www.docker.com/products/docker-desktop)

### Step-by-Step Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/sketch-blade.git
cd sketch-blade
```

**2. Setup Environment Variables**
Copy the example environment file and fill in your specific keys (such as MongoDB credentials and Clerk API keys):

```bash
cp .env.example .env
```

_Note: Make sure to open the `.env` file and populate any required values like `MONGO_INITDB_ROOT_PASSWORD` or `CLERK_SECRET_KEY`._

**3. Fire it up with Docker**
We use Docker Compose to orchestrate the frontend, backend, MongoDB database, and Ngrok webhook seamlessly.

```bash
docker compose up --build
```

_(Tip: Add `-d` at the end of the command to run it in the background/detached mode)._

**4. Open the Application**
Once the containers are running and healthy, open your browser and navigate to:

```text
http://localhost:5173
```

---
