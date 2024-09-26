import { create } from "zustand";

export type ModalType = "createServer";

export interface ModalStore {
  modalType: ModalType | null;
  isOpen: boolean;
  onOpen: (modalType: ModalType) => void;
  onClose: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  modalType: null,
  isOpen: false,
  onOpen: (modalType) => set({ modalType, isOpen: true }),
  onClose: () => set({ modalType: null, isOpen: false }),
}));
