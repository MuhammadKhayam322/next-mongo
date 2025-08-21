import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || '';

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (error) {
    return null;
  }
}

export function getUserIdFromRequest(req: NextRequest): string | null {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;
  
  const decoded = verifyToken(token);
  return decoded?.userId || null;
}