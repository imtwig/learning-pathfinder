# Learning Pathway App

A comprehensive learning management system for tracking staff progression through Pre-Schema, Apprenticeship, and Levels 1-7.

## Tech Stack

### Backend
- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- Clerk Authentication
- AWS S3 (file storage)
- Resend (email)
- BullMQ + Redis (background jobs)

### Frontend
- Next.js 14 (App Router)
- React 18
- Tailwind CSS + Shadcn/ui
- Clerk Auth
- TanStack Query

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Redis (for background jobs)
- AWS S3 account (for file uploads)
- Clerk account (for authentication)
- Resend account (for emails)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. Initialize Prisma and run migrations:
```bash
npx prisma generate
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

Backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your Clerk keys
```

4. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## Project Structure

```
learning-pathway/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma           # Database schema
│   ├── src/
│   │   ├── middleware/
│   │   │   ├── auth.ts             # Authentication & authorization
│   │   │   ├── errorHandler.ts
│   │   │   └── validation.ts
│   │   ├── routes/
│   │   │   ├── auth.ts             # Clerk webhook
│   │   │   └── users.ts
│   │   ├── services/
│   │   │   └── prisma.ts
│   │   ├── utils/
│   │   │   ├── errors.ts
│   │   │   └── logger.ts
│   │   └── index.ts                # Express server
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with Clerk
│   │   ├── page.tsx                # Landing page
│   │   └── globals.css
│   ├── lib/
│   │   ├── api.ts                  # API client
│   │   └── utils.ts
│   └── package.json
└── README.md
```

## Database Schema

### Key Models
- **User** - Staff, Manager, Admin roles
- **Pathway** - Learning pathways (e.g., "Design Pathway")
- **SchemaLevel** - Pre-Schema, Apprenticeship, Level 1-7
- **PathwayAssignment** - Staff assigned to pathway with history
- **PreSchemaStep** - Required steps with proof upload
- **UserProgress** - Progress tracking
- **ProofUpload** - File uploads to S3
- **ManagerReview** - Approval/rejection records
- **EmailNotification** - Email audit trail

## API Endpoints

### Authentication
- `POST /api/v1/auth/webhook` - Clerk user sync

### Users
- `GET /api/v1/users/me` - Current user profile
- `PATCH /api/v1/users/me` - Update profile
- `GET /api/v1/users` - List users (admin only)

### Health
- `GET /health` - Server health
- `GET /health/db` - Database connection

## Deployment

### Backend (Railway)
1. Create Railway project
2. Add PostgreSQL database
3. Set environment variables
4. Deploy from GitHub

### Frontend (Vercel)
1. Import GitHub repository
2. Set environment variables
3. Deploy automatically on push

## Development

### Database Migrations
```bash
cd backend
npx prisma migrate dev --name description_of_change
```

### Prisma Studio (Database GUI)
```bash
cd backend
npx prisma studio
```

### Type Generation
```bash
cd backend
npx prisma generate
```

## Next Steps

- [ ] Implement Pre-Schema workflow
- [ ] Build manager review interface
- [ ] Set up file upload to S3
- [ ] Configure email notifications
- [ ] Add apprenticeship tracking
- [ ] Build Level 1-7 course recommendations
- [ ] Create admin dashboard
- [ ] Add historical tracking views

## License

Private - Internal Use Only
