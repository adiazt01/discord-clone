import { ServerSideBar } from "@/components/server/ServerSidebar";
import getCurrentProfile from "@/lib/current-profile";
import db from "@/lib/db";
import { auth, redirectToSignIn } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ServerIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) {
  const profile = await getCurrentProfile();

  if (!profile) {
    return auth().redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) {
    return redirect("/");
  }

  return (
    <div className="flex flex-row h-full flex-1">
      <div className="hidden md:flex h-full w-60 z-20 flex-col inset-y-0">
        <ServerSideBar serverId={params.serverId} />
      </div>
      <main className=" md:pl-60">{children}</main>
    </div>
  );
}
