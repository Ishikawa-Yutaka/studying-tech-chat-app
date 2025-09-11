'use client';

// Next.js
import { ThemeProvider as NextThemesProvider } from 'next-themes';
// shadcn/ui
import type { ThemeProviderProps } from 'next-themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
