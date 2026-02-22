import { ChatPanel } from "@/features/chat";

type ChatPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ChatPage({ params }: ChatPageProps) {
  const { projectId } = await params;
  return <ChatPanel projectId={projectId} />;
}
