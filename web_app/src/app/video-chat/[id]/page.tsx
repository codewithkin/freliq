import PeerJSVideoServer from "./components/PeerJSVideoServer";

export default async function VideoChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <PeerJSVideoServer chatId={id} />
    </div>
  );
}
