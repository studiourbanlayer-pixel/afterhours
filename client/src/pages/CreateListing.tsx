import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { showSuccess, showError, toastMessages } from "@/lib/toast";
import { getErrorMessage } from "@/lib/errors";

export default function CreateListing() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    venueAddress: "",
    eventDate: "",
    capacity: "",
    ticketPrice: "",
    coverImageUrl: "",
  });

  const createMutation = trpc.listings.create.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.eventDate || !formData.capacity || !formData.ticketPrice) {
      showError("Please fill in all required fields");
      return;
    }

    const capacity = parseInt(formData.capacity);
    const price = parseFloat(formData.ticketPrice);

    if (capacity < 1) {
      showError("Capacity must be at least 1");
      return;
    }

    if (price < 0.01) {
      showError("Ticket price must be at least $0.01");
      return;
    }

    try {
      await createMutation.mutateAsync({
        title: formData.title,
        description: formData.description || undefined,
        venueAddress: formData.venueAddress || undefined,
        eventDate: new Date(formData.eventDate),
        capacity,
        ticketPriceCents: Math.round(price * 100),
        coverImageUrl: formData.coverImageUrl || undefined,
      });

      showSuccess(toastMessages.listingCreated);
      navigate("/dashboard");
    } catch (error) {
      showError(getErrorMessage(error));
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Summer Music Festival"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell guests about your event..."
                rows={4}
              />
            </div>

            {/* Venue Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue Address
              </label>
              <Input
                name="venueAddress"
                value={formData.venueAddress}
                onChange={handleChange}
                placeholder="e.g., 123 Main St, City, State"
              />
            </div>

            {/* Event Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Date & Time *
              </label>
              <Input
                type="datetime-local"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ticket Capacity *
              </label>
              <Input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="e.g., 100"
                min="1"
                required
              />
            </div>

            {/* Ticket Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ticket Price (USD) *
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">$</span>
                <Input
                  type="number"
                  name="ticketPrice"
                  value={formData.ticketPrice}
                  onChange={handleChange}
                  placeholder="e.g., 29.99"
                  step="0.01"
                  min="0.01"
                  required
                />
              </div>
            </div>

            {/* Cover Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image URL
              </label>
              <Input
                name="coverImageUrl"
                value={formData.coverImageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                type="url"
              />
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Event"
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
