import { permanentRedirect } from "next/navigation";

interface LegacyWordPageProps {
  params: Promise<{ slug: string }>;
}

export default async function LegacyWordPage(props: LegacyWordPageProps) {
  const { slug } = await props.params;
  permanentRedirect(`/meaning/${slug}`);
}
