import { motion } from "framer-motion";
import SectionWrapper from "./SectionWrapper";
import { GlobalSettings } from "@/types/resume";
import { normalizeRichTextContent } from "@/lib/richText";

interface CustomRichTextSectionProps {
  sectionId: string;
  title: string;
  content: string;
  globalSettings?: GlobalSettings;
}

const CustomRichTextSection = ({
  sectionId,
  title,
  content,
  globalSettings,
}: CustomRichTextSectionProps) => {
  if (!content) {
    return null;
  }

  const themeColor = globalSettings?.themeColor;

  return (
    <SectionWrapper
      sectionId={sectionId}
      style={{ marginTop: `${globalSettings?.sectionSpacing || 24}px` }}
    >
      <h3
        className="font-bold border-b pb-1"
        style={{
          fontSize: `${globalSettings?.headerSize || 18}px`,
          color: themeColor,
          borderColor: themeColor,
          marginBottom: `${globalSettings?.paragraphSpacing}px`,
        }}
      >
        {title}
      </h3>
      <motion.div>
        <motion.div
          className="text-baseFont"
          style={{
            fontSize: `${globalSettings?.baseFontSize || 14}px`,
            lineHeight: globalSettings?.lineHeight || 1.6,
          }}
          dangerouslySetInnerHTML={{ __html: normalizeRichTextContent(content) }}
        />
      </motion.div>
    </SectionWrapper>
  );
};

export default CustomRichTextSection;
