import axios, { type AxiosResponse } from "axios";
import type { Note } from "../types/note";

const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const nextServer = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

export interface CreateNoteData {
  title: string;
  content: string;
  tag:
    | "Todo"
    | "Work"
    | "Personal"
    | "Meeting"
    | "Shopping"
    | "Ideas"
    | "Travel"
    | "Finance"
    | "Health"
    | "Important";
}

export const fetchNotes = async (
  params: FetchNotesParams = {},
): Promise<FetchNotesResponse> => {
  const { page = 1, perPage = 12, search = "", tag } = params;

  // const normalizedTag = tag?.toLowerCase();

  const response = await nextServer.get("/notes", {
    params: {
      page,
      perPage,
      ...(search && { search }),
      ...(tag && { tag }),
    },
  });

  return response.data;
};

export const createNote = async (noteData: CreateNoteData): Promise<Note> => {
  const response: AxiosResponse<Note> = await nextServer.post(
    "/notes",
    noteData,
  );
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response: AxiosResponse<Note> = await nextServer.delete(`/notes/${id}`);
  return response.data;
};
export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await nextServer.get<Note>(`/notes/${id}`);
  return data;
}
