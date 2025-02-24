import { Badge } from "@/app/components/ui/badge";
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
import { Check, Trash, X } from "lucide-react";
import { useCallback, useState } from "react";

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
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldToDelete, setFieldToDelete] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setFieldName("");
    setDefaultValue("");
    setErrorMessage("");
  }, []);

  const handleAddField = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!fieldName.trim()) {
        setErrorMessage("Field name is required");
        return;
      }
      onAddField({ name: fieldName, type: fieldType, value: defaultValue });
      resetForm();
    },
    [fieldName, fieldType, defaultValue, onAddField, resetForm],
  );

  const confirmDeleteField = useCallback((fieldName: string) => {
    setFieldToDelete(fieldName);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (fieldToDelete) {
      onRemoveField(fieldToDelete);
      setFieldToDelete(null);
    }
  }, [fieldToDelete, onRemoveField]);

  const handleCancelDelete = useCallback(() => {
    setFieldToDelete(null);
  }, []);

  const isCustomFieldsEmpty = Object.keys(customFields).length === 0;

  return (
    <div>
      <h3 className="text-sm font-semibold mt-8 mb-4">Custom Fields</h3>
      {isCustomFieldsEmpty ? (
        <p className="text-sm text-gray-500">No custom fields added</p>
      ) : (
        <ul>
          {Object.keys(customFields).map((key) => (
            <li key={key} className="flex justify-between items-center mb-2">
              <span className="text-sm">
                {customFields[key].name}
                <Badge variant="outline" className="ml-4">
                  {customFields[key].type}
                </Badge>
              </span>
              {fieldToDelete === key ? (
                <div className="flex items-center">
                  <span className="mr-2 text-sm">Confirm delete ?</span>
                  <Check
                    className="text-green-500 cursor-pointer w-4 h-4 mr-2"
                    onClick={handleConfirmDelete}
                    aria-label="Confirm delete"
                  />
                  <X
                    className="text-red-500 cursor-pointer w-4 h-4"
                    onClick={handleCancelDelete}
                    aria-label="Cancel delete"
                  />
                </div>
              ) : (
                <Trash
                  className="text-red-500 cursor-pointer w-4 h-4"
                  onClick={() => confirmDeleteField(key)}
                  aria-label="Delete field"
                />
              )}
            </li>
          ))}
        </ul>
      )}
      <h3 className="text-sm font-semibold mt-8 mb-2">Add Custom Field</h3>

      <form onSubmit={handleAddField} className="flex gap-2 mb-4 mt-4">
        <Input
          placeholder="Field Name"
          value={fieldName}
          className={errorMessage ? "border-red-500" : ""}
          onChange={(e) => {
            setFieldName(e.target.value);
            setErrorMessage("");
          }}
          aria-label="Field Name"
        />
        <Select
          value={fieldType}
          onValueChange={(value) => setFieldType(value as CustomField["type"])}
          aria-label="Field Type"
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
            aria-label="Default Value for Number"
          />
        ) : fieldType === "checkbox" ? (
          <Select
            value={defaultValue}
            onValueChange={(value) => setDefaultValue(value)}
            aria-label="Default Value for Checkbox"
          >
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
            aria-label="Default Value for Text"
          />
        )}
        <Button type="submit">Add Field</Button>
      </form>
      {errorMessage && (
        <p id="name-error" role="alert" aria-live="polite" className="text-red-500 text-xs">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
