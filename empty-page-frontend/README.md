# Empty Page: A Real-time Collaborative Text Editor

> A lightweight, real-time collaborative text editor built with Next.js, Tiptap, and Socket.IO. Designed for simplicity, speed, and cost-efficiency.

This project aims to create a seamless collaborative writing experience. Users can create a new note, share a unique link, and edit the document in real-time with others. To keep operational costs minimal, shared notes are designed to be ephemeral, automatically expiring after 24 hours.

***

## ✨ Features

-   **Real-time Collaboration**: Text updates are synced instantly across all connected users in the same document room.
-   **Rich Text Editor**: Powered by **Tiptap** for a smooth and extensible editing experience.
-   **Auto-saving**: Document changes are periodically saved to the database.
-   **Ephemeral Notes**: Each note automatically expires and is deleted 24 hours after creation to minimize data storage.
-   **Shareable Links**: Easily share a link to your document for others to join and edit.
-   **Light & Dark Mode**: Themed for your viewing preference.

***

## 🛠️ Tech Stack

-   **Framework**: Next.js (with App Router)
-   **Language**: TypeScript
-   **Styling**: TailwindCSS & ShadCN/UI
-   **Editor**: Tiptap
-   **State Management**: Zustand
-   **Database**: MongoDB (with Mongoose)
-   **Real-time Engine**: Node.js + Socket.IO
-   **Deployment**: Vercel (Frontend) & Render/Railway (Socket Server)

***

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v18 or later)
-   npm or yarn
-   A MongoDB Atlas account (or a local MongoDB instance)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/collab-pad.git](https://github.com/your-username/collab-pad.git)
    cd collab-pad
    ```
2.  **Install frontend dependencies:**
    ```sh
    npm install
    ```
3.  **Setup the Socket.IO server:**
    ```sh
    cd socket-server # Create a separate folder for it
    npm install
    ```
4.  **Create a `.env.local` file** in the root of the Next.js project and add the necessary environment variables. See the `.env.example` file for details.
    ```env
    MONGODB_URI=your_mongodb_connection_string
    NEXT_PUBLIC_SOCKET_SERVER_URL=http://localhost:4000
    ```
5.  **Run the development servers:**
    -   Start the Next.js frontend: `npm run dev`
    -   Start the Socket.IO backend: `npm start` (in the `socket-server` directory)

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

***

## 🗺️ Development Roadmap

Here is the step-by-step implementation plan for the project.

### 🪜 Phase 1 — Setup & Skeleton
-   [ ] Initialize Next.js project (`npx create-next-app@latest`).
-   [ ] Setup TypeScript, ESLint, Prettier, and Husky for code quality.
-   [ ] Setup TailwindCSS.
-   [ ] Initialize ShadCN/UI (`npx shadcn-ui@latest init`).
-   [ ] Create `pages/api/notes` route folder for backend APIs.
-   [ ] Setup a basic Zustand store for managing local editor content.

### 📝 Phase 2 — Editor Setup
-   [ ] Install and configure the Tiptap rich text editor.
-   [ ] Create a basic toolbar (initially hidden or minimal).
-   [ ] Bind the Tiptap editor content to the Zustand store.
-   [ ] Implement an "Auto-save" feature using a `setInterval` or `useDebounce` hook that triggers a PUT request to `/api/notes/:id`.

### 💾 Phase 3 — Backend & MongoDB
-   [ ] Install Mongoose and configure the connection to a MongoDB Atlas cluster.
-   [ ] Create a Mongoose schema for `Note` with fields: `content` (String), `createdAt` (Date), and `expiresAt` (Date).
-   [ ] Implement CRUD API routes in Next.js for notes (POST `/api/notes`, GET `/api/notes/:id`, PUT `/api/notes/:id`).
-   [ ] In the `POST` route, set `expiresAt` to 24 hours after `createdAt`.
-   [ ] **Crucially**, create a **TTL (Time-To-Live) index** on the `expiresAt` field in MongoDB. This will command the database to automatically delete documents when they expire.
-   [ ] Test API endpoints with Postman or `curl` to confirm MongoDB integration.

### ⚡ Phase 4 — Real-time Collaboration Server
-   [ ] Initialize a separate Node.js project for the Socket.IO server.
-   [ ] Setup a basic Express server and integrate Socket.IO.
-   [ ] Implement socket "rooms" logic, where each `noteId` corresponds to a room.
-   [ ] On a `join_note` event, have the server add the socket to the specified room.
-   [ ] On a `text_update` event from a client, have the server broadcast a `text_updated` event to all *other* clients in the same room.

### 🔗 Phase 5 — Frontend Integration with Sockets
-   [ ] Install the `socket.io-client` package in the Next.js app.
-   [ ] Create a socket service or hook to manage the client connection.
-   [ ] On mounting the editor page, emit `join_note` with the current `noteId`.
-   [ ] On Tiptap's `onUpdate` event, emit a `text_update` event with the new content and the `noteId`.
-   [ ] Create a listener for the `text_updated` event from the server.
-   [ ] When `text_updated` is received, update the Tiptap editor content, ensuring the user's cursor position is preserved if possible.
-   [ ] Use Zustand state or flags to prevent an infinite loop (e.g., don't emit an update that was just received from the server).

### 🎨 Phase 6 — Styling, Polish & Features
-   [ ] Implement a light/dark mode toggle using TailwindCSS and Next-Themes.
-   [ ] Add a "Share" button that copies the current URL to the clipboard.
-   [ ] Add a small UI note near the share button: "Link expires in 24 hours."
-   [ ] Use ShadCN components (Button, Card, etc.) to build a clean and responsive layout.
-   [ ] (Optional) Add a simple indicator showing other connected users.

### 🌐 Phase 7 — Deployment
-   [ ] Deploy the Next.js frontend and API routes to Vercel.
-   [ ] Deploy the standalone Socket.IO server to Render or Railway.
-   [ ] Configure environment variables in Vercel and Render (e.g., `MONGODB_URI`, `NEXT_PUBLIC_SOCKET_SERVER_URL`).
-   [ ] Perform an end-to-end test of the full flow:
    1.  Create a new note.
    2.  Share the link.
    3.  Open the link in a second browser tab/window.
    4.  Confirm that text edits sync in real-time.
    5.  Check the database to confirm the note has an `expiresAt` field set.