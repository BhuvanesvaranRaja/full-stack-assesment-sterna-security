import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import toast, { resolveValue, Toaster } from "react-hot-toast";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Render app notifications with success or error styling and a dismiss button.
 */
export default function ToastHost() {
  const [container, setContainer] = useState(document.body);

  useEffect(() => {
    // Native modal dialogs sit above the page; render toasts inside the open modal.
    const updateContainer = () => {
      const dialogs = document.querySelectorAll("dialog[open]");
      setContainer(dialogs[dialogs.length - 1] || document.body);
    };
    updateContainer();
    const observer = new MutationObserver(updateContainer);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["open"],
    });
    return () => observer.disconnect();
  }, []);

  return createPortal(
    <Toaster position="bottom-right" toastOptions={{ duration: 5000 }}>
      {(notification) => (
        <div
          className={cn(
            "pointer-events-auto relative flex min-h-16 w-[366px] max-w-[calc(100vw_-_32px)] items-center rounded-[4px] border-l-[5px] bg-white py-2 pl-[13px] pr-[43px] text-[#202528] shadow-[0_3px_14px_rgb(33_61_70_/_7%)] transition-[opacity,transform] duration-150 ease-[ease]",
            notification.type === "error"
              ? "border-l-[#dc6262]"
              : "border-l-[#46bd62]",
            notification.visible
              ? "translate-y-0 opacity-100"
              : "translate-y-[6px] opacity-0",
            "motion-reduce:transition-none",
          )}
          role={notification.type === "error" ? "alert" : "status"}
          aria-live={notification.type === "error" ? "assertive" : "polite"}
          aria-atomic="true"
        >
          <div className="min-w-0">
            <p className="m-0 text-[13px] font-medium leading-[22px]">
              {notification.type === "error" ? "Error" : "Success"}
            </p>
            <p className="m-0 break-words text-[13px] font-normal leading-[22px] text-[#818a90] [overflow-wrap:anywhere]">
              {resolveValue(notification.message, notification)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-[9px] top-1/2 h-6 w-6 -translate-y-1/2 place-items-center rounded-[2px] border-0 bg-transparent p-0 text-[#61686b] hover:bg-[#f5f7f8]"
            aria-label="Dismiss notification"
            onClick={() => toast.dismiss(notification.id)}
          >
            <X size={14} strokeWidth={1.5} aria-hidden="true" />
          </Button>
        </div>
      )}
    </Toaster>,
    container,
  );
}
