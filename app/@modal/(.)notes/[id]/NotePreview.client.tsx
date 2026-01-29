"use client";

import Modal from "@/components/Modal/Modal";
import { fetchNoteById } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import css from "./NotePreview.module.css";

interface NotePreviewClientProps {
  id: string;
}

const NotePreviewClient = ({ id }: NotePreviewClientProps) => {
  const router = useRouter();
  const onClose = () => router.back();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading, please wait...</p>;

  if (!note) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return <p>Could not fetch note. {errorMessage}</p>;
  }

  return (
    <Modal onClose={onClose}>
      <button
        className={css.backBtn}
        onClick={onClose}
        aria-label="Close modal"
      >
        ← Back
      </button>
      <h2>{note.title}</h2>
      <b>{note.tag}</b>
      <p>{note.content}</p>
      <p>{note.createdAt}</p>
    </Modal>
  );
};

export default NotePreviewClient;
