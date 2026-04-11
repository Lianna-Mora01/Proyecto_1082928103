import HolaMundo from "@/components/HolaMundo";

export const metadata = {
  title: "Mi Proyecto Fullstack",
  description: "Stack TypeScript validado y funcionando",
};

export default function HomePage() {
  const content = {
    greeting: "Hola Mundo",
    subtitle: "Pipeline CI/CD validado ✓",
    version: "1.0.1",
  };

  return <HolaMundo content={content} />;
}
