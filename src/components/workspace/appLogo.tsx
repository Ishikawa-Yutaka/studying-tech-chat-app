import Link from 'next/link';

export default function AppLogo() {
  return (
    <Link href="/workspace" className="flex items-center gap-2 font-bold hover:opacity-70 transition-opacity">
      <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground">S</div>
      <span>STUDYing Tech Chat</span>
    </Link>
  );
}
