import React from "react";
import LucideIcon from "../ui/LucideIcon";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";

interface ChatStatsBoxProps {
  title: string;
  stats: string | number;
  iconName: keyof typeof dynamicIconImports;
  subTitle?: string;
  bgClass?: string;
  noBox?: boolean;
  iconClassNames?: string;
  cardClassNames?: string;
}

const ChatStatsBox: React.FC<ChatStatsBoxProps>
  = ({
    title,
    subTitle,
    stats,
    iconName,
    iconClassNames,
    cardClassNames,
  }) => {
    return (
      <Card className={cn("bg-whatsappGreenBg-default", cardClassNames)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {title}
          </CardTitle>
          <LucideIcon name={iconName} className={cn("text-muted-foreground, size-6", iconClassNames)} />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-ellipsis truncate">{
            stats
          }</p>
          <p className="text-xs text-muted-foreground">
            {subTitle}
          </p>
        </CardContent>
      </Card>
    );
  }

export default ChatStatsBox;