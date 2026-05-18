import { redirect } from "next/navigation";

type ChatPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ChatPage({ params }: ChatPageProps) {
  const { projectId } = await params;
  redirect(`/orcamentos/${projectId}`);
}

