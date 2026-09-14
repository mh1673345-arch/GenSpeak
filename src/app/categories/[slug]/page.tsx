import { permanentRedirect } from "next/navigation";

interface LegacyCategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function LegacyCategoryDetailPage(props: LegacyCategoryPageProps) {
  const { slug } = await props.params;
  permanentRedirect(`/category/${slug}`);
}
