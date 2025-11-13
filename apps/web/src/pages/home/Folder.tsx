import Container from "./Container.tsx";
import FolderTable from "@/components/ui/table/FolderTable.tsx";

const Folder = () => {
  return (
    <Container>
      <div className={"size-full"}>
        <FolderTable />
      </div>
    </Container>
  );
};
export default Folder;
