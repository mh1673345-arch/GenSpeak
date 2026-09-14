import { permanentRedirect } from "next/navigation";

interface LegacyTopicPageProps {
  params: Promise<{ topic: string }>;
}

export default async function LegacyCultureTopicDetail(props: LegacyTopicPageProps) {
  const { topic } = await props.params;
  permanentRedirect(`/culture/${topic}`);
}
