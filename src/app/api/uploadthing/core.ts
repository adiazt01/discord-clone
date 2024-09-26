import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const handleAuth = () => {
  const { userId } = auth();
  console.log("userId", userId);
  if (!userId) throw new UploadThingError("Unauthorized");

  return userId;
};

export const ourFileRouter = {
  serverImage: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      try {
        const user = handleAuth();
        return { userId: user };
      } catch (e) {
        console.error(e);
        throw new UploadThingError("Unauthorized");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { uploadedBy: metadata.userId };
    }),
  messageFile: f(["image", "pdf"])
    .middleware(async () => {
      const user = handleAuth();
      return { userId: user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
