import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";
import { X } from "lucide-react";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value?: string;
  endpoint: "messageFile" | "serverImage";
}

export function FileUpload({ endpoint, onChange, value }: FileUploadProps) {
  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20 overflow-hidden ">
        <Image
          src={value}
          fill
          className="rounded-full"
          objectFit="cover"
          alt="Uploaded Image"
        />
        <button
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res[0].url);
        console.log(res[0].url);
      }}
      onUploadError={(error: Error) => {
        // Do something with the error.
        alert(`ERROR! ${error.message}`);
      }}
    />
  );
}
