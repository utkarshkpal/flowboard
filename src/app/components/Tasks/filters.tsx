import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface FiltersProps {
  filters: {
    searchText: string;
    status: string;
    priority: string;
  };
  onFilterChange: (type: string, value: string) => void;
}

export default function Filters({ filters, onFilterChange }: FiltersProps) {
  return (
    <div className="flex gap-6 p-4">
      <div className="flex-[50%]">
        <label htmlFor="textFilter" className="sr-only">
          Search Text Filter:
        </label>
        <Input
          type="text"
          id="textFilter"
          placeholder="Search for a task"
          className="max-w-80"
          value={filters.searchText}
          onChange={(e) => onFilterChange("text", e.target.value)}
        />
      </div>
      <div className="flex-[25%] flex items-center justify-end">
        <label htmlFor="filterDropdown" className="mr-2">
          Status:
        </label>
        <Select value={filters.status} onValueChange={(value) => onFilterChange("status", value)}>
          <SelectTrigger className="max-w-40">
            <SelectValue placeholder="Select Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="not_started">Not Started</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-[25%] flex items-center justify-end">
        <label htmlFor="priorityStatusDropdown" className="mr-2">
          Priority:
        </label>
        <Select
          value={filters.priority}
          onValueChange={(value) => onFilterChange("priority", value)}
        >
          <SelectTrigger className="max-w-40">
            <SelectValue placeholder="Select Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="all">All</SelectItem>

            {/* Add more options as needed */}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
