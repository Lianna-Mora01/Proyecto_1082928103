export const metadata = {
  title: "Hola Mundo",
  description: "Mi primer proyecto en Vercel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
