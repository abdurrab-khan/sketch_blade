import React from "react";
import { cn } from "@/lib/utils";

interface ProfileImgProps {
  profileUrl: string;
  fullName: string;
  containerClassName?: string;
}

const ProfileImg: React.FC<ProfileImgProps> = ({ profileUrl, fullName, containerClassName }) => {
  return (
    <div
      title={fullName}
      className={cn("mx-auto h-8 w-8 overflow-hidden rounded-full", containerClassName)}
    >
      <img
        src={profileUrl}
        className={"size-full object-cover"}
        alt={fullName}
        loading={"lazy"}
      />
    </div>
  );
};
export default ProfileImg;
