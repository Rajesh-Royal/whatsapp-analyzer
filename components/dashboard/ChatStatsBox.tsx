import React from "react";
import LucideIcon from "../ui/LucideIcon";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface ChatStatsBoxProps {
  title: string;
  stats: string | number;
  iconName: keyof typeof dynamicIconImports;
  subTitle?: string;
  bgClass?: string;
  noBox?: boolean;
}

const ChatStatsBox: React.FC<ChatStatsBoxProps>
  = ({
    title,
    subTitle,
    stats,
    iconName,
  }) => {
    return (
      <Card className="bg-whatsappGreenBg-default">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {title}
          </CardTitle>
          <LucideIcon name={iconName} className="size-6 text-muted-foreground" />
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