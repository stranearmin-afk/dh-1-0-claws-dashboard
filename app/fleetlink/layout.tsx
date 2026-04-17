import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { sessionOptions, SessionData } from '@/lib/session';

export default async function FleetlinkLayout({ children }: { children: React.ReactNode }) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.user?.authenticated) {
    redirect('/auth/login?from=/fleetlink');
  }
  return <>{children}</>;
}
