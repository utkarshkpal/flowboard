import { ReactNode } from "react";

// Define a type for the column configuration
type ColumnConfig<T> =
  | {
      id: keyof T;
      accessor: (row: T) => string;
    }
  | {
      id: string;
      cell: (row: T) => ReactNode;
    };

// Function to create column helper
export function createColumnHelper<T>() {
  return {
    accessor: (key: keyof T) => ({
      id: key,
      accessor: (row: T) => String(row[key]),
    }),
    display: ({ id, cell }: { id: string; cell: (row: T) => React.ReactNode }) => ({
      id,
      cell,
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
export function getCoreRowModel<T>(data: T[]) {
  return {
    rows: data.map((row, index) => ({
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
  const coreRowModel = getCoreRowModel(data);
  const headerGroups = getHeaderGroups(columns);

  return {
    getRowModel: () => coreRowModel,
    getColumnModel: () => columns,
    getHeaderGroups: () => headerGroups,
  };
}
