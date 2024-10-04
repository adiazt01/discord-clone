"use client";

import qs from "query-string";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModalStore } from "@/hooks/useModalStore";
import { ServerWithMembersWithProfiles } from "@/type";
import { ScrollArea } from "../ui/scroll-area";
import { UserAvatar } from "../UserAvatar";
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MemberRole } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";

const roleIconMap = {
  MODERATOR: <ShieldCheck className="size-4 ml-1 text-indigo-500" />,
  ADMIN: <ShieldAlert className="size-4 ml-1 text-rose-500" />,
  MEMBER: null,
  GUEST: <Shield className="size-4 ml-1 text-zinc-500" />,
};

export default function MembersModal() {
  const router = useRouter();
  const { isOpen, onOpen, onClose, modalType, data } = useModalStore();
  const [loadingId, setLoadingId] = useState("");
  const isModalOpen = isOpen && modalType === "members";
  const { server } = data as { server: ServerWithMembersWithProfiles };

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });

      const response = await axios.delete(url);

      router.refresh();
      onOpen("members", { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });

      const response = await axios.patch(url, { role });

      router.refresh();
      onOpen("members", { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.members?.length} members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] px-6">
          {server?.members?.map((member) => (
            <div
              key={member.id}
              className="flex flex-row justify-between items-center mb-6"
            >
              <div className="flex gap-4 flex-row">
                <UserAvatar src={member?.profile.imageUrl} />
                <div className="flex flex-col">
                  <div className="flex flex-row items-center">
                    <p className="font-bold">{member?.profile?.name}</p>
                    {roleIconMap[member?.role]}
                  </div>
                  <p className="text-xs text-zinc-500">
                    {member?.profile?.email}
                  </p>
                </div>
              </div>
              {server?.profileId !== member?.profileId &&
                loadingId !== member.id && (
                  <>
                    <div className="flex flex-row items-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreVertical className="cursor-pointer size-5 text-zinc-500" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="left">
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="flex items-center">
                              <ShieldQuestion className="size-4 mr-1 text-zinc-500" />
                              <span>Role</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem
                                  onClick={() =>
                                    onRoleChange(member.id, "GUEST")
                                  }
                                >
                                  <Shield className="size-4 mr-2 text-zinc-500" />
                                  Guest
                                  {member.role === "MEMBER" && (
                                    <Check className="size-4 ml-2 text-green-500" />
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    onRoleChange(member.id, "MODERATOR")
                                  }
                                >
                                  <ShieldCheck className="size-4 mr-2 text-indigo-500" />
                                  Moderator
                                  {member.role === "MODERATOR" && (
                                    <Check className="size-4 ml-2 text-green-500" />
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    onRoleChange(member.id, "ADMIN")
                                  }
                                >
                                  <ShieldAlert className="size-4 mr-2 text-rose-500" />
                                  Admin
                                  {member.role === "ADMIN" && (
                                    <Check className="size-4 ml-2 text-green-500" />
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onKick(member.id)}>
                            <Gavel className="size-4 mr-2 text-zinc-500" />
                            Kick
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {loadingId === member.id && (
                      <Loader2 className="animate-spin text-zinc-500 ml-auto" />
                    )}
                  </>
                )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
