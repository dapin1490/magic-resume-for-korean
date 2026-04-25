import { useRef } from "react";
import { Reorder } from "framer-motion";
import { ImagePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useResumeStore } from "@/store/useResumeStore";
import { generateUUID } from "@/utils/uuid";
import { compressImage, estimateBase64Size } from "@/utils/imageUtils";
import { toast } from "sonner";

const CustomImagePanel = ({ sectionId }: { sectionId: string }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    activeResume,
    addCustomImage,
    updateCustomImage,
    removeCustomImage,
    updateCustomImageData,
  } = useResumeStore();
  const images = activeResume?.customImageData?.[sectionId] || [];

  const handleCreateImage = (url: string) => {
    addCustomImage(sectionId, {
      id: generateUUID(),
      url,
      width: 100,
    });
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Format error");
      return;
    }
    try {
      let imageData: string;
      if (file.size > 2 * 1024 * 1024) {
        imageData = await compressImage(file, 800, 800, 0.7);
        let compressedSize = estimateBase64Size(imageData);
        if (compressedSize > 2 * 1024 * 1024) {
          imageData = await compressImage(file, 600, 600, 0.5);
          compressedSize = estimateBase64Size(imageData);
          if (compressedSize > 2 * 1024 * 1024) {
            imageData = await compressImage(file, 400, 400, 0.4);
          }
        }
      } else {
        imageData = await compressImage(file, 1200, 1200, 0.8);
      }
      handleCreateImage(imageData);
    } catch (_error) {
      toast.error("Upload error");
    }
  };

  return (
    <div className={cn("space-y-4 px-4 py-4 rounded-lg", "bg-card")}>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={(event) => {
          const selectedFiles = event.target.files;
          if (selectedFiles) {
            Array.from(selectedFiles).forEach((file) => handleFile(file));
          }
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }}
      />

      <Reorder.Group
        axis="y"
        values={images}
        onReorder={(newOrder) => updateCustomImageData(sectionId, newOrder)}
        className="space-y-3"
      >
        {images.map((image) => (
          <Reorder.Item
            key={image.id}
            id={image.id}
            value={image}
            className="rounded-lg border overflow-hidden bg-card border-border"
          >
            <div className="flex h-24">
              <div className="w-24 border-r border-border shrink-0 bg-muted/20 p-2 flex items-center justify-center overflow-hidden">
                <img
                  src={image.url}
                  alt="custom section"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0 p-4 flex flex-col justify-center gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Width: {image.width}%</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 -mr-2"
                    onClick={() => removeCustomImage(sectionId, image.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Slider
                  value={[image.width]}
                  min={10}
                  max={100}
                  step={5}
                  onValueChange={([value]) =>
                    updateCustomImage(sectionId, image.id, { width: value })
                  }
                />
              </div>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <Button onClick={() => fileInputRef.current?.click()} className="w-full">
        <ImagePlus className="w-4 h-4 mr-2" />
        Add image
      </Button>
    </div>
  );
};

export default CustomImagePanel;
