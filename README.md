# MijuDramaInfo

A comprehensive web platform for discovering, tracking, and reviewing Asian dramas, movies, and related content. Built with modern web technologies to provide users with a rich entertainment database experience.

## Features

### Content Management
- Browse and search extensive database of TV shows, movies, and people
- Detailed information pages with cast, crew, and production details
- User-contributed content and edits with change tracking
- Image galleries and multimedia content
- Related titles and recommendations

### User Features
- User authentication with NextAuth (Google, GitHub, Email/Password)
- Personal watchlists and drama lists
- Custom list creation with privacy controls
- Rating and review system for movies and TV shows
- User profiles with customizable avatars and cover photos
- Social features: followers, following, and friend requests
- Activity feeds and user interactions
- Points and coin system for engagement rewards

### Community Features
- Comment system with nested replies
- Spoiler protection for reviews and comments
- Like/love reactions on content
- Report functionality for inappropriate content
- User-generated content feeds
- Social sharing capabilities

### Advanced Features
- Real-time popularity tracking for people/actors
- Multi-language support for reviews
- Comprehensive filtering and sorting options
- Responsive design for all devices
- SEO optimized with sitemap generation
- Payment integration with Stripe and PayPal
- Subscription management

## Tech Stack

### Frontend
- **Framework**: Next.js 15.1.5 (React 19)
- **Styling**: Tailwind CSS with custom animations
- **UI Components**:
  - Radix UI (Dialogs, Dropdowns, Tabs, etc.)
  - Material-UI (Icons and components)
  - Ant Design components
- **State Management**: TanStack React Query
- **Forms**: React Hook Form with Zod validation
- **Rich Text Editor**: Tiptap
- **Animations**: Framer Motion
- **Icons**: Lucide React, React Icons

### Backend
- **Database**: MongoDB with Prisma ORM
- **Authentication**: NextAuth.js with multiple providers
- **File Storage**: Cloudinary for images
- **Email**: Nodemailer for email notifications
- **Payment**: Stripe and PayPal integration
- **API**: RESTful API with Next.js API routes

### Development Tools
- **Language**: TypeScript
- **Linting**: ESLint with Next.js config
- **Package Manager**: npm
- **Code Quality**: Knip for unused code detection
- **Analytics**: Vercel Analytics, PostHog

## Prerequisites

- Node.js 18.x or higher
- npm or yarn
- MongoDB database
- Cloudinary account (for image uploads)
- NextAuth providers credentials (Google, GitHub, etc.)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/bunseueng/mijudramainfo.git
cd mijudramainfo
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```env
DATABASE_URL="your-mongodb-connection-string"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-id"
GITHUB_SECRET="your-github-secret"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email
EMAIL_SERVER_USER="your-email"
EMAIL_SERVER_PASSWORD="your-email-password"
EMAIL_FROM="noreply@yourdomain.com"

# Payment (Optional)
STRIPE_SECRET_KEY="your-stripe-secret-key"
PAYPAL_CLIENT_ID="your-paypal-client-id"
```

4. Set up the database:
```bash
npm run db:push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run sitemap` - Generate sitemap
- `npm run knip` - Check for unused dependencies
- `npm run db:push` - Push Prisma schema to database

## Project Structure

```
mijudramainfo/
├── src/
│   ├── app/
│   │   ├── (route)/      # App routes
│   │   ├── actions/      # Server actions
│   │   ├── api/          # API routes
│   │   └── component/    # Page components
│   ├── components/       # Reusable components
│   ├── helper/          # Helper functions
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Libraries and utilities
│   └── provider/        # Context providers
├── prisma/
│   └── schema.prisma    # Database schema
├── public/              # Static assets
└── middleware.ts        # Next.js middleware
```

## Database Schema

The application uses MongoDB with Prisma and includes models for:
- Users and authentication (Account, Session, User)
- Content (Drama, Movie, Person)
- User interactions (Watchlist, DramaList, Rating, Comment)
- Social features (Friend, Feeds)
- Reviews (TvReview, MovieReview)
- Payments (Customers, CheckoutSession)

## Key Features Implementation

### Authentication
- Multi-provider authentication (Google, GitHub, Email)
- Session management with NextAuth
- Role-based access control (Admin/User)
- Password reset functionality

### Content Management
- CRUD operations for dramas, movies, and people
- Image upload and optimization via Cloudinary
- Change tracking system for user edits
- Report system for content moderation

### User Engagement
- Coin and points reward system
- Popularity tracking for actors/people
- Social networking features
- Custom lists with privacy settings

## Deployment

The application is configured for deployment on:
- Netlify (netlify.toml included)
- Vercel (with analytics integration)

### Build for Production
```bash
npm run build
npm start
```

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

ISC

## Author

Created by bunseueng

## Links

- Repository: [https://github.com/bunseueng/mijudramainfo](https://github.com/bunseueng/mijudramainfo)
- Issues: [https://github.com/bunseueng/mijudramainfo/issues](https://github.com/bunseueng/mijudramainfo/issues)

## Acknowledgments

- TMDB API for movie and TV show data
- All contributors and users of the platform
- Open source community for the amazing tools and libraries
