import getCurrentProfile from "@/lib/current-profile";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
}

export default async function InviteCodePage({ params }: InviteCodePageProps) {
  const profile = await getCurrentProfile();

  if (!profile) {
    return auth().redirectToSignIn();
  }

  if (!params.inviteCode) {
    return redirect("/");
  }

  const existingProfile = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          id: profile.id,
        },
      },
    },
  });

  if (existingProfile) {
    return redirect(`/server/${existingProfile.id}`);
  }

  const isServerWithInviteCodeExists = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
    },
  });

  if (!isServerWithInviteCodeExists) {
    return redirect("/");
  }

  const serverWithInviteCode = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
      id: isServerWithInviteCodeExists.id,
    },
    data: {
      members: {
        create: [{ profileId: profile.id, role: "MEMBER" }],
      },
    },
  });

  return redirect(`/server/${serverWithInviteCode.id}`);

  return (
    <div>
      <h1>Invite Code Page</h1>
    </div>
  );
}
