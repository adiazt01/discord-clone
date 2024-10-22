import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { NavigationSidebar } from "./navigation/NavigationSidebar";
import { ServerSideBar } from "./server/ServerSidebar";

interface MobileToggleProps {
  serverId: string;
}

export function MobileToggle({ serverId }: MobileToggleProps) {
  return (
    <Sheet>
      <SheetTrigger>
        <Button size="icon" variant="ghost" className="md:hidden">
          <Menu className="mr-2" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex gap-0">
        <div className="w-[74px]">
          <NavigationSidebar />
        </div>
        <ServerSideBar serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
}
