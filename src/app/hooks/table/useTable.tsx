import { useState } from "react";
import { ColumnConfig } from "./types";

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

export function flexRender<T>(cellValue: T): T {
  if (typeof cellValue === "function") {
    return (cellValue as () => T)();
  }
  return cellValue;
}

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

export function useReactTable<T>(options: { data: T[]; columns: ColumnConfig<T>[] }) {
  const { data, columns } = options;
  const [sortColumnId, setSortColumnId] = useState<keyof T | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  const paginatedRows = coreRowModel.rows.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return {
    getRowModel: () => ({ ...coreRowModel, rows: paginatedRows }),
    getColumnModel: () => columns,
    getHeaderGroups: () => headerGroups,
    toggleSortOrder,
    sortColumnId,
    sortOrder,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages: Math.ceil(coreRowModel.rows.length / pageSize),
  };
}
