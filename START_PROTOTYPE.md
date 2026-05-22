# 🚀 Learning Pathway Prototype - Quick Start Guide

This is a **working prototype** with simplified authentication (no external services needed).

## What's Included

✅ Complete Pre-Schema workflow (staff submit → manager approve)  
✅ SQLite database (no PostgreSQL needed)  
✅ Mock authentication (no Clerk needed)  
✅ File upload for proof submissions  
✅ Role-based dashboards (Staff, Manager, Admin)

## Demo Users

- **Staff**: John Staff (staff-1) - Can submit Pre-Schema steps
- **Manager**: Sarah Manager (manager-1) - Can review and approve submissions  
- **Admin**: Admin User (admin-1) - Full access

## Setup Instructions

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Set up Database & Seed Data

```bash
# Generate Prisma client
npx prisma generate

# Create database and run migrations
npx prisma migrate dev --name init

# Seed with demo data
npm run seed
```

You should see:
```
✓ Created users: admin@example.com, manager@example.com, staff@example.com
✓ Created pathway: UX Design Pathway
✓ Created schema levels
✓ Created Pre-Schema steps
✓ Assigned staff to pathway
✓ Created user progress records
✓ Assigned manager to staff
✓ Created courses for Level 1
```

### 3. Start Backend Server

```bash
npm run dev
```

Backend runs on http://localhost:3001

### 4. Install Frontend Dependencies (in new terminal)

```bash
cd frontend
npm install
```

### 5. Start Frontend Server

```bash
npm run dev
```

Frontend runs on http://localhost:3000

## How to Use the Prototype

### Test the Full Workflow:

1. **Open http://localhost:3000**
2. **Click "Login as Staff"** → You'll see John Staff's dashboard
3. **View Pre-Schema Steps** → 3 steps in "Not Started" state
4. **Start a step** → Status changes to "In Progress"
5. **Upload a file and submit** → Add notes, attach a PDF/image, submit for review
6. **Switch to Manager view** → Go back home, click "Login as Manager"
7. **Review submission** → See pending submission from John Staff
8. **Approve or Reject** → Add feedback, click Approve
9. **Switch back to Staff** → See the approved status!

### Quick Links:

- **Staff Dashboard**: http://localhost:3000/staff?userId=staff-1
- **Manager Dashboard**: http://localhost:3000/manager?userId=manager-1
- **Switch Users**: http://localhost:3000

## API Endpoints (for testing)

All endpoints need `?userId=<id>` or `Authorization: Bearer <userId>` header.

```bash
# Get current user
curl http://localhost:3001/api/v1/users/me?userId=staff-1

# Get my pathway
curl http://localhost:3001/api/v1/pathways/my-pathway?userId=staff-1

# Get Pre-Schema steps
curl http://localhost:3001/api/v1/pre-schema/steps?userId=staff-1

# Get pending reviews (manager)
curl http://localhost:3001/api/v1/pre-schema/pending-reviews?userId=manager-1
```

## Database Viewer

View/edit database contents:

```bash
cd backend
npx prisma studio
```

Opens GUI at http://localhost:5555

## Troubleshooting

### "Module not found" errors
```bash
cd backend && npm install
cd ../frontend && npm install
```

### Database errors
```bash
cd backend
rm prisma/dev.db
npx prisma migrate dev --name init
npm run seed
```

### Port already in use
Kill the process using port 3000 or 3001:
```bash
lsof -ti:3000 | xargs kill
lsof -ti:3001 | xargs kill
```

## What Works in This Prototype

### ✅ Implemented
- User authentication (mock)
- Role-based access (Staff, Manager, Admin)
- View assigned pathway
- View Pre-Schema steps with progress
- Start Pre-Schema steps
- Upload proof files
- Submit steps for review
- Manager view pending submissions
- Manager approve/reject with comments
- View uploaded files
- Status tracking (Not Started → In Progress → Submitted → Approved/Rejected)

### 🚧 Not Implemented (Future)
- Email notifications
- Apprenticeship tracking
- Level 1-7 course recommendations
- Admin user management UI
- Historical pathway tracking
- Real authentication (Clerk)
- Cloud file storage (AWS S3)
- Production deployment

## File Structure

```
backend/
  ├── prisma/
  │   ├── schema.prisma     # Database schema
  │   ├── seed.ts           # Demo data
  │   └── dev.db            # SQLite database
  ├── src/
  │   ├── middleware/
  │   │   └── mockAuth.ts   # Mock authentication
  │   ├── routes/
  │   │   ├── pathways.ts   # Pathway endpoints
  │   │   └── preSchema.ts  # Pre-Schema workflow
  │   └── index.ts          # Express server
  └── uploads/              # Uploaded files

frontend/
  ├── app/
  │   ├── staff/page.tsx    # Staff dashboard
  │   ├── manager/page.tsx  # Manager dashboard
  │   └── dashboard/page.tsx # Role router
  └── lib/
      └── api.ts            # API client

```

## Next Steps

Want to extend the prototype? Here's what you can add:

1. **Apprenticeship tracking** - Manager assigns Level 1-7 after apprenticeship
2. **Level 1-7 courses** - Staff views recommended courses
3. **Admin UI** - Manage users, assign pathways
4. **Email notifications** - Add Resend for manager alerts
5. **Real authentication** - Replace mock auth with Clerk
6. **Deploy** - Railway (backend) + Vercel (frontend)

## Questions?

This prototype demonstrates the core Pre-Schema workflow. All data is stored locally in `backend/prisma/dev.db`.

**Enjoy testing! 🎉**
