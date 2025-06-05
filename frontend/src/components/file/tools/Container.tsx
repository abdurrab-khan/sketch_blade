import React from "react";

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div
      className={
        "absolute left-0 top-5 z-30 h-fit max-h-[85vh] w-fit min-w-[12.5rem] overflow-y-auto rounded-lg bg-secondary p-4"
      }
    >
      <div className={"flex size-full flex-col gap-y-4"}>{children}</div>
    </div>
  );
};
export default Container;
