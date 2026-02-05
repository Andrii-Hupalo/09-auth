"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteByID } from "@/lib/api/clientApi";
import css from "./NoteDetails.module.css";

export default function NoteDetailsClient() {
  const { id } = useParams<{ id: string }>();
  const {
    data: note,
    error,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteByID(id),
    refetchOnMount: false,
  });
  if (isLoading) {
    return <p className={css.status}>Loading...</p>;
  }
  if (error || !note)
    return <p className={css.status}>Something went wrong.</p>;

  return (
    <div className={css.container}>
      {(isError || !note) && <p>Something went wrong.</p>}
      {isSuccess && (
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>{note.createdAt}</p>
        </div>
      )}
    </div>
  );
}
