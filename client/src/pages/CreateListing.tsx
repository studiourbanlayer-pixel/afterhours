import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, Upload, X } from "lucide-react";
import { useState, useRef } from "react";
import { showSuccess, showError, toastMessages } from "@/lib/toast";
import { getErrorMessage } from "@/lib/errors";

export default function CreateListing() {
  const [, navigate] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    venueAddress: "",
    eventDate: "",
    capacity: "",
    ticketPrice: "",
    coverImageUrl: "",
  });
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const createMutation = trpc.listings.create.useMutation();
  const uploadImageMutation = trpc.listings.uploadCoverImage.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError("Image must be smaller than 5MB");
      return;
    }

    try {
      setIsUploadingImage(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageData = event.target?.result as string;
        const base64Data = imageData.split(",")[1];

        const result = await uploadImageMutation.mutateAsync({
          fileName: file.name,
          fileData: base64Data,
          mimeType: file.type,
        });

        setFormData((prev) => ({ ...prev, coverImageUrl: result.url }));
        setCoverImagePreview(result.url);
        showSuccess("Image uploaded successfully");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      showError("Failed to upload image");
      console.error(error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, coverImageUrl: "" }));
    setCoverImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

            {/* Cover Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image
              </label>
              {coverImagePreview ? (
                <div className="relative">
                  <img
                    src={coverImagePreview}
                    alt="Cover preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploadingImage}
                className="hidden"
              />
              {isUploadingImage && (
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading image...
                </div>
              )}
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
