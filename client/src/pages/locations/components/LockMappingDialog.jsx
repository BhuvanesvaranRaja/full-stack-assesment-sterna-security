import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { lockMappingSchema } from "../lock-mapping.schema";
import { lockMappingApi } from "../lock-mapping.api";

const fields = [
  ["lockName", "Lock name"],
  ["assetMarking", "Asset marking"],
  ["lockType", "Lock type"],
  ["batteryPercentage", "Battery percentage"],
];

/**
 * Validate and save a new or existing lock mapping; API errors are shown as toasts.
 */
export default function LockMappingDialog({
  locationId,
  mapping,
  onClose,
  onSaved,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(lockMappingSchema),
    mode: "onTouched",
    // Reuse the form for creating a mapping or editing the supplied mapping.
    defaultValues: {
      lockName: mapping?.lockName ?? "",
      assetMarking: mapping?.assetMarking ?? "",
      lockType: mapping?.lockType ?? "",
      batteryPercentage: mapping?.batteryPercentage ?? "",
    },
  });
  const close = () => {
    if (!isSubmitting) onClose();
  };
  const submit = handleSubmit(async (values) => {
    try {
      const saved = await lockMappingApi.save(locationId, mapping?.id, values);
      onSaved(saved);
      toast.success(mapping ? "Lock mapping updated" : "Lock mapping created");
      onClose();
    } catch {
      // The API interceptor displays server errors as toast messages.
    }
  });
  return (
    <Dialog open onOpenChange={(open) => !open && close()}>
      <DialogContent
        className="location-dialog lock-mapping-dialog"
        onClose={close}
      >
        <DialogTitle>
          {mapping ? "Edit lock mapping" : "Add lock mapping"}
        </DialogTitle>
        <form onSubmit={submit} noValidate>
          {fields.map(([name, label]) => (
            <label key={name} htmlFor={`mapping-${name}`}>
              <span>
                {label}
                {name !== "batteryPercentage" && (
                  <>
                    {" "}
                    <span className="required-indicator" aria-hidden="true">
                      *
                    </span>
                  </>
                )}
              </span>
              <Input
                {...register(name)}
                id={`mapping-${name}`}
                disabled={isSubmitting}
                type={name === "batteryPercentage" ? "number" : "text"}
                required={name !== "batteryPercentage"}
                maxLength={80}
                min={name === "batteryPercentage" ? 0 : undefined}
                max={name === "batteryPercentage" ? 100 : undefined}
                step={name === "batteryPercentage" ? 1 : undefined}
                aria-invalid={Boolean(errors[name])}
                aria-describedby={
                  errors[name] ? `mapping-${name}-error` : undefined
                }
              />
              {errors[name] && (
                <span
                  className="field-error"
                  id={`mapping-${name}-error`}
                  role="alert"
                >
                  {errors[name].message}
                </span>
              )}
            </label>
          ))}
          <Button
            type="submit"
            className="primary-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save mapping"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
