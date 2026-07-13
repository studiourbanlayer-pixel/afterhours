import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, Upload, X, AlertCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { showSuccess, showError, toastMessages } from "@/lib/toast";
import { getErrorMessage } from "@/lib/errors";

export default function EditListing({ id }: { id: number }) {
  const [, navigate] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
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

  const { data: listing, isLoading: isLoadingListing, error: listingError } = trpc.listings.getById.useQuery(id);
  const updateMutation = trpc.listings.update.useMutation();
  const uploadImageMutation = trpc.listings.uploadCoverImage.useMutation();

  useEffect(() => {
    if (listing) {
      setFormData({
        title: listing.title || "",
        description: listing.description || "",
        venueAddress: listing.venueAddress || "",
        eventDate: listing.eventDate ? new Date(listing.eventDate).toISOString().slice(0, 16) : "",
        capacity: listing.capacity?.toString() || "",
        ticketPrice: (listing.ticketPriceCents / 100).toFixed(2),
        coverImageUrl: listing.coverImageUrl || "",
      });
      if (listing.coverImageUrl) {
        setCoverImagePreview(listing.coverImageUrl);
      }
    }
  }, [listing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const processImageFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      showError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showError("Image must be smaller than 5MB");
      return;
    }

    try {
      setIsUploadingImage(true);
      const reader = new FileReader();

      reader.onload = async (event) => {
        try {
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
        } catch (error) {
          showError("Failed to upload image");
          console.error(error);
        } finally {
          setIsUploadingImage(false);
        }
      };

      reader.onerror = () => {
        showError("Failed to read image file");
        setIsUploadingImage(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      showError("Failed to process image");
      console.error(error);
      setIsUploadingImage(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processImageFile(file);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      await processImageFile(files[0]);
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
      await updateMutation.mutateAsync({
        id,
        title: formData.title,
        description: formData.description || undefined,
        venueAddress: formData.venueAddress || undefined,
        eventDate: new Date(formData.eventDate),
        capacity,
        ticketPriceCents: Math.round(price * 100),
        coverImageUrl: formData.coverImageUrl || undefined,
      });

      showSuccess("Event updated successfully");
      navigate("/dashboard");
    } catch (error) {
      showError(getErrorMessage(error));
      console.error(error);
    }
  };

  // Loading state
  if (isLoadingListing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Error state - listing not found or unauthorized
  if (listingError || !listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Event Not Found</h2>
            <p className="text-gray-600 mb-6">
              {listingError ? "Failed to load event" : "This event does not exist or you don't have permission to edit it"}
            </p>
            <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
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
                    disabled={isUploadingImage}
                    className="absolute top-2 right-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    dragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-blue-500"
                  } ${isUploadingImage ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">
                    {isUploadingImage
                      ? "Uploading..."
                      : "Drag and drop your image here, or click to select"}
                  </p>
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
                disabled={updateMutation.isPending || isUploadingImage}
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Event"
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
