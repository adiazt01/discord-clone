import { Channel, ChannelType, Server } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "createServer"
  | "createChannel"
  | "invite"
  | "editServer"
  | "members"
  | "deleteServer"
  | "leaveServer"
  | "deleteChannel"
  | "editChannel";

interface ModalData {
  server?: Server;
  channelType?: ChannelType;
  channel?: Channel;
}

export interface ModalStore {
  modalType: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (modalType: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  modalType: null,
  isOpen: false,
  data: {},
  onOpen: (modalType, data = {}) => set({ modalType, isOpen: true, data }),
  onClose: () => set({ modalType: null, isOpen: false, data: {} }),
}));
