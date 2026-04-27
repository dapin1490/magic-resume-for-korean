import SectionWrapper from "./SectionWrapper";
import CertificatesSection from "./CertificatesSection";
import { Certificate, GlobalSettings } from "@/types/resume";

interface CustomImageGridSectionProps {
  sectionId: string;
  title: string;
  images: Certificate[];
  globalSettings?: GlobalSettings;
}

const CustomImageGridSection = ({
  sectionId,
  title,
  images,
  globalSettings,
}: CustomImageGridSectionProps) => {
  if (!images || images.length === 0) {
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
      <CertificatesSection certificates={images} />
    </SectionWrapper>
  );
};

export default CustomImageGridSection;
