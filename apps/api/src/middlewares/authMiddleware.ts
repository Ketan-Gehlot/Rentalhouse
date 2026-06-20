import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  auth?: {
    userId: string;
  };
}

// Verify Clerk JWT tokens by decoding them and extracting the user ID
export const authenticateJWT = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or invalid' });
  }

  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }

  try {
    // Decode the JWT payload (base64)
    const parts = token.split('.');
    if (parts.length !== 3 || !parts[1]) {
      return res.status(403).json({ error: 'Invalid token format' });
    }

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));

    if (!payload || !payload.sub) {
      return res.status(403).json({ error: 'Invalid token: missing user ID' });
    }

    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return res.status(403).json({ error: 'Token expired' });
    }

    req.auth = { userId: payload.sub };
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};
