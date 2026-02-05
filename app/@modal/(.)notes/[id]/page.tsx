import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

import { fetchNoteByIDServer } from "@/lib/api/serverApi";
import NotePreviewClient from "./NotePreview.client";

interface NotePreviewProps {
  params: Promise<{ id: string }>;
}

const NotePreview = async ({ params }: NotePreviewProps) => {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteByIDServer(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewClient id={id} />
    </HydrationBoundary>
  );
};

export default NotePreview;
