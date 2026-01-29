import { create } from "zustand";
import { persist } from "zustand/middleware";

export type NoteDraft = {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
};

export const initialDraft: NoteDraft = {
  title: "",
  content: "",
  tag: "Todo",
};

type NoteStore = {
  draft: NoteDraft;
  setDraft: (draft: Partial<NoteDraft>) => void;
  clearDraft: () => void;
};

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,

      setDraft: (draft) =>
        set((state) => ({
          draft: { ...state.draft, ...draft },
        })),

      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "note-draft-storage",
    },
  ),
);
