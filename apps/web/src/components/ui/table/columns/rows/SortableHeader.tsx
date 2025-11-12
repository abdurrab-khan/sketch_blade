import { Button } from '@/components/ui/button'
import { Column } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react'

function SortableHeader<T>(label: string) {
    return ({ column }: { column: Column<T> }) => {
        return (
            <div className={"w-full"}>
                <Button
                    variant="none"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="mx-auto flex items-center gap-1"
                >
                    {label}
                    <ArrowUpDown className="h-4 w-4" />
                </Button>
            </div>
        )
    }
}

export default SortableHeader;
