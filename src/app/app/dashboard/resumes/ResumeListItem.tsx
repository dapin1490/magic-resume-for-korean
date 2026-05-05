import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DEFAULT_TEMPLATES } from "@/config";

interface ResumeListItemProps {
    id: string;
    resume: any;
    t: any;
    locale: string;
    setActiveResume: (id: string) => void;
    duplicateResume: (id: string) => string;
    updateResume: (resumeId: string, data: any) => void;
    router: any;
    deleteResume: (resume: any) => void;
}

export const ResumeListItem = ({
    id,
    resume,
    t,
    locale,
    setActiveResume,
    duplicateResume,
    updateResume,
    router,
    deleteResume,
}: ResumeListItemProps) => {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [titleDraft, setTitleDraft] = useState(resume.title || "");
    const activeTemplate =
        DEFAULT_TEMPLATES.find((template) => template.id === resume.templateId) ??
        DEFAULT_TEMPLATES[0];
    const templateNameKey =
        activeTemplate.id === "left-right" ? "leftRight" : activeTemplate.id;

    const createdAtDate = new Date(resume.createdAt);
    const updatedAtDate = new Date(resume.updatedAt);
    const isCreatedAtValid = Number.isFinite(createdAtDate.getTime());
    const isUpdatedAtValid = Number.isFinite(updatedAtDate.getTime());

    const formattedCreatedAt = isCreatedAtValid
        ? new Intl.DateTimeFormat(locale, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).format(createdAtDate)
        : "";
    const formattedUpdatedAt = isUpdatedAtValid
        ? new Intl.DateTimeFormat(locale, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).format(updatedAtDate)
        : "";

    const startInlineEdit = () => {
        setTitleDraft(resume.title || "");
        setIsEditingTitle(true);
    };

    const cancelInlineEdit = () => {
        setTitleDraft(resume.title || "");
        setIsEditingTitle(false);
    };

    const saveInlineEdit = () => {
        const trimmedTitle = titleDraft.trim();
        if (!trimmedTitle) {
            toast.error(t("dashboard.resumes.titleEmpty"));
            return;
        }
        updateResume(id, { title: trimmedTitle });
        setIsEditingTitle(false);
        toast.success(t("dashboard.resumes.titleUpdated"));
    };

    return (
        <Card className="p-4 sm:p-5 border border-border">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 space-y-1.5">
                    {isEditingTitle ? (
                        <div className="flex flex-wrap items-center gap-2">
                            <Input
                                value={titleDraft}
                                onChange={(event) => setTitleDraft(event.target.value)}
                                placeholder={t("dashboard.resumes.titleInputPlaceholder")}
                                className="max-w-sm"
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        event.preventDefault();
                                        saveInlineEdit();
                                    }
                                    if (event.key === "Escape") {
                                        event.preventDefault();
                                        cancelInlineEdit();
                                    }
                                }}
                            />
                            <Button size="sm" onClick={saveInlineEdit}>
                                {t("common.confirm")}
                            </Button>
                            <Button size="sm" variant="outline" onClick={cancelInlineEdit}>
                                {t("common.cancel")}
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between gap-2">
                            <div
                                className="text-base font-semibold truncate text-foreground"
                                onDoubleClick={startInlineEdit}
                            >
                                {resume.title || t("dashboard.resumes.untitled")}
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 shrink-0"
                                onClick={startInlineEdit}
                                aria-label={t("dashboard.resumes.renameTitle")}
                            >
                                <Pencil className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                    <div className="text-sm text-muted-foreground">
                        {t(`dashboard.templates.${templateNameKey}.name`)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {formattedCreatedAt
                            ? `${t("dashboard.resumes.createdLabel")}: ${formattedCreatedAt}`
                            : ""}
                        {formattedCreatedAt && formattedUpdatedAt ? " / " : ""}
                        {formattedUpdatedAt
                            ? `${t("dashboard.resumes.updatedLabel")}: ${formattedUpdatedAt}`
                            : ""}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setActiveResume(id);
                            router.push(`/app/workbench/${id}`);
                        }}
                    >
                        {t("common.edit")}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            const newResumeId = duplicateResume(id);
                            setActiveResume(newResumeId);
                            toast.success(t("previewDock.copyResume.success"));
                            router.push(`/app/workbench/${newResumeId}`);
                        }}
                    >
                        {t("common.copy")}
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-500 dark:hover:bg-red-950/50 dark:hover:text-red-400"
                            >
                                {t("common.delete")}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{t("dashboard.resumes.deleteConfirmTitle")}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {t("dashboard.resumes.deleteConfirmDescription")}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600 border-none"
                                    onClick={() => {
                                        deleteResume(resume);
                                        toast.success(t("common.deleteSuccess"));
                                    }}
                                >
                                    {t("common.confirm")}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </Card>
    );
};
