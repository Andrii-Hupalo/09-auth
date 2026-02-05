import type { NewNote, Note, NotesResponse, NoteTag } from "@/types/note";
import { nextServer } from "./api";
import type { LoginRequest, User, StatusMessage } from "@/types/user";

export type UpdateUserRequest = {
  userName?: string;
  photoUrl?: string;
};

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await nextServer.post("/upload", formData);
  return data.url;
};

export const fetchNotes = async (
  page: number,
  perPage: number,
  search?: string,
  tag?: NoteTag,
): Promise<NotesResponse> => {
  const params: Record<string, string | number> = { page, perPage };
  if (search) params.search = search;
  if (tag) params.tag = tag;

  const endPoint = "/notes";

  const response = await nextServer.get<NotesResponse>(endPoint, { params });

  return response.data;
};

export const fetchNoteByID = async (id: string): Promise<Note> => {
  const endPoint = `/notes/${id}`;

  const response = await nextServer.get<Note>(endPoint);

  return response.data;
};

export const createNote = async (note: NewNote): Promise<Note> => {
  const endPoint = `/notes`;

  const response = await nextServer.post<Note>(endPoint, note);

  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const endPoint = `/notes/${id}`;

  const response = await nextServer.delete<Note>(endPoint);

  return response.data;
};

export const registerUser = async (userData: LoginRequest): Promise<User> => {
  return (await nextServer.post<User>("/auth/register", userData)).data;
};

export const loginUser = async (userData: LoginRequest): Promise<User> => {
  return (await nextServer.post<User>("/auth/login", userData)).data;
};

export const logoutUser = async (): Promise<StatusMessage> => {
  return (await nextServer.post<StatusMessage>("/auth/logout")).data;
};

export const checkSession = async (): Promise<User | StatusMessage> => {
  return (await nextServer.get<User | StatusMessage>("/auth/session")).data;
};

export const getMe = async (): Promise<User> => {
  return (await nextServer.get<User>("/users/me")).data;
};

export const updateMe = async (payload: UpdateUserRequest) => {
  const res = await nextServer.put<User>("/auth/me", payload);
  return res.data;
};
