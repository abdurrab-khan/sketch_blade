import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function Container({ children }: Props) {
  return (
    <section
      className={"flex size-full flex-col justify-between"}
    >
      {children}
    </section>
  );
}
