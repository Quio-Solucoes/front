import { ChatPanel } from "@/features/chat";

type OrcamentoPageProps = {
  params: Promise<{ orcamentoId: string }>;
};

export default async function OrcamentoPage({ params }: OrcamentoPageProps) {
  const { orcamentoId } = await params;
  return <ChatPanel projectId={orcamentoId} />;
}

