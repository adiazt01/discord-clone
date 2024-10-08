import getCurrentProfile from "@/lib/current-profile";
import db from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } },
) {
  const profile = await getCurrentProfile();

  if (!profile) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!params.serverId) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const server = await db.server.update({
    where: {
      id: params.serverId,
      profileId: profile.id,
    },
    data: {
      inviteCode: uuidv4(),
    },
  });

  return NextResponse.json(server);
  try {
  } catch (error) {
    console.error("[SERVERS_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
