import { IoMdNotificationsOutline } from "react-icons/io";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { useState } from "react";

function Notification() {
  const [notifications, setNotifications] = useState<Array<any>>([]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger title="Actions" asChild>
        <Button variant={"outline"} size={"icon"} className="relative mr-2">
          <div className="absolute -top-0.5 right-0">
            {notifications.length > 0 && (
              <Badge
                variant={"notification"}
                className="h-5 min-w-5 justify-center rounded-full px-1 font-mono tabular-nums"
              >
                {notifications.length > 9 ? "9+" : notifications.length}
              </Badge>
            )}
          </div>
          <IoMdNotificationsOutline />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-82" align="end">
        <DropdownMenuLabel>Notification</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Notification items can be added here */}
        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-8">
            <div className="mb-3 rounded-lg bg-linear-to-br from-slate-50 to-slate-100 p-6 dark:from-slate-800 dark:to-slate-900">
              <IoMdNotificationsOutline size={48} className="text-slate-300 dark:text-slate-600" />
            </div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              No new notifications
            </p>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">You're all caught up</p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Notification;
