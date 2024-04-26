import React, { ReactNode } from "react";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import style from "./Section.module.scss";

interface SectionProps {
  children: ReactNode;
  classNames?: string;
}

const Section: React.FC<SectionProps> = ({
  children,
  classNames = '',
}) => {
  return (

    <section>
        <Card
          className={cn(classNames,style.sectionDefaultShadow, "p-5 border-none dark:shadow-sm dark:shadow-neutral-600")}
        >
          {children}
      </Card>
    </section>
    
  );
}

export default Section;
