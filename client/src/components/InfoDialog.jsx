import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/**
 * Display a titled information dialog and call onClose when it is dismissed.
 */
export default function InfoDialog({ title, onClose, children }) {
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="w-full max-w-[400px] rounded-lg border-0 bg-white p-[34px] shadow-[0_16px_64px_#143e4c33]"
        onClose={onClose}
      >
        <DialogTitle
          id="dialog-title"
          className="m-0 mb-[17px] mr-6 text-[22px] font-semibold leading-normal"
        >
          {title}
        </DialogTitle>
        <DialogDescription className="mb-[22px] text-[17px] leading-[1.6] text-[#61686b]">
          {children ||
            "This service is not configured yet. Please use your email and password to log in."}
        </DialogDescription>
        <DialogFooter>
          <Button className="primary-button" onClick={onClose} autoFocus>
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
