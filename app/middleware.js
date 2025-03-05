import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export function middleware(req) {
  const token = req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    return req;
  } catch (err) {
    return new Response('Invalid or expired token', { status: 401 });
  }
}

export const config = {
  matcher: ['/dashboard', '/ticket-page/*'],
};
