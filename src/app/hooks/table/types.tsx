import { ReactNode } from "react";

export type ColumnConfig<T> =
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

export type Row<T> = {
  original: T;
  index: number;
  depth: number;
  subRows: Row<T>[];
};
