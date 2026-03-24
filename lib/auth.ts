const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

export async function verifyPassword(password: string): Promise<boolean> {
  try {
    return password === ADMIN_PASSWORD;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

export function hashPassword(password: string): string {
  return password;
}
