# Designer Levels - Data Population Summary

Successfully populated the database with complete Designer schema levels (1-6) as of May 20, 2026.

## Schema Levels Created

### Pre-Schema
- **Level**: Pre-Schema Requirements
- **Order**: 0
- **Description**: Complete these foundational steps before starting your apprenticeship
- **Steps**: 3 foundational steps including Google UX Design Certification

### Apprenticeship
- **Level**: Design Apprenticeship
- **Order**: 1
- **Description**: Supervised learning period with mentor guidance

### Level 1 - Designer (I)
- **Order**: 2
- **Focus**: Supporting-level player honing craft and understanding GovTech's organizational context
- **Scope**: Well-defined tasks with direction and oversight from senior designers
- **Impact**: Reliably contributes by completing assigned tasks on time with attention to detail

**Competencies**:
- Craft & Execution: Builds foundational skills, delivers well-scoped work
- Ownership: Works with manager guidance, takes ownership of well-defined tasks
- Strategic Alignment: Learns and aligns with team direction
- Culture & Organizational Influence: Adopts org values, engages with others

**Courses** (3):
1. User Research Fundamentals (10 hours)
2. Figma for Beginners (8 hours)
3. Accessibility Foundations (6 hours)

### Level 2 - Designer (II)
- **Order**: 3
- **Focus**: Key contributing member applying skills to create user-centered solutions
- **Scope**: Broader responsibilities, leading key projects with autonomy
- **Impact**: Consistently delivers high-quality work while seeking improvement

**Competencies**:
- Craft & Execution: Applies best practices to problem-solving
- Ownership: Owns problem outcomes, helps peers
- Strategic Alignment: Aligns own work with team strategy
- Culture & Organizational Influence: Contributes to team culture

**Courses** (3):
1. Advanced User Research Methods (12 hours)
2. Design Systems Building (15 hours)
3. Prototyping and Interaction Design (10 hours)

### Level 3 - Senior Designer
- **Order**: 4
- **Focus**: Experienced practitioner and emerging leader elevating design standards
- **Scope**: Comfortable with complexity, leads multiple projects confidently
- **Impact**: Leadership strengthens the team, shapes key projects and design culture

**Competencies**:
- Craft & Execution: Shapes problems, leads complex work
- Ownership: Leads end-to-end delivery, mentors others
- Strategic Alignment: Contributes to team strategy and planning
- Culture & Organizational Influence: Influences and reinforces team culture
- People Management: Transitional people management (1-2 direct reports)

**Courses** (3):
1. Service Design Thinking (20 hours)
2. Design Leadership Fundamentals (12 hours)
3. Strategic UX Planning (15 hours)

### Level 4 - Lead Designer
- **Order**: 5
- **Focus**: Leader of craft, solving complex problems and building partnerships
- **Scope**: Leads significant initiatives requiring cross-team coordination
- **Impact**: Shapes product direction, drives innovation across organization

**Competencies**:
- Craft & Execution: Solves higher-order problems, establishes quality standards
- Ownership: Supports division's strategic agenda, works through others
- Strategic Alignment: Executes initiatives to further department's strategy
- Culture & Organizational Influence: Builds cross-team collaboration
- People Management: Team Leadership with regular 1:1s and performance coaching

**Courses** (3):
1. Cross-Team Design Operations (18 hours)
2. Design Quality Standards (12 hours)
3. Stakeholder Management for Designers (10 hours)

### Level 5 - Principal Designer
- **Order**: 6
- **Focus**: Leader in design strategy, navigating complex large-scale problems
- **Scope**: Shapes design vision, collaborates with other department leaders
- **Impact**: Ensures long-term team success, drives strategic goals

**Competencies**:
- Craft & Execution: Leads quality at organizational scale
- Ownership: Owns department strategy and outcomes, grows leaders
- Strategic Alignment: Influences department strategy
- Culture & Organizational Influence: Shapes department culture
- People Management: Departmental Leadership, aligns goals with organizational objectives

**Courses** (3):
1. Design Strategy and Vision (20 hours)
2. Executive Leadership for Designers (15 hours)
3. Design Capability Building (18 hours)

### Level 6 - Distinguished Designer
- **Order**: 7
- **Focus**: Design leader in GovTech and Public Service
- **Scope**: Leads transformational initiatives of strategic/national significance
- **Impact**: Shapes future of design in Government, influences across programmes

**Competencies**:
- Craft & Execution: Shapes design standards in GovTech/public service
- Ownership: Sets vision for division, forwards org agenda
- Strategic Alignment: Influences org strategy, represents division strategy
- Culture & Organizational Influence: Shapes and stewards organizational culture
- People Management: Divisional Leadership, sets strategic goals

**Courses** (3):
1. Public Service Design Excellence (25 hours)
2. Cross-Government Transformation (20 hours)
3. Design Policy and Standards (15 hours)

## Database Statistics

- **Total Levels**: 8 (Pre-Schema, Apprenticeship, Levels 1-6)
- **Total Competencies**: 28 (4-5 per level from L1-L6)
- **Total Courses**: 18 (3 per level from L1-L6)
- **Total Training Hours**: 261 hours across all courses

## Next Steps

1. ✅ Database seeded with all Designer levels
2. ✅ Competencies defined for each level
3. ✅ Courses linked to appropriate levels
4. Start the backend and frontend servers to view the data
5. Test the full pathway progression in the UI

## Viewing the Data

### Option 1: Prisma Studio
```bash
cd backend
npx prisma studio
```
Visit http://localhost:5555

### Option 2: Run the Application
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```
Visit http://localhost:3000

## Demo Users

- **Staff**: `userId=staff-1` (John Staff) - Can view pathway and courses
- **Manager**: `userId=manager-1` (Sarah Manager) - Can review submissions
- **Admin**: `userId=admin-1` (Admin User) - Full access

---

*Data source: Designer Schema document dated 30 Mar 2026*
