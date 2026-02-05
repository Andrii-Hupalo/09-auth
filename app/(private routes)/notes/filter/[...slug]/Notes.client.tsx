"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { fetchNotes } from "@/lib/api/clientApi";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Link from "next/link";
import type { NotesResponse, NoteTag } from "@/types/note";

import css from "./NotesPage.module.css";
import { useState } from "react";

type NotesClientProps = {
  initialData: NotesResponse;
  tag?: string;
};

export default function NotesClient({ tag }: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [debouncedSearch] = useDebounce(searchTerm, 500);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notes", currentPage, debouncedSearch, tag],
    queryFn: () =>
      fetchNotes(
        currentPage,
        12,
        debouncedSearch || undefined,
        tag && tag !== "all" ? (tag as NoteTag) : undefined,
      ),
    placeholderData: keepPreviousData,
  });

  return (
    <div className={css.app}>
      <SearchBox value={searchTerm} onSearch={handleSearch} />

      {isLoading && <p>Loading…</p>}
      {isError && <p>Error: {error.message}</p>}

      {data?.notes?.length ? (
        <NoteList notes={data.notes} />
      ) : (
        <p>No notes found</p>
      )}

      {data && data.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={data.totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <Link href="/notes/action/create" className={css.createButton}>
        Create note +
      </Link>
    </div>
  );
}
