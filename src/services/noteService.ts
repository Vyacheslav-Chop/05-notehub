import axios from "axios";
import type { Note } from "../types/note";

interface FetchNotesRes {
  notes: Note[];
  totalPages: number;
}

interface CreateNote {
  titleNote: string;
  contentNote: string;
  tagNote: string;
}

interface SearchParams {
  search?: string;
}

const myTocen = import.meta.env.VITE_NOTEHUB_TOKEN;
axios.defaults.baseURL = "https://notehub-public.goit.study/api/notes";
axios.defaults.headers.common["Authorization"] = `Bearer ${myTocen}`;

export async function fetchNotes(
  currentPage: number,
  searchQuery: string
): Promise<FetchNotesRes> {
  const searchParams: SearchParams = {};

  if (searchQuery) {
    searchParams.search = searchQuery;
  }

  const res = await axios.get<FetchNotesRes>("", {
    params: {
      page: currentPage,
      perPage: 12,
      ...searchParams,
    },
  });
  return res.data;
}

export async function createNote({
  titleNote,
  contentNote,
  tagNote,
}: CreateNote): Promise<Note> {
  const res = await axios.post<Note>("", {
    title: titleNote,
    content: contentNote,
    tag: tagNote,
  });
  return res.data;
}

export async function deleteNote(noteId: number): Promise<Note> {
  const res = await axios.delete<Note>(`/${noteId}`);
  return res.data;
}
