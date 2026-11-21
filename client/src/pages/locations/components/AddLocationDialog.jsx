import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { locationSchema } from "../location.schema";
import { locationService } from "../location.service";

/**
 * Validate and save a new location, using the parent save handler when provided.
 */
export default function AddLocationDialog({ onClose, onSave }) {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isSubmitted, isSubmitting },
  } = useForm({
    defaultValues: { name: "", city: "" },
    mode: "onTouched",
    reValidateMode: "onChange",
    resolver: zodResolver(locationSchema),
  });
  const nameError = (touchedFields.name || isSubmitted) && errors.name?.message;
  const cityError = (touchedFields.city || isSubmitted) && errors.city?.message;

  const submitLocation = handleSubmit(async (values) => {
    try {
      const location = values;
      let created;
      // Let the parent update its location list when it supplies a save handler.
      if (onSave) {
        created = await onSave(location);
      } else {
        created = await locationService.createLocation(location);
      }
      toast.success("Location created successfully", {
        id: "location-feedback",
      });
      onClose();
      return created;
    } catch {
      // The API interceptor displays request errors.
    }
  });

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => !open && !isSubmitting && onClose()}
    >
      <DialogContent
        className="location-dialog w-full max-w-[400px] gap-0 rounded-lg border-0 bg-white p-[34px] shadow-[0_16px_64px_#143e4c33]"
        onClose={() => !isSubmitting && onClose()}
      >
        <DialogTitle
          id="add-location-title"
          className="m-0 mb-2 mr-6 text-[22px] font-semibold leading-normal"
        >
          Add location
        </DialogTitle>
        <form onSubmit={submitLocation} noValidate>
          <label htmlFor="add-location-name">
            <span>
              Location name{" "}
              <span className="required-indicator" aria-hidden="true">
                *
              </span>
            </span>
            <Input
              {...register("name")}
              id="add-location-name"
              required
              disabled={isSubmitting}
              maxLength={80}
              aria-invalid={Boolean(nameError)}
              aria-describedby={nameError ? "name-error" : undefined}
              placeholder="e.g. Headquarters"
            />
            {nameError && (
              <span id="name-error" className="field-error" aria-live="polite">
                {nameError}
              </span>
            )}
          </label>

          <label htmlFor="add-location-city">
            <span>
              City{" "}
              <span className="required-indicator" aria-hidden="true">
                *
              </span>
            </span>
            <Input
              {...register("city")}
              id="add-location-city"
              required
              disabled={isSubmitting}
              maxLength={80}
              aria-invalid={Boolean(cityError)}
              aria-describedby={cityError ? "city-error" : undefined}
              placeholder="e.g. San Francisco"
            />
            {cityError && (
              <span id="city-error" className="field-error" aria-live="polite">
                {cityError}
              </span>
            )}
          </label>

          <Button
            type="submit"
            className="primary-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add location"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
