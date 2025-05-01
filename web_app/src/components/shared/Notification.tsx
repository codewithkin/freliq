import { formatDistanceToNow } from "date-fns";
import { Badge } from "../ui/badge";

function Notification({ notif }: { notif: any }) {
  return (
    <div
      className={`border p-3 rounded-md text-muted-foreground ${notif.read ? "bg-white" : "bg-slate-100"}`}
    >
      <h2 className="font-semibold text-lg capitalize">{notif.title}</h2>
      <article className="flex items-center gap-2">
        <Badge
          variant="secondary"
          className="text-xs text-muted-foreground bg-slate-300 rounded-full"
        >
          {formatDistanceToNow(new Date(notif.createdAt))} ago
        </Badge>
        <Badge
          variant={notif.read ? "outline" : "default"}
          className="mb-2 text-xs rounded-full"
        >
          {notif.read ? <p>Read</p> : <p>Unread</p>}
        </Badge>
      </article>
      <p className="text-sm">{notif.message}</p>
    </div>
  );
}

export default Notification;
