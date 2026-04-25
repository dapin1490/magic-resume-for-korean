import { useResumeStore } from "@/store/useResumeStore";
import { cn } from "@/lib/utils";
import Field from "../Field";

const SelfEvaluationPanel = () => {
    const { activeResume, updateSelfEvaluationContent } = useResumeStore();
    const selfEvaluationContent = activeResume?.selfEvaluationContent ?? "";
    const handleChange = (value: string) => {
        updateSelfEvaluationContent(value);
    };

    return (
        <div
            className={cn(
                "rounded-lg border p-4",
                "bg-card",
                "border-border"
            )}
        >
            <Field
                value={selfEvaluationContent}
                onChange={handleChange}
                type="editor"
                placeholder="Describe your self-evaluation..."
            />
        </div>
    );
};

export default SelfEvaluationPanel;
