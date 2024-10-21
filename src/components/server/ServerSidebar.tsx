import getCurrentProfile from "@/lib/current-profile";
import db from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { ServerHeader } from "./ServerHeader";
import { ServerSearch } from "./ServerSearch";
import { ScrollArea } from "../ui/scroll-area";
import {
  Hash,
  Headphones,
  ShieldAlert,
  ShieldCheck,
  User,
  Video,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { ServerSection } from "./ServerSection";
import { ServerChannel } from "./ServerChannel";
import { ServerMember } from "./ServerMember";

interface ServerSideBarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 size-4" />,
  [ChannelType.AUDIO]: <Headphones className="mr-2 size-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 size-4" />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MEMBER]: <User className="mr-2 size-4" />,
  [MemberRole.MODERATOR]: <ShieldCheck className="mr-2 size-4" />,
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 size-4" />,
};

export async function ServerSideBar({ serverId }: ServerSideBarProps) {
  const profile = await getCurrentProfile();

  if (!profile) {
    return redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT,
  );

  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO,
  );

  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO,
  );

  const members = server?.members.filter(
    (member) => member.profileId !== profile.id,
  );

  const role = server?.members.find(
    (member) => member.profileId === profile.id,
  )?.role;

  if (!server) {
    return redirect("/");
  }

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  icon: iconMap[channel.type],
                  name: channel.name,
                })),
              },
              {
                label: "Audio Channels",
                type: "channel",
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  icon: iconMap[channel.type],
                  name: channel.name,
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  icon: iconMap[channel.type],
                  name: channel.name,
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  id: member.profile.id,
                  icon: roleIconMap[member.role],
                  name: member.profile.name,
                })),
              },
            ]}
          />
        </div>
        <Separator />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              label="Text Channels"
            />
            {textChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                channel={channel}
                server={server}
                role={role}
              />
            ))}
          </div>
        )}
        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role}
              label="Audio Channels"
            />
            {audioChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                channel={channel}
                server={server}
                role={role}
              />
            ))}
          </div>
        )}
        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={role}
              label="Video channels"
            />
            {videoChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                channel={channel}
                server={server}
                role={role}
              />
            ))}
          </div>
        )}
        {!!members?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              role={role}
              label="Members"
              server={server}
            />
            {members.map((member) => (
              <ServerMember key={member.id} member={member} server={server} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
