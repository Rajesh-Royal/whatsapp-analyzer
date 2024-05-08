"use client";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { useModal } from "@/providers/modal-provider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface ModalProps {
  type: "dialog" | "sheet";
  className?: string;
  title: string;
  description: string;
  children?: React.ReactNode;
  hideCloseButton?: boolean;
  isDefaultOpen?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  type,
  className,
  title,
  description,
  children,
  hideCloseButton,
  isDefaultOpen,
}) => {
  const { isOpen, toggleModal } = useModal();

  return (
    <>
      {type === "dialog" ? (
        <Dialog open={isOpen || isDefaultOpen} onOpenChange={toggleModal} >
          <DialogContent className={cn(className)} hideCloseButton={hideCloseButton}>
            <DialogHeader >
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            {children}
          </DialogContent>
        </Dialog>
      ) : type === "sheet" ? (
        <Sheet open={isOpen} onOpenChange={toggleModal}>
          <SheetContent className={cn(className)}>
            <SheetHeader>
              <SheetTitle>{title}</SheetTitle>
              <SheetDescription>{description}</SheetDescription>
            </SheetHeader>
            {children}
          </SheetContent>
        </Sheet>
      ) : null}
    </>
  );
};
