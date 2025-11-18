import { useOutletContext } from "react-router";
import FilesTable from "@/components/ui/table/FilesTable.tsx";

const All = () => {
  const [query, setQuery] =
    useOutletContext<[string, React.Dispatch<React.SetStateAction<string>>]>();

  return <FilesTable type={"all"} />;
};
export default All;
