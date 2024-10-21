import getCurrentProfile from "@/lib/current-profile";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } },
) {
  const profile = await getCurrentProfile();
  const { name, imageUrl } = await req.json();

  if (!profile) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!params.serverId) {
    return new NextResponse("Not Found", { status: 404 });
  }

  try {
    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        name,
        imageUrl,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error("[SERVERS_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
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

  try {
    await db.server.delete({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
    });

    return new NextResponse("Deleted", { status: 200 });
  } catch (error) {
    console.error("[SERVERS_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
