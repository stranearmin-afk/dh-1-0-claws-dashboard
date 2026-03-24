import { SessionOptions } from 'iron-session';

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || 'your-secret-key-min-32-chars-long!!!',
  cookieName: 'dashboard_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60,
  },
};

export interface SessionData {
  user?: { authenticated: true };
}
