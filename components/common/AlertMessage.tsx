import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AlertMessage({
  alertTitle,
  alertMessage,
  variant = "default",
  classNames = "",
}: {
  alertTitle: string;
  alertMessage: string;
  variant?: "default" | "destructive";
  classNames?: string;
}) {
  return (
    <Alert variant={variant} className={classNames}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{alertTitle}</AlertTitle>
      <AlertDescription>{alertMessage}</AlertDescription>
    </Alert>
  );
}
