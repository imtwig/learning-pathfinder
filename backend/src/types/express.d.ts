declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        clerkUserId: string;
        email: string;
        role: string;
        firstName?: string | null;
        lastName?: string | null;
      };
    }
  }
}

export {};
