import { ReactNode, useState } from "react";

// Define a type for the column configuration
type ColumnConfig<T> =
  | {
      id: keyof T;
      accessor: (row: T) => string;
      sortFn?: (a: T, b: T) => number;
    }
  | {
      id: string;
      cell: (row: T) => ReactNode;
      sortFn?: (a: T, b: T) => number;
    };

// Function to create column helper
export function createColumnHelper<T>() {
  return {
    accessor: ({ key, sortFn }: { key: keyof T; sortFn?: (a: T, b: T) => number }) => ({
      id: key,
      accessor: (row: T) => String(row[key]),
      sortFn,
    }),
    display: ({
      id,
      cell,
      sortFn,
    }: {
      id: string;
      cell: (row: T) => React.ReactNode;
      sortFn?: (a: T, b: T) => number;
    }) => ({
      id,
      cell,
      sortFn,
    }),
  };
}

// Function to render cell content
export function flexRender<T>(cellValue: T): T {
  if (typeof cellValue === "function") {
    return (cellValue as () => T)();
  }
  return cellValue;
}

// Function to get core row model
export function getCoreRowModel<T>(
  data: T[],
  columns: ColumnConfig<T>[],
  sortColumnId?: keyof T,
  sortOrder?: "asc" | "desc",
) {
  const sortedData = sortColumnId
    ? [...data].sort((a, b) => {
        const column = columns.find((col) => col.id === sortColumnId);
        if (column && column.sortFn) {
          return sortOrder === "asc" ? column.sortFn(a, b) : -column.sortFn(a, b);
        }
        return 0;
      })
    : data;

  return {
    rows: sortedData.map((row, index) => ({
      id: index.toString(),
      original: row,
      getValue: (columnId: keyof T) => row[columnId],
    })),
  };
}

// Function to get header groups
export function getHeaderGroups<T>(columns: ColumnConfig<T>[]) {
  return [
    {
      id: "headerGroup",
      headers: columns.map((column) => ({
        id: column.id,
        render: () => column.id,
      })),
    },
  ];
}

// Hook to use the table
export function useReactTable<T>(options: { data: T[]; columns: ColumnConfig<T>[] }) {
  const { data, columns } = options;
  const [sortColumnId, setSortColumnId] = useState<keyof T | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>(undefined);

  const toggleSortOrder = (columnId: keyof T) => {
    if (sortColumnId === columnId) {
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      setSortColumnId(columnId);
      setSortOrder("asc");
    }
  };

  const coreRowModel = getCoreRowModel(data, columns, sortColumnId, sortOrder);
  const headerGroups = getHeaderGroups(columns);

  return {
    getRowModel: () => coreRowModel,
    getColumnModel: () => columns,
    getHeaderGroups: () => headerGroups,
    toggleSortOrder,
    sortColumnId,
    sortOrder,
  };
}
