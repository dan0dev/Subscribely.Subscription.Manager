# Subscribely

<div align="center">
  
[![Subscribely Logo](https://i.imgur.com/hicXmxC.png)](https://subscribely-subscription-manager.vercel.app/)

</div>

<div align="center">
  
[![Next.js](https://img.shields.io/badge/Next.js-15.2.3-black?style=flat-plastic&logo=next.js)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.12-green?style=flat-plastic&logo=mongodb)](https://www.mongodb.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=flat-plastic&logo=vercel)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-plastic)](LICENSE)

</div>

## 📄 Overview
Subscribely is a creative project built to demonstrate a modern subscription management platform. This project has been in development for 2 months and serves as a showcase for implementing a comprehensive subscription system with role-based access controls.

**Note:** This is not a real-world application solving an actual business problem, but rather a creative project demonstrating various technical implementations and solutions.

<p align="center">
  <video src="https://github.com/user-attachments/assets/9728b920-35e8-46d1-9edb-a28fad3b4d1b" width="100%" />
</p>

## ✨ Showcase

| ![Image 1](https://github.com/user-attachments/assets/9e557f57-79a8-4ea7-9918-1b8cd3177d71) | ![Image 2](https://github.com/user-attachments/assets/f8aec892-249c-4561-9019-58116fd76c16) |
|--------------------------------|--------------------------------|
| ![Image 3](https://github.com/user-attachments/assets/6623ef73-e7e2-4f1f-a247-2500cf7ffbe8) | ![Image 4](https://github.com/user-attachments/assets/5bf05861-b21a-430d-bdd0-d2894664aa58) |


## 🔧 Features

### Authentication
- User registration and login system
- Role-based access control (Admin and User roles)
- Secure authentication with JWT

### User Features
- Default balance in USD for new accounts
- Subscription marketplace ("Subscription Store")
- Active subscription management (up to 3 active subscriptions)
- Subscription cancellation
- Profile settings with account deletion option

### Admin Features
- Create, edit, and delete subscription packages
- View all user subscriptions across the platform
- Ability to revoke user subscriptions with automatic email notification
- Modify user account balances

### Subscription System
- Configurable subscription packages (name, description, price, status)
- Customizable subscription durations (1 day, 14 days, 1 month, etc.)
- Automatic balance deduction on purchase
- Email notifications for subscription events:
  - Purchase confirmation
  - Subscription cancellation
  - Admin-initiated subscription revocation

## 📐 Tech Stack
- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose
- **Authentication**: Custom JWT implementation
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Shadcn UI
- **Email**: Nodemailer
- **Monitoring**: Sentry
- **Security**: Arcjet
- **Deployment**: Vercel

## 🗂️ Project Structure
The project follows a standard Next.js App Router structure with server actions and API routes.

```
/
├── .github/
├── .husky/
├── .next/
├── app/
├── components/
├── config/
├── lib/
├── node_modules/
├── public/
├── types/
├── .env.local
├── .env.sentry-build-plugin
├── .eslintrc.json
├── .gitignore
├── .prettierrc.json
├── components.json
├── eslint.config.mjs
├── instrumentation-client.ts
├── instrumentation.ts
├── middleware.ts
├── next-env.d.ts
├── next.config.js
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── sentry.edge.config.ts
├── sentry.server.config.ts
└── tsconfig.json
```

## 🌐 Development Practices
- Strongly typed with TypeScript
- Conventional commits for clear version history
- Git workflow configured with Husky and lint-staged
- Comprehensive ESLint and Prettier configuration
- Well-documented codebase with JSDoc comments

## 📥 Installation

```bash
# Clone the repository
git clone https://github.com/dan0dev/Subscribely.Subscription.Manager.git

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 🌳 Environment Variables
Create a `.env.local` file in the root directory and add the following:

```
MONGODB_URI=
JWT_SECRET=
EMAIL_USER=
EMAIL_PASS=
NEXT_PUBLIC_SENTRY_DSN=
ARCJET_API_KEY=
```

## 💻 Deployment
The application is deployed on Vercel.

## 📝 Todo
- Creating test role as account
- Implement automatic subscription expiration (currently subscriptions don't expire automatically)
- Add subscription renewal options
- Actual working account deletion
- Refund option

## 📃 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
