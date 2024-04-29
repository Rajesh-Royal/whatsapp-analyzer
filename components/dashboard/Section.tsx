import React, { ReactNode } from "react";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import style from "./Section.module.scss";

interface SectionProps {
  children: ReactNode;
  classNames?: string;
  title?: string;
  subTitle?: string;
}

const Section: React.FC<SectionProps> = ({
  children,
  classNames = '',
  title = '',
  subTitle = ''
}) => {
  return (

    <section className="mb-12 ">
      <Card
        className={cn(classNames, style.sectionDefaultShadow, "p-6 border-none dark:shadow-sm dark:shadow-neutral-600")}
      >
        {title && <h1 className="text-2xl">{title}</h1>}
        {subTitle && <h1 className="text-sm text-muted-foreground leading-6">{subTitle}</h1>}

        <div className={cn({'mt-6': title}, 'space-y-6')}>{children}</div>
      </Card>
    </section>

  );
}

export default Section;
