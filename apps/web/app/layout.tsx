import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HealthX AI | Your Health. Connected. Understood.',
  description:
    'Turn fragmented medical records into one intelligent, searchable and understandable health journey.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
        {children}
      </body>
    </html>
  );
}
