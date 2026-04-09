import { getContent } from "@/lib/data-reader";
import HolaMundo from "@/components/HolaMundo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const content = getContent();
  return {
    title: content.meta.title,
    description: content.meta.description,
  };
}

export default function HomePage() {
  const content = getContent();
  return <HolaMundo content={content.home} />;
}
