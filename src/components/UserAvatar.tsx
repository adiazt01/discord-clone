import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "./ui/avatar";

interface IUserAvatarProps {
  src?: string;
  className?: string;
}

export function UserAvatar({ src, className }: IUserAvatarProps) {
  return (
    <Avatar className={cn("h-7 w-7 md:h-10 md:w-10", className)}>
      <AvatarImage src={src} />
    </Avatar>
  );
}
