// src/stores/editorStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface EditorState {
  content: string;
  setContent: (content: string) => void;
}

export const useEditorStore = create<EditorState>()(
  // @ts-ignore
  persist(
    (set) => ({
      content: "",
      setContent: (content) => set({ content }),
    }),
    {
      name: "empty-page-editor-storage",
    }
  )
);
