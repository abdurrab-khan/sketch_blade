import { getFormattedTime } from "@/utils/AppUtils";

function DisplayDate({ value }: { value: string | null }) {
  return (
    <div className="font-medium text-gray-900 capitalize dark:text-slate-300">
      {value ? getFormattedTime(value) : "-"}
    </div>
  );
}

export default DisplayDate;
