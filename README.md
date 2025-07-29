# UpliftED - Connect, Learn and Succeed

<div align="center">
  <img src="public/graduation-cap-16.ico" alt="UpliftED Logo" width="64" height="64">
  <h1>UpliftED</h1>
  <p><strong>A modern educational platform connecting students and teachers for effective collaborative learning</strong></p>
  
  [![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.4.1-purple.svg)](https://vitejs.dev/)
  [![Supabase](https://img.shields.io/badge/Supabase-2.50.3-green.svg)](https://supabase.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.11-38B2AC.svg)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
</div>

## 📚 Project Overview

UpliftED is a comprehensive educational platform designed to foster collaborative learning between students and teachers. The platform provides a modern, intuitive interface for knowledge sharing, question-answering, and study group management, creating an engaging learning environment for educational communities.

### 🎯 Key Features

- **🔐 Secure Authentication** - Built-in user authentication with Supabase Auth
- **❓ Q&A Platform** - Ask questions, provide answers, and vote on responses
- **👥 Study Groups** - Create and manage collaborative study groups with real-time chat
- **👤 User Profiles** - Comprehensive user profiles with educational information
- **🔍 Advanced Search** - Search questions and filter by subjects
- **📱 Responsive Design** - Mobile-first design that works on all devices
- **🎨 Modern UI** - Beautiful, accessible interface built with shadcn/ui components
- **⚡ Real-time Updates** - Live chat and notifications using Supabase Realtime

## 🏗️ Technical Architecture

### Frontend Stack

- **React 18.3.1** - Modern React with hooks and functional components
- **TypeScript 5.5.3** - Type-safe development with full type coverage
- **Vite 5.4.1** - Fast build tool and development server
- **React Router DOM 6.26.2** - Client-side routing
- **TanStack Query 5.56.2** - Server state management and caching
- **React Hook Form 7.53.0** - Form handling with validation
- **Zod 3.23.8** - Schema validation

### UI/UX Framework

- **Tailwind CSS 3.4.11** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible React components
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Beautiful, customizable icons
- **Sonner** - Toast notifications
- **Next Themes** - Dark/light mode support

### Backend & Database

- **Supabase** - Backend-as-a-Service platform
  - **PostgreSQL Database** - Relational database with Row Level Security (RLS)
  - **Supabase Auth** - Authentication and authorization
  - **Supabase Realtime** - Real-time subscriptions for live updates
  - **Row Level Security (RLS)** - Fine-grained access control

### Database Schema

#### Core Tables
- **`profiles`** - User profile information
- **`questions`** - Q&A platform questions
- **`answers`** - Responses to questions
- **`answer_votes`** - Voting system for answers
- **`study_groups`** - Study group information
- **`group_memberships`** - Group membership management
- **`group_messages`** - Real-time group chat
- **`join_requests`** - Study group join request system
- **`user_roles`** - Role-based access control

#### Security Features
- **Row Level Security (RLS)** - Database-level access control
- **Role-based permissions** - Admin and user roles
- **Secure authentication** - JWT-based auth with refresh tokens
- **Data validation** - Input validation and sanitization

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **bun**
- **Supabase account** (for backend services)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nzizapacifique250/uplifted-learn-together-now.git
   cd uplifted-learn-together-now
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   
   Apply the database migrations to your Supabase project:
   ```bash
   npx supabase db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

   The application will be available at `http://localhost:8080`

### Database Migrations

The project includes comprehensive database migrations that set up:

- **Tables** - All necessary database tables
- **Relationships** - Foreign key constraints and relationships
- **RLS Policies** - Row Level Security policies for data protection
- **Functions** - Database functions for member counting and role checking
- **Triggers** - Automatic timestamp updates
- **Realtime** - Real-time subscriptions for live features

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build for development
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 📁 Project Structure

```
uplifted-learn-together-now/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # shadcn/ui components
│   │   └── questions/     # Question-related components
│   ├── hooks/             # Custom React hooks
│   ├── integrations/      # External service integrations
│   │   └── supabase/      # Supabase client and types
│   ├── lib/               # Utility functions
│   ├── pages/             # Page components
│   └── assets/            # Images and other assets
├── supabase/              # Database migrations and config
│   └── migrations/        # SQL migration files
├── tailwind.config.ts     # Tailwind CSS configuration
├── vite.config.ts         # Vite build configuration
└── package.json           # Dependencies and scripts
```

## 🔧 Key Features Implementation

### Authentication System
- **Supabase Auth** integration with email/password
- **Protected routes** with automatic redirects
- **User session management** with persistent login
- **Role-based access control** for admin features

### Q&A Platform
- **Question creation** with rich text support
- **Answer system** with voting mechanism
- **Search and filtering** by subjects and tags
- **Real-time updates** for new questions and answers

### Study Groups
- **Group creation** with member limits
- **Join request system** with admin approval
- **Real-time chat** using Supabase Realtime
- **Member management** with role-based permissions
- **Public/private group** visibility options

### Security Features
- **Row Level Security (RLS)** policies for data protection
- **Input validation** with Zod schemas
- **XSS protection** with proper data sanitization
- **CSRF protection** through Supabase Auth

## 🎨 UI/UX Design

### Design System
- **Consistent color palette** with CSS custom properties
- **Typography scale** with proper hierarchy
- **Component library** built with shadcn/ui
- **Responsive design** for all screen sizes
- **Dark/light mode** support

### Accessibility
- **WCAG 2.1 AA** compliance
- **Keyboard navigation** support
- **Screen reader** compatibility
- **Focus management** for better UX
- **ARIA labels** and semantic HTML

## 🔒 Security Considerations

### Database Security
- **Row Level Security (RLS)** policies on all tables
- **Parameterized queries** to prevent SQL injection
- **Input validation** at both client and server levels
- **Role-based access control** for sensitive operations

### Application Security
- **JWT token management** with automatic refresh
- **Secure session handling** with localStorage
- **XSS protection** through proper data handling
- **CSRF protection** via Supabase Auth

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
- **Vercel** - Recommended for React applications
- **Netlify** - Easy deployment with Git integration
- **Supabase Edge Functions** - Serverless backend functions
- **Docker** - Containerized deployment

### Environment Variables
Ensure these are set in your production environment:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** for the excellent backend-as-a-service platform
- **shadcn/ui** for the beautiful component library
- **Vite** for the fast build tool
- **Tailwind CSS** for the utility-first CSS framework
- **React Team** for the amazing frontend framework

## 📞 Support

If you have any questions or need help, please:

- Open an issue on GitHub
- Check the [documentation](docs/)
- Contact the development team

---

<div align="center">
  <p>Built with ❤️ by the UpliftED Team</p>
  <p>Connect, Learn and Succeed</p>
</div>
