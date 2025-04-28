import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Ban, Hourglass, Circle } from "lucide-react"; // Import icons

function getStatusStyles(status: string) {
  switch (status) {
    case "DONE":
      return {
        variant: "default" as const,
        icon: CheckCircle,
        className: "bg-green-500 text-white",
      };
    case "IN_PROGRESS":
      return {
        variant: "default" as const,
        icon: Hourglass,
        className: "bg-blue-500 text-white",
      };
    case "REJECTED":
      return {
        variant: "default" as const,
        icon: Ban,
        className: "bg-red-500 text-white",
      };
    case "AWAITING_VALIDATION":
      return {
        variant: "default" as const,
        icon: Clock,
        className: "bg-yellow-500 text-black",
      };
    case "TODO":
    default:
      return {
        variant: "outline" as const,
        icon: Circle,
        className: "text-muted-foreground",
      };
  }
}

export function TaskStatusBadge({ status }: { status: string }) {
  const { icon: Icon, className, variant } = getStatusStyles(status);

  return (
    <Badge variant={variant} className={className + " gap-1"}>
      <Icon size={14} />
      <span className="text-xs">{status.replace("_", " ")}</span>
    </Badge>
  );
}
