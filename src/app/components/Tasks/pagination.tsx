import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  onPageSizeChange,
  pageSize,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSize: number;
}) {
  return (
    <div className="flex justify-center gap-4 items-center mt-4">
      <Button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        Previous
      </Button>
      <span className="mx-2 text-sm font-semibold">
        Page {currentPage} of {totalPages}
      </span>
      <Button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
      </Button>
      <Select
        onValueChange={(value) => onPageSizeChange(Number(value))}
        defaultValue={String(pageSize)}
      >
        <SelectTrigger className="max-w-[120px]">
          <SelectValue placeholder="Select Page Size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10 / Page</SelectItem>
          <SelectItem value="20">20 / Page</SelectItem>
          <SelectItem value="50">50 / Page</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
