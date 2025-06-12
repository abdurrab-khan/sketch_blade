import React from "react";
import EditFile from "./canvas/others/EditFile";
import Tools from "./tools/Tools";
import ShareSection from "./canvas/others/ShareSection";

interface Props {
  fileId: string;
}

export const Nav: React.FC<Props> = ({ fileId }) => {
  return (
    <div className={"flex h-fit items-center justify-center"}>
      <div
        className={
          "relative z-50 flex w-full flex-col gap-y-3 md:flex-row md:justify-between"
        }
      >
        <EditFile fileId={fileId as string} fileName={"🤯"} />
        <Tools />
        <ShareSection />
      </div>
    </div>
  );
};
