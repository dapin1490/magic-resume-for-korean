import { memo } from "react";
import { cn } from "@/lib/utils";
import Field from "../Field";
import { useResumeStore } from "@/store/useResumeStore";

const CustomTextPanel = memo(({ sectionId }: { sectionId: string }) => {
  const { activeResume, updateCustomTextData } = useResumeStore();
  const content = activeResume?.customTextData?.[sectionId] || "";

  return (
    <div className={cn("space-y-4 px-4 py-4 rounded-lg", "bg-card")}>
      <Field
        label="내용"
        value={content}
        onChange={(value) => updateCustomTextData(sectionId, value)}
        type="editor"
        placeholder="섹션 내용을 입력하세요"
      />
    </div>
  );
});

CustomTextPanel.displayName = "CustomTextPanel";

export default CustomTextPanel;
