import { getFormattedTime } from "@/utils/AppUtils"

function DisplayDate({ value }: { value: string | null }) {
    return (
        <div className="capitalize">{value ? getFormattedTime(value) : "-"}</div>
    )
}

export default DisplayDate
