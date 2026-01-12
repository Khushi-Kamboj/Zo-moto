# 🍔 Zo-moto — Food Delivery App

> **Zo-moto** is a modern, full‑featured food delivery web application inspired by real‑world platforms like Zomato & Swiggy. Built with **React, TypeScript, and Supabase**, it delivers a smooth user experience, real‑time updates, AI assistance, and a powerful admin dashboard.

🌐 **Live Demo:** 👉 **[https://zomotokhushi.netlify.app/](https://zomotokhushi.netlify.app/)**

---

## ✨ Why Zo-moto?

* ⚡ Fast, scalable, and production‑ready architecture
* 🤖 AI‑powered chatbot for smarter user interaction
* 📊 Full admin control with analytics & order tracking
* 🎨 Clean, responsive UI with dark/light mode
* 🔐 Secure authentication & real‑time backend

---

## 🚀 Features

### 👤 User Panel

* 🔐 **Authentication** — Secure login & signup using Supabase Auth
* 🍽️ **Restaurant Discovery** — Browse restaurants by category & filters
* 📋 **Menu Exploration** — Detailed menus with images, prices & descriptions
* 🛒 **Smart Cart** — Add, remove, update items with live total calculation
* 💳 **Checkout Flow** — Address selection & order summary
* 📦 **Order Tracking** — View order history & real‑time order status
* 👤 **Profile Management** — Manage personal info & delivery addresses
* 📍 **Location Support** — Delivery location support (India‑based)

---

### 🛠️ Admin Panel

* 📊 **Dashboard Overview** — Orders, users & restaurants at a glance
* 🏪 **Restaurant Management** — Add, edit & delete restaurants
* 🍕 **Menu Control** — Create & manage menu items per restaurant
* 🚚 **Order Handling** — Update order statuses in real time
* 👥 **User Management** — Monitor & manage user accounts
* 📈 **Analytics** — Performance metrics & growth insights

---

### 🤖 AI Chatbot

* 💬 **Smart Assistance** — Order help, FAQs & support
* 🧠 **Context‑Aware Responses** — Personalized replies based on user queries
* 📦 **Order Status via Chat** — Track orders directly from chatbot
* 🍽️ **Recommendations** — Suggest restaurants based on preferences

---

### 🌟 Extra Goodies

* 📱 Fully **Responsive Design** (Mobile‑first)
* ⚡ **Real‑time Updates** (Cart & Orders)
* 🔔 **Notifications System** for order updates
* 🌙 **Dark / Light Mode Toggle**
* 💳 **Payment Integration Ready** (Placeholder)

---

## 🛠️ Tech Stack

| Layer           | Tech                          |
| --------------- | ----------------------------- |
| Frontend        | React, TypeScript, Vite       |
| Styling         | Tailwind CSS, shadcn/ui       |
| Backend         | Supabase (DB, Auth, Realtime) |
| State           | React Context API             |
| Routing         | React Router                  |
| Icons           | Lucide React                  |
| Package Manager | npm / bun                     |

---

## 📦 Prerequisites

* Node.js **v18+**
* npm or bun
* Supabase account

---

## 🚀 Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Khushi-Kamboj/Zo-moto.git
cd Zo-moto
```

### 2️⃣ Install dependencies

```bash
npm install
# or
bun install
```

### 3️⃣ Environment Variables

Create a `.env` file using `.env.example`

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4️⃣ Database Setup

* Run Supabase migrations from `supabase/migrations`
* OR manually execute SQL files in Supabase dashboard

### 5️⃣ Start Development Server

```bash
npm run dev
# or
bun run dev
```

🌐 Open **[http://localhost:8080](http://localhost:8080)** in your browser

---

## 📖 How to Use

### 🙋 For Users

1. Sign up or log in
2. Browse restaurants & menus
3. Add items to cart
4. Checkout with address
5. Track orders in real time
6. Use AI chatbot for help

### 🧑‍💼 For Admins

1. Log in with admin credentials
2. Manage restaurants & menus
3. Process orders
4. Monitor users & analytics

---

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── layout/       # Header, Footer, etc.
│   ├── home/         # Home page
│   ├── menu/         # Menu components
│   ├── cart/         # Cart logic
│   ├── checkout/     # Checkout flow
│   ├── auth/         # Authentication
│   ├── chat/         # AI Chatbot
│   └── admin/        # Admin panel
├── pages/            # Route pages
├── hooks/            # Custom hooks
├── context/          # Global state
├── lib/              # Utilities
├── types/            # TypeScript types
└── data/             # Mock data
```

---

## 🤝 Contributing

Contributions are welcome! 🚀

1. Fork the repo
2. Create a feature branch

```bash
git checkout -b feature/amazing-feature
```

3. Commit changes

```bash
git commit -m "Add amazing feature"
```

4. Push & open a PR 🎉

---

## 📜 License

Licensed under the **MIT License**

---

## 📞 Support

📧 Email: **[support@zo-moto.com](mailto:support@zo-moto.com)**
💬 Discord: Coming soon!

---

### ❤️ Built with passion by Khushi

**Happy Coding & Happy
