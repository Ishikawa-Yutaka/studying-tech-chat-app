import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/themeProvider';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'STUDYing Tech Chat App',
  description: 'STUDYing Tech Chat App',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
