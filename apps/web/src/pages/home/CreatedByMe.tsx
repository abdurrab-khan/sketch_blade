import Container from "./Container.tsx";
import FilesTable from "@/components/ui/table/FilesTable.tsx";

const CreatedByMe = () => {
  return (
    <Container>
      <div className={"size-full"}>
        <FilesTable type={"my"} />
      </div>
    </Container>
  );
};
export default CreatedByMe;
