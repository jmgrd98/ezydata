"use client";

import { ColumnDef } from "@tanstack/react-table";

export type DataType = {
  field1: string;
  field2: number;
  field3: string;
};

export const columns: ColumnDef<DataType>[] = [
  {
    accessorKey: "field1",
    header: "Field 1",
  },
  {
    accessorKey: "field2",
    header: "Field 2",
  },
  {
    accessorKey: "field3",
    header: "Field 3",
  },
];