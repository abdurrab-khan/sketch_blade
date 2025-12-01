import { getFormattedTime } from "@/utils/AppUtils";

function DisplayDate({ value }: { value: string | null }) {
  return (
    <div className="font-medium text-gray-900 capitalize">
      {value ? getFormattedTime(value) : "-"}
    </div>
  );
}

export default DisplayDate;
