import React from "react";

import { BsThreeDots } from "react-icons/bs";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface IDropdownLayoutProps {
  children: React.ReactNode;
  trigger?: React.ReactNode;
  triggerTitle?: string;
  contentClassName?: string;
  props?: React.HTMLAttributes<HTMLDivElement>;
}

function DropdownLayout({
  children,
  trigger,
  triggerTitle,
  contentClassName = "",
  ...props
}: IDropdownLayoutProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger title={triggerTitle ?? ""} asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant="ghost" size="icon">
            <BsThreeDots />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn(contentClassName)} align="end" {...props}>
        <DropdownMenuGroup>{children}</DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DropdownLayout;
