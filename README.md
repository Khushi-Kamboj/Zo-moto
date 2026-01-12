
# Zo-moto - Food Delivery App

A modern, full-featured food delivery application built with React, TypeScript, and Supabase. Zo-moto allows users to browse restaurants, order food, manage carts, and interact with an AI chatbot, while providing admins with comprehensive management tools.

## 🚀 Features

### User Panel
- **User Authentication**: Secure login and registration with Supabase Auth
- **Restaurant Browsing**: Explore restaurants by categories with filtering options
- **Menu Management**: View detailed menu items with prices, descriptions, and images
- **Shopping Cart**: Add, remove, and update items in the cart with real-time totals
- **Checkout Process**: Seamless checkout with address selection and order summary
- **Order History**: Track past orders and order status
- **User Profile**: Manage personal information and addresses
- **Location Services**: Set delivery location (currently set to India)

### Admin Panel
- **Dashboard**: Overview of orders, users, and restaurants
- **Restaurant Management**: Add, edit, and delete restaurants
- **Menu Management**: Manage menu items for each restaurant
- **Order Management**: View and update order statuses
- **User Management**: Administer user accounts
- **Analytics**: Monitor app performance and metrics

### AI Chatbot
- **Intelligent Assistance**: AI-powered chatbot for order help, recommendations, and support
- **Contextual Responses**: Provides relevant information based on user queries
- **Order Tracking**: Help users track their orders via chat
- **Restaurant Recommendations**: Suggest restaurants based on preferences

### Additional Features
- **Responsive Design**: Fully responsive UI built with Tailwind CSS and shadcn/ui
- **Real-time Updates**: Live updates for cart and order status
- **Secure Payments**: Integrated payment processing (placeholder for now)
- **Push Notifications**: Notification system for order updates
- **Dark/Light Mode**: Theme switching capability

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (Database, Auth, Real-time)
- **State Management**: React Context API
- **Routing**: React Router
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: npm/bun

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or bun
- Supabase account (for backend services)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Khushi-Kamboj/Zo-moto.git
   cd Zo-moto
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Fill in your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Database Setup**
   - Run the Supabase migrations in the `supabase/migrations` folder
   - Or set up your Supabase project and run the SQL files

5. **Start the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. **Open your browser**
   - Navigate to `http://localhost:8080`

## 📖 Usage

### For Users
1. **Sign Up/Login**: Create an account or log in
2. **Browse Restaurants**: Explore available restaurants and menus
3. **Add to Cart**: Select items and add them to your cart
4. **Checkout**: Provide delivery address and complete payment
5. **Track Orders**: Monitor your order status
6. **Use Chatbot**: Get help with orders or recommendations

### For Admins
1. **Access Admin Panel**: Log in with admin credentials
2. **Manage Restaurants**: Add/edit restaurant information
3. **Update Menus**: Modify menu items and prices
4. **Handle Orders**: Process and update order statuses
5. **User Management**: View and manage user accounts

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components (shadcn/ui)
│   ├── layout/       # Layout components (Header, etc.)
│   ├── home/         # Home page components
│   ├── menu/         # Menu-related components
│   ├── cart/         # Cart components
│   ├── checkout/     # Checkout components
│   ├── auth/         # Authentication components
│   ├── chat/         # Chatbot components
│   └── admin/        # Admin panel components
├── pages/            # Page components
├── hooks/            # Custom React hooks
├── context/          # React context providers
├── lib/              # Utility functions
├── types/            # TypeScript type definitions
└── data/             # Mock data (for development)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev) for rapid development
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
- Database powered by [Supabase](https://supabase.com)

## 📞 Support

For support, email support@zo-moto.com or join our Discord community.

---

Made with ❤️ for food lovers everywhere!
