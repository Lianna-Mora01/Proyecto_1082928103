import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import Toast from "@/components/ui/Toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "CampusZen",
  description: "Tu espacio universitario, en calma. Gestión académica y financiera para estudiantes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const stored = localStorage.getItem('campuszen-theme') || 'light';
                  document.documentElement.setAttribute('data-theme', stored);
                } catch {}
              })()
            `,
          }}
        />
      </head>
      <body className={inter.variable}>
        <ThemeProvider>
          <ToastProvider>
            {children}
            <Toast />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
