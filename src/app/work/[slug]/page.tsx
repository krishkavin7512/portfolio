import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseStudy } from "@/components/CaseStudy";
import { Footer } from "@/components/Footer";
import { getProject, projects } from "@/data/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: `${project.tagline} ${project.summary}`,
    openGraph: { title: `${project.name} — Kavin Krish`, description: project.tagline },
  };
}

export default async function WorkPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  if (!getProject(slug)) notFound();
  return (
    <>
      <main id="main">
        <CaseStudy slug={slug} />
      </main>
      <Footer />
    </>
  );
}
