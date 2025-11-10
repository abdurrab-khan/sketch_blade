import Container from "./Container.tsx";
import FilesTable from "../../components/Table/FilesTable.tsx";

const All = () => {
  return (
    <Container>
      <div className={"size-full"}>
        <FilesTable type={"all"} />
      </div>
    </Container>
  );
};
export default All;
