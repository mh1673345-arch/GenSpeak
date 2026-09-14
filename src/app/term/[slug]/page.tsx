import { permanentRedirect } from "next/navigation";

interface LegacyTermPageProps {
  params: Promise<{ slug: string }>;
}

export default async function LegacyTermPage(props: LegacyTermPageProps) {
  const { slug } = await props.params;
  permanentRedirect(`/meaning/${slug}`);
}
