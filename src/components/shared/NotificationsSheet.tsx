import { Bell } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

function NotificationsSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {/* Only show if there are unread notifications */}
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full p-4">
        <SheetHeader>
          <SheetTitle className="text-2xl font-semibold tracking-tight mb-4">
            Notifications
          </SheetTitle>
          <p className="text-muted-foreground">
            You have no new notifications.
          </p>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export default NotificationsSheet;
