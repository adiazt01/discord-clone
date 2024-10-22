"use client";

import { cn } from "@/lib/utils";
import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { ShieldAlert, ShieldCheck, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface ServerMemberProps {
  member: Member & { profile: Profile };
  server: Server;
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MEMBER]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="mr-2 size-4" />,
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 size-4" />,
};

export function ServerMember({ member, server }: ServerMemberProps) {
  const params = useParams();
  const router = useRouter();

  const icon = roleIconMap[member.role];

  const onClick = () => {
    router.push(`/server/${server?.id}/conversation/${member?.id}`);
  };

  return (
    <button
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params.memberId === member.id && "bg-zinc-700/10 dark:bg-zinc-700/50",
      )}
      onClick={onClick}
    >
      <Avatar>
        <AvatarImage src={member.profile.imageUrl} />
        <AvatarFallback>{member.profile.name[0]}</AvatarFallback>
      </Avatar>
      <p
        className={cn(
          "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.memberId === member.id && "text-zinc-600 dark:text-zinc-300",
        )}
      >
        {member.profile.name}
      </p>
      {icon}
    </button>
  );
}
