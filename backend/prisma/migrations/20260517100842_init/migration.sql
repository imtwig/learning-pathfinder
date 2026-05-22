-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clerkUserId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "role" TEXT NOT NULL DEFAULT 'STAFF',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ManagerAssignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "staffUserId" TEXT NOT NULL,
    "managerUserId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT true,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,
    "endedAt" DATETIME,
    CONSTRAINT "ManagerAssignment_staffUserId_fkey" FOREIGN KEY ("staffUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ManagerAssignment_managerUserId_fkey" FOREIGN KEY ("managerUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pathway" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SchemaLevel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pathwayId" TEXT NOT NULL,
    "levelType" TEXT NOT NULL,
    "levelOrder" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    CONSTRAINT "SchemaLevel_pathwayId_fkey" FOREIGN KEY ("pathwayId") REFERENCES "Pathway" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PathwayAssignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "pathwayId" TEXT NOT NULL,
    "schemaLevelId" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,
    "completedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "metadata" TEXT,
    CONSTRAINT "PathwayAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PathwayAssignment_pathwayId_fkey" FOREIGN KEY ("pathwayId") REFERENCES "Pathway" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PathwayAssignment_schemaLevelId_fkey" FOREIGN KEY ("schemaLevelId") REFERENCES "SchemaLevel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Competency" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pathwayId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Competency_pathwayId_fkey" FOREIGN KEY ("pathwayId") REFERENCES "Pathway" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "externalLink" TEXT,
    "estimatedHours" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SchemaLevelCourse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "schemaLevelId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "orderIndex" INTEGER NOT NULL,
    CONSTRAINT "SchemaLevelCourse_schemaLevelId_fkey" FOREIGN KEY ("schemaLevelId") REFERENCES "SchemaLevel" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SchemaLevelCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PreSchemaStep" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "schemaLevelId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "requiresProof" BOOLEAN NOT NULL DEFAULT true,
    "orderIndex" INTEGER NOT NULL,
    CONSTRAINT "PreSchemaStep_schemaLevelId_fkey" FOREIGN KEY ("schemaLevelId") REFERENCES "SchemaLevel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "pathwayAssignmentId" TEXT NOT NULL,
    "preSchemaStepId" TEXT,
    "courseId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "startedAt" DATETIME,
    "submittedAt" DATETIME,
    "reviewedAt" DATETIME,
    "reviewedBy" TEXT,
    "notes" TEXT,
    CONSTRAINT "UserProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserProgress_pathwayAssignmentId_fkey" FOREIGN KEY ("pathwayAssignmentId") REFERENCES "PathwayAssignment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserProgress_preSchemaStepId_fkey" FOREIGN KEY ("preSchemaStepId") REFERENCES "PreSchemaStep" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "UserProgress_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProofUpload" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userProgressId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" BIGINT NOT NULL,
    "fileType" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "storageUrl" TEXT NOT NULL,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedBy" TEXT NOT NULL,
    CONSTRAINT "ProofUpload_userProgressId_fkey" FOREIGN KEY ("userProgressId") REFERENCES "UserProgress" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ManagerReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userProgressId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "comments" TEXT,
    "reviewedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ManagerReview_userProgressId_fkey" FOREIGN KEY ("userProgressId") REFERENCES "UserProgress" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ManagerReview_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmailNotification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recipientUserId" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "templateName" TEXT NOT NULL,
    "subject" TEXT,
    "userProgressId" TEXT,
    "pathwayAssignmentId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "externalId" TEXT,
    "sentAt" DATETIME,
    "deliveredAt" DATETIME,
    "failedReason" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmailNotification_recipientUserId_fkey" FOREIGN KEY ("recipientUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "User"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_isActive_idx" ON "User"("role", "isActive");

-- CreateIndex
CREATE INDEX "ManagerAssignment_staffUserId_isPrimary_endedAt_idx" ON "ManagerAssignment"("staffUserId", "isPrimary", "endedAt");

-- CreateIndex
CREATE INDEX "ManagerAssignment_managerUserId_endedAt_idx" ON "ManagerAssignment"("managerUserId", "endedAt");

-- CreateIndex
CREATE INDEX "SchemaLevel_pathwayId_levelOrder_idx" ON "SchemaLevel"("pathwayId", "levelOrder");

-- CreateIndex
CREATE UNIQUE INDEX "SchemaLevel_pathwayId_levelType_key" ON "SchemaLevel"("pathwayId", "levelType");

-- CreateIndex
CREATE INDEX "PathwayAssignment_userId_status_idx" ON "PathwayAssignment"("userId", "status");

-- CreateIndex
CREATE INDEX "PathwayAssignment_userId_assignedAt_idx" ON "PathwayAssignment"("userId", "assignedAt");

-- CreateIndex
CREATE INDEX "SchemaLevelCourse_schemaLevelId_orderIndex_idx" ON "SchemaLevelCourse"("schemaLevelId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "SchemaLevelCourse_schemaLevelId_courseId_key" ON "SchemaLevelCourse"("schemaLevelId", "courseId");

-- CreateIndex
CREATE INDEX "PreSchemaStep_schemaLevelId_orderIndex_idx" ON "PreSchemaStep"("schemaLevelId", "orderIndex");

-- CreateIndex
CREATE INDEX "UserProgress_userId_pathwayAssignmentId_idx" ON "UserProgress"("userId", "pathwayAssignmentId");

-- CreateIndex
CREATE INDEX "UserProgress_status_submittedAt_idx" ON "UserProgress"("status", "submittedAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserProgress_userId_pathwayAssignmentId_preSchemaStepId_key" ON "UserProgress"("userId", "pathwayAssignmentId", "preSchemaStepId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProgress_userId_pathwayAssignmentId_courseId_key" ON "UserProgress"("userId", "pathwayAssignmentId", "courseId");

-- CreateIndex
CREATE INDEX "ProofUpload_userProgressId_idx" ON "ProofUpload"("userProgressId");

-- CreateIndex
CREATE INDEX "ManagerReview_userProgressId_reviewedAt_idx" ON "ManagerReview"("userProgressId", "reviewedAt");

-- CreateIndex
CREATE INDEX "ManagerReview_reviewerId_reviewedAt_idx" ON "ManagerReview"("reviewerId", "reviewedAt");

-- CreateIndex
CREATE INDEX "EmailNotification_recipientUserId_createdAt_idx" ON "EmailNotification"("recipientUserId", "createdAt");

-- CreateIndex
CREATE INDEX "EmailNotification_status_createdAt_idx" ON "EmailNotification"("status", "createdAt");
