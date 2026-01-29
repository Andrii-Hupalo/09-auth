import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;

  const tag = resolvedParams.slug?.[0] ?? "all";
  const title =
    tag === "all"
      ? "All notes | NoteHub"
      : `Notes filtered by "${tag}" | NoteHub`;

  const description =
    tag === "all"
      ? "Browse all available notes in NoteHub."
      : `Browse notes filtered by the "${tag}" category in NoteHub.`;

  const url =
    tag === "all"
      ? "https://08-zustand-ochre-psi.vercel.app/notes/filter/all"
      : `https://08-zustand-ochre-psi.vercel.app/notes/filter/${tag}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub notes filter",
        },
      ],
    },
  };
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;

  const tag = resolvedParams.slug?.[0] ?? "all";

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", tag],
    queryFn: () => fetchNotes({ tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
