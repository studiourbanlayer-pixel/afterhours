import { toast } from "sonner";

export function showSuccess(message: string) {
  toast.success(message, {
    duration: 3000,
  });
}

export function showError(message: string) {
  toast.error(message, {
    duration: 4000,
  });
}

export function showLoading(message: string) {
  toast.loading(message);
}

export function showInfo(message: string) {
  toast.info(message, {
    duration: 3000,
  });
}

export const toastMessages = {
  // Auth
  logoutSuccess: "You've been logged out",
  roleSetSuccess: "Role updated successfully",

  // Listings
  listingCreated: "Event created successfully",
  listingUpdated: "Event updated successfully",
  listingCancelled: "Event cancelled",
  listingDeleted: "Event deleted",

  // Bookings
  bookingCreated: "Booking confirmed",
  bookingCancelled: "Booking cancelled",

  // Payments
  checkoutOpened: "Opening checkout page...",
  paymentProcessing: "Processing payment...",
  paymentSuccess: "Payment successful! Your booking is confirmed",
  paymentFailed: "Payment failed. Please try again",

  // Errors
  loadingFailed: "Failed to load data",
  saveFailed: "Failed to save changes",
  deleteFailed: "Failed to delete item",
  networkError: "Network error. Please check your connection",
};
