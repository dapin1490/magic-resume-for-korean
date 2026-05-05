import { AnimatePresence, motion } from "framer-motion";
import SectionTitle from "./SectionTitle";
import SectionWrapper from "../../shared/SectionWrapper";
import { GlobalSettings, CustomItem } from "@/types/resume";
import { hasMeaningfulRichTextContent, normalizeRichTextContent } from "@/lib/richText";
import { formatDateString, formatDateRange } from "@/lib/utils";
import { useLocale } from "@/i18n/compat/client";

interface CustomSectionProps {
    sectionId: string;
    title: string;
    items: CustomItem[];
    globalSettings?: GlobalSettings;
    showTitle?: boolean;
}

const CustomSection = ({ sectionId, title, items, globalSettings, showTitle = true }: CustomSectionProps) => {
    const locale = useLocale();
    const isEducationList = items?.some(
        (item) =>
            item.school !== undefined ||
            item.major !== undefined ||
            item.degree !== undefined ||
            item.gpa !== undefined ||
            item.startDate !== undefined ||
            item.endDate !== undefined
    );
    const visibleItems = items?.filter(
        (item) =>
            item.visible &&
            (isEducationList
                ? item.school || hasMeaningfulRichTextContent(item.description)
                : item.title || hasMeaningfulRichTextContent(item.description))
    );
    const centerSubtitle = globalSettings?.centerSubtitle;
    const flexLayout = globalSettings?.flexibleHeaderLayout;

    return (
        <SectionWrapper sectionId={sectionId} style={{ marginTop: `${globalSettings?.sectionSpacing || 24}px` }}>
            <SectionTitle title={title} type="custom" globalSettings={globalSettings} showTitle={showTitle} />
            <AnimatePresence mode="popLayout">
                {visibleItems.map((item) => (
                    <motion.div key={item.id} layout="position" style={{ marginTop: `${globalSettings?.paragraphSpacing}px` }}>
                        <motion.div layout="position" className="flex items-center gap-2">
                            <div className={`flex items-center gap-2 ${flexLayout ? "" : "flex-[1.5]"}`}>
                                <h4 className="font-bold" style={{ fontSize: `${globalSettings?.subheaderSize || 16}px` }}>
                                    {isEducationList ? item.school : item.title}
                                </h4>
                            </div>
                            {centerSubtitle && (
                                <motion.div layout="position" className={`text-subtitleFont ${flexLayout ? "ml-[16px]" : "flex-1"}`} style={{ fontSize: `${globalSettings?.subheaderSize || 16}px` }}>
                                    {isEducationList
                                        ? [item.major, item.degree].filter(Boolean).join(" · ")
                                        : item.subtitle}
                                    {isEducationList && item.gpa ? ` · GPA ${item.gpa}` : ""}
                                </motion.div>
                            )}
                            <span className={`text-subtitleFont shrink-0 ${flexLayout ? "ml-auto" : "flex-1 text-right"}`} style={{ fontSize: `${globalSettings?.subheaderSize || 16}px` }}>
                                {isEducationList
                                    ? formatDateRange(item.startDate || "", item.endDate || "", locale)
                                    : formatDateString(item.dateRange, locale)}
                            </span>
                        </motion.div>
                        {!centerSubtitle && (isEducationList ? (item.major || item.degree || item.gpa) : item.subtitle) && (
                            <motion.div layout="position" className="text-subtitleFont mt-1" style={{ fontSize: `${globalSettings?.subheaderSize || 16}px` }}>
                                {isEducationList
                                    ? [item.major, item.degree].filter(Boolean).join(" · ")
                                    : item.subtitle}
                                {isEducationList && item.gpa ? ` · GPA ${item.gpa}` : ""}
                            </motion.div>
                        )}
                        {hasMeaningfulRichTextContent(item.description) && (
                            <motion.div layout="position" className="mt-1 text-baseFont"
                                style={{ fontSize: `${globalSettings?.baseFontSize || 14}px`, lineHeight: globalSettings?.lineHeight || 1.6 }}
                                dangerouslySetInnerHTML={{ __html: normalizeRichTextContent(item.description) }}
                            />
                        )}
                    </motion.div>
                ))}
            </AnimatePresence>
        </SectionWrapper>
    );
};

export default CustomSection;
