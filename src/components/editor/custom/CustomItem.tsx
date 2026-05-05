import { useCallback, useState } from "react";
import {
  motion,
  useDragControls,
  Reorder,
  AnimatePresence,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useResumeStore } from "@/store/useResumeStore";
import { GripVertical, Eye, EyeOff, ChevronDown, Trash2 } from "lucide-react";
import Field from "../Field";
import { useTranslations } from "@/i18n/compat/client";

import { CustomItem as CustomItemType } from "@/types/resume";
import ThemeModal from "@/components/shared/ThemeModal";
const CustomItemEditor = ({
  item,
  isEducationList,
  onSave,
}: {
  item: CustomItemType;
  isEducationList: boolean;
  onSave: (item: CustomItemType) => void;
}) => {
  const t = useTranslations("workbench.educationItem");
  const handleChange = (field: keyof CustomItemType, value: string) => {
    onSave({ ...item, [field]: value });
  };

  if (isEducationList) {
    return (
      <div className="space-y-5">
        <div className="grid gap-5">
          <div className="grid grid-cols-2 gap-4">
            <Field
              label={t("labels.school")}
              value={item.school || ""}
              onChange={(value) => handleChange("school", value)}
              placeholder={t("placeholders.school")}
            />
            <Field
              label={t("labels.major")}
              value={item.major || ""}
              onChange={(value) => handleChange("major", value)}
              placeholder={t("placeholders.major")}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field
              label={t("labels.degree")}
              value={item.degree || ""}
              onChange={(value) => handleChange("degree", value)}
              placeholder={t("placeholders.degree")}
            />
            <Field
              label={t("labels.gpa")}
              value={item.gpa || ""}
              onChange={(value) => handleChange("gpa", value)}
              placeholder={t("placeholders.gpa")}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field
              label={t("labels.startDate")}
              value={item.startDate || ""}
              onChange={(value) => handleChange("startDate", value)}
              type="date"
              placeholder="YYYY/MM 또는 YYYY/MM/DD"
            />
            <Field
              label={t("labels.endDate")}
              value={item.endDate || ""}
              onChange={(value) => handleChange("endDate", value)}
              type="date"
              placeholder="YYYY/MM 또는 YYYY/MM/DD"
              showPresentSwitch={true}
            />
          </div>
          <Field
            label={t("labels.description")}
            value={item.description}
            onChange={(value) => handleChange("description", value)}
            type="editor"
            placeholder={t("placeholders.description")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Title"
            value={item.title}
            onChange={(value) => handleChange("title", value)}
            placeholder="Title"
          />
          <Field
            label="Subtitle"
            value={item.subtitle}
            onChange={(value) => handleChange("subtitle", value)}
            placeholder="Subtitle"
          />
        </div>

        <Field
          label="Date range"
          value={item.dateRange}
          onChange={(value) => handleChange("dateRange", value)}
          type="date-range"
          placeholder="e.g. 2023.01 - 2024.01"
        />

        <Field
          label="Description"
          value={item.description}
          onChange={(value) => handleChange("description", value)}
          type="editor"
          placeholder="Enter a detailed description..."
        />
      </div>
    </div>
  );
};

const CustomItem = ({
  item,
  sectionId,
}: {
  item: CustomItemType;
  sectionId: string;
}) => {
  const { updateCustomItem, removeCustomItem, activeResume } = useResumeStore();
  const dragControls = useDragControls();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const sectionType =
    activeResume?.customSectionTypes?.[sectionId] || "entry-list";
  const isEducationList = sectionType === "education-list";
  const handleVisibilityToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isUpdating) return;

      setIsUpdating(true);
      setTimeout(() => {
        updateCustomItem(sectionId, item.id, { visible: !item.visible });
        setIsUpdating(false);
      }, 10);
    },
    [item, updateCustomItem, isUpdating, sectionId]
  );

  return (
    <Reorder.Item
      id={item.id}
      value={item}
      dragListener={false}
      dragControls={dragControls}
      className={cn(
        "rounded-lg border overflow-hidden flex group",
        "bg-card hover:border-primary/50",
        "border-border"
      )}
    >
      <div
        onPointerDown={(event) => {
          if (expandedId === item.id) return;
          dragControls.start(event);
        }}
        className={cn(
          "w-12 flex items-center justify-center border-r shrink-0 touch-none",
          "border-border",
          expandedId === item.id
            ? "cursor-not-allowed"
            : "cursor-grab hover:bg-muted/50"
        )}
      >
        <GripVertical
          className={cn(
            "w-4 h-4",
            "text-muted-foreground",
            expandedId === item.id && "opacity-50"
          )}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div
          className={cn(
            "px-4 py-4 flex items-center justify-between cursor-pointer select-none",
            expandedId === item.id && "bg-muted/10"
          )}
          onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
        >
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                 "font-medium truncate text-foreground"
              )}
            >
              {isEducationList
                ? item.school || "School not set"
                : item.title || "Untitled section"}
            </h3>
            {(isEducationList
              ? item.major || item.degree
              : item.subtitle) && (
              <p
                className={cn(
                  "text-sm truncate",
                  "dark:text-neutral-400 text-gray-500"
                )}
              >
                {isEducationList
                  ? [item.major, item.degree].filter(Boolean).join(" · ")
                  : item.subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 ml-4 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              disabled={isUpdating}
              onClick={handleVisibilityToggle}
            >
              {item.visible ? (
                <Eye className="w-4 h-4 text-primary" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-sm",
                "dark:hover:bg-red-900/50 dark:text-red-400 hover:bg-red-50 text-red-600"
              )}
              onClick={(e) => {
                e.stopPropagation();
                setDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <ThemeModal
              isOpen={deleteDialogOpen}
              title={item.title}
              onClose={() => setDeleteDialogOpen(false)}
              onConfirm={() => {
                removeCustomItem(sectionId, item.id);
                setExpandedId(null);
                setDeleteDialogOpen(false);
              }}
            />

            <motion.div
              initial={false}
              animate={{
                rotate: expandedId === item.id ? 180 : 0,
              }}
            >
              <ChevronDown
                className={cn("w-5 h-5", "text-muted-foreground")}
              />
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {expandedId === item.id && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div
                className={cn(
                  "px-4 pb-4 space-y-4",
                  "border-border"
                )}
              >
                <div
                  className={cn(
                    "h-px w-full",
                    "bg-border"
                  )}
                />
                <CustomItemEditor
                  item={item}
                  isEducationList={isEducationList}
                  onSave={(updatedItem) => {
                    updateCustomItem(sectionId, item.id, updatedItem);
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reorder.Item>
  );
};

export default CustomItem;
