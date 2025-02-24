import { ColumnConfig } from "@/app/hooks/table/types";
import { flexRender, useReactTable } from "@/app/hooks/table/useTable";
import { Task } from "@/app/store/useTaskStore";
import { capitalize } from "lodash";
import { ClipboardCheck, Clock } from "lucide-react";

interface TaskTableProps {
  tasks: Task[];
  columns: ColumnConfig<Task>[];
  renderCell: (columnId: string, row: { original: Task }) => React.ReactNode;
  renderSortIcon: (columnId: string) => React.ReactNode;
}

function TaskTable({ tasks, columns, renderCell, renderSortIcon }: TaskTableProps) {
  const table = useReactTable<Task>({
    data: tasks,
    columns,
  });

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const column = columns.find((col) => col.id === header.id);
              const isSortable = column && column.sortFn;
              return (
                <th
                  key={header.id}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    isSortable ? "cursor-pointer" : ""
                  }`}
                  onClick={() => isSortable && table.toggleSortOrder(header.id as keyof Task)}
                >
                  <div className="flex items-center">
                    {header.id === "title" && <ClipboardCheck className="mr-2" />}
                    {header.id === "priority" && <Clock className="mr-2" />}
                    {header.id === "actions" ? "Actions" : capitalize(flexRender(header.render()))}
                    {isSortable && renderSortIcon(header.id)}
                  </div>
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {columns.map((column) => (
              <td key={column.id} className="px-6 py-4 whitespace-nowrap">
                {renderCell(column.id, row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TaskTable;
