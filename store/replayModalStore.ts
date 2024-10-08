import { Comment } from "@/@types/comment";
import { ReplyToComment } from "@/@types/replayToComment";
import { create } from "zustand";
export type ReplayType = "replayToComment" | "replayToReplayComment";

type ModalCommentType = null | Comment | ReplyToComment;

type Store = {
  Modaltype: ReplayType | undefined;
  isModalOpen: boolean;
  setModal: ({
    type,
    open,
    comment,
  }: {
    open: boolean;
    type: ReplayType;
    comment: ModalCommentType;
  }) => void;
  closeModal: () => void;
  comment: ModalCommentType;
};

export const useReplayModalStore = create<Store>()((set) => ({
  comment: null,
  Modaltype: undefined,
  isModalOpen: false,
  setModal: ({ open, type, comment }) =>
    set(() => ({ Modaltype: type, isModalOpen: open, comment })),
  closeModal: () => set(() => ({ type: undefined, isModalOpen: false })),
}));
