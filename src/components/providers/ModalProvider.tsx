"use client";

import { useEffect, useState } from "react";
import CreateServerModal from "../modals/CreateServerModal";
import InviteModal from "../modals/InviteModal";
import EditServerModal from "../modals/EditServerModal";
import MembersModal from "../modals/MembersModal";

export function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <MembersModal />
    </>
  );
}
