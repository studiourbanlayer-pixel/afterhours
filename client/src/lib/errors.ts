import { TRPCClientError } from "@trpc/client";
import type { AppRouter } from "../../../server/routers";

export function getErrorMessage(error: unknown): string {
  if (error instanceof TRPCClientError) {
    return error.message || "An error occurred";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function calculateCommission(totalCents: number): number {
  return Math.round(totalCents * 0.1);
}

export function calculateHostPayout(totalCents: number): number {
  return totalCents - calculateCommission(totalCents);
}

export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const errorMessages: Record<string, string> = {
  UNAUTHORIZED: "You must be logged in to perform this action",
  FORBIDDEN: "You don't have permission to perform this action",
  NOT_FOUND: "The requested resource was not found",
  BAD_REQUEST: "Invalid request. Please check your input",
  INTERNAL_SERVER_ERROR: "An error occurred on the server. Please try again",
  CONFLICT: "This action conflicts with existing data",
  UNPROCESSABLE_CONTENT: "Invalid data provided",
  TOO_MANY_REQUESTS: "Too many requests. Please try again later",
};

export function getErrorMessageForCode(code: string): string {
  return errorMessages[code] || "An unexpected error occurred";
}
