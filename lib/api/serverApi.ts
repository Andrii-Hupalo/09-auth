import type { Note, NotesResponse, NoteTag } from "@/types/note";
import { nextServer } from "./api";
import { User } from "@/types/user";
import { cookies } from "next/headers";
import axios from "axios";
import type { AxiosResponse } from "axios";

const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  const cookieString = allCookies.map((c) => `${c.name}=${c.value}`).join("; ");

  return {
    headers: {
      Cookie: cookieString,
    },
  };
};

export const getMeServer = async (): Promise<User | null> => {
  try {
    const config = await getAuthHeaders();
    const response = await nextServer.get<User>("/users/me", config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "getMeServer Error:",
        error.response?.status || error.message,
      );
    } else {
      console.error("getMeServer Error:", (error as Error).message);
    }

    return null;
  }
};

export const fetchNotesServer = async (
  page: number,
  perPage: number,
  search?: string,
  tag?: NoteTag,
): Promise<NotesResponse | null> => {
  const params: Record<string, string | number> = { page, perPage };
  if (search) params.search = search;
  if (tag) params.tag = tag;

  try {
    const config = await getAuthHeaders();
    const response = await nextServer.get<NotesResponse>("/notes", {
      ...config,
      params,
    });
    return response.data;
  } catch {
    return null;
  }
};

export const fetchNoteByIDServer = async (id: string): Promise<Note | null> => {
  try {
    const config = await getAuthHeaders();
    const response = await nextServer.get<Note>(`/notes/${id}`, config);
    return response.data;
  } catch {
    return null;
  }
};

export const checkSessionServer = async (): Promise<AxiosResponse | null> => {
  try {
    const config = await getAuthHeaders();
    const response = await nextServer.get("/auth/session", config);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "checkSessionServer Error:",
        error.response?.status || error.message,
      );
    } else {
      console.error("checkSessionServer Error:", (error as Error).message);
    }

    return null;
  }
};
