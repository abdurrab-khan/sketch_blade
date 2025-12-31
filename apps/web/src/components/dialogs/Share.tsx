import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";

interface IShareProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
}

function Share({ children, isOpen, setIsOpen }: IShareProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Dialog trigger is there as a child */}
      {children && children}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Share File</DialogTitle>
          <DialogDescription>
            Add collaborators to this file and control who can access it.
          </DialogDescription>
        </DialogHeader>

        <div>Hello world</div>
      </DialogContent>
    </Dialog>
  );
}

export default Share;
