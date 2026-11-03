import { notFound } from "next/navigation";
import { pageComponents } from "../../components/pages";
import { ServiceDetail } from "../../components/service-detail";
import { metadataFor, services, titles } from "../../lib/site";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(titles)
    .filter(Boolean)
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return metadataFor(slug);
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (service) return <ServiceDetail service={service} />;
  const Component = pageComponents[slug];
  if (!Component) notFound();
  return <Component />;
}
