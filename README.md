# **Task Management App**

## 🚀 Overview

This is FlowBoard, a task management app featuring an interactive table for CRUD operations, sorting, filtering, and inline editing. The table component was designed to be **highly reusable** with a **hooks-based API**, **custom rendering**, **custom sorting, and **UI-agnostic\*\* architecture.

I took inspiration from **React Query's table implementation** while building a custom sorting mechanism and ensuring a modular design.

### **🚀 Live Demo**

🔗 [Flowboard Live Demo](https://flowboard-two.vercel.app/)

## **⚙️ Build & Setup**

### **📌 Requirements**

- **Node.js**: v18.x or later
- **npm** 

### **📥 Installation & Setup**

1. **Clone the repository**

   ```sh
   git clone https://github.com/utkarshkpal/flowboard.git
   cd flowboard
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Run the development server**

   ```sh
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🛠️ **Tech Stack & Choices**

- **Next.js 14** – App framework
- **TypeScript** – Strong typing & maintainability
- **Zustand** – Lightweight state management with persistence built in
- **Tailwind CSS** – Utility-first styling
- **Shadcn UI** – Component library for building UI and with Headless & Unstyled Components and uses Radix UI for Accessibility

## 🎯 **Design Decisions & Tradeoffs**

### **1️⃣ Custom Table Component (Reusable & UI-Agnostic)**

✔ **UI-Agnostic** - enables adaptability
✔ **Built with hooks API** for flexible, composable, and easier to maintain
✔ **Custom sorting functions** for precise control
✔ **Composable row rendering** for extensibility

---

### **2️⃣ Undo/Redo Implementation**

✔ Implemented an **Undo/Redo** system using a **two-stack approach**.  
✔ Actions like **add, update, delete** can be reversed or reapplied.

**Why only undo/redo?**

- I found this feature particularly challenging and wanted to focus on getting it right.

---

## ✅ **Bonus Milestones Implemented**

- **Undo/Redo functionality** using a two-stack approach.

---

## 🚀 **Further Improvements**

📌 **Virtualized Table for Performance** – Large datasets should use **React Window** or **TanStack Virtual** to optimize rendering.

---

## 💡 **Interesting Aspects**

- **Persisted state** (tasks & custom fields) using `zustand/persist` instead of manual `localStorage`.
- **Inline editing in the table** – Enables seamless task modifications.
- **Fully controlled sorting**

---

## 📜 **Conclusion**

This project was a **challenging but rewarding** experience and I thoroughly enjoyed building this.

🚀 Hope you like the implementation! 🎉
