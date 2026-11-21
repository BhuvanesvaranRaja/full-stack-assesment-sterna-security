import toast from "react-hot-toast";

/**
 * Return a non-empty message from an API response, or undefined if none is available.
 */
function readErrorMessage(data) {
  if (!data || typeof data !== "object") return undefined;
  const { message } = data;
  return typeof message === "string" && message.trim() ? message : undefined;
}

/**
 * Collect valid field-error messages into one flat array for display.
 */
function getValidationMessages(errors) {
  if (!errors || typeof errors !== "object") return [];

  return Object.values(errors).flatMap((messages) => {
    if (typeof messages === "string" && messages.trim()) return [messages];
    if (!Array.isArray(messages)) return [];
    return messages.filter(
      (message) => typeof message === "string" && message.trim(),
    );
  });
}

/**
 * Display toast messages for an Axios error, using its response status or connection failure.
 */
export function showRequestError(error) {
  const status = error.response?.status;
  // Without an HTTP response, distinguish timeout, offline, and connection errors.
  if (!status) {
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      toast.error("The request timed out. Please try again.", {
        id: "api-timeout",
      });
    } else if (typeof navigator !== "undefined" && !navigator.onLine) {
      toast.error(
        "You appear to be offline. Check your connection and try again.",
        {
          id: "api-offline",
        },
      );
    } else {
      toast.error("Unable to reach the server. Please try again.", {
        id: "api-network-error",
      });
    }
    return;
  }

  const data = error.response.data;
  if (status === 400 || status === 422) {
    const validationMessages = getValidationMessages(data?.errors);
    if (validationMessages.length > 0) {
      validationMessages.forEach((message, index) => {
        toast.error(message, { id: `api-validation-${index}-${message}` });
      });
    } else {
      toast.error(readErrorMessage(data) || "Validation error", {
        id: `api-validation-${status}`,
      });
    }
    return;
  }

  if (status === 401) {
    toast.error(readErrorMessage(data) || "Please sign in again.", {
      id: "api-unauthorized",
    });
    return;
  }

  if (status === 403) {
    toast.error(
      readErrorMessage(data) || "You are not allowed to perform this action.",
      { id: "api-forbidden" },
    );
    return;
  }

  if ([404, 408, 413, 415, 429, 500, 502, 503, 504].includes(status)) {
    toast.error(
      readErrorMessage(data) || `Request failed with status ${status}.`,
      { id: `api-error-${status}` },
    );
    return;
  }

  toast.error(
    readErrorMessage(data) || `The request could not be completed (${status}).`,
    { id: `api-error-${status}` },
  );
}
