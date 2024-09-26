import { auth } from "@clerk/nextjs/server";

import db from "./db";

export default async function getCurrentProfile() {
  const userId = auth();

  if (!userId) {
    return null;
  }

  const profile = await db.profile.findFirst({
    where: {
      userId: userId.userId!,
    },
  });

  return profile;
}
