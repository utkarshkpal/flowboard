import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { CustomField } from "@/app/store/useTaskStore";
import { useState } from "react";

interface CustomFieldsEditorProps {
  customFields: Record<string, CustomField>;
  onAddField: (field: CustomField) => void;
  onRemoveField: (fieldName: string) => void;
}

export default function CustomFieldsEditor({
  customFields,
  onAddField,
  onRemoveField,
}: CustomFieldsEditorProps) {
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState<CustomField["type"]>("text");
  const [defaultValue, setDefaultValue] = useState("");

  const resetForm = () => {
    setFieldName("");
    setDefaultValue("");
  };

  const handleAddField = () => {
    if (!fieldName.trim()) return;
    onAddField({ name: fieldName, type: fieldType, value: defaultValue });
    resetForm();
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Custom Fields</h3>
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Field Name"
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
        />
        <Select
          value={fieldType}
          onValueChange={(value) => setFieldType(value as CustomField["type"])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="checkbox">Checkbox</SelectItem>
          </SelectContent>
        </Select>
        {fieldType === "number" ? (
          <Input
            type="number"
            placeholder="Default Value"
            value={defaultValue}
            onChange={(e) => setDefaultValue(e.target.value)}
          />
        ) : fieldType === "checkbox" ? (
          <Select value={defaultValue} onValueChange={(value) => setDefaultValue(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Default" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">True</SelectItem>
              <SelectItem value="false">False</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Input
            placeholder="Default Value"
            value={defaultValue}
            onChange={(e) => setDefaultValue(e.target.value)}
          />
        )}
        <Button onClick={handleAddField}>Add Field</Button>
      </div>
      <ul>
        {Object.keys(customFields).map((key) => (
          <li key={key} className="flex justify-between items-center mb-2">
            <span>
              {customFields[key].name} ({customFields[key].type})
            </span>
            <Button variant="outline" onClick={() => onRemoveField(key)}>
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
