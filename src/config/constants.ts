import { BasicFieldType } from "@/types/resume";

export const DEFAULT_FIELD_ORDER: BasicFieldType[] = [
  { id: "1", key: "name", label: "Name", type: "text", visible: true },

  { id: "2", key: "title", label: "Title", type: "text", visible: true },
  {
    id: "3",
    key: "employementStatus",
    label: "Status",
    type: "text",
    visible: true
  },
  { id: "4", key: "birthDate", label: "Birth Date", type: "date", visible: true },
  { id: "5", key: "email", label: "Email", type: "text", visible: true },
  { id: "6", key: "phone", label: "Phone", type: "text", visible: true },
  { id: "7", key: "location", label: "Location", type: "text", visible: true }
];

export const GITHUB_REPO_URL = "https://github.com/JOYCEQL/magic-resume";

export const PDF_EXPORT_CONFIG = {
  SERVER_URL: "https://api.magicv.art/generate-pdf",
  TIMEOUT: 45000,
  MAX_RETRY: 2,
  MAX_CONTENT_SIZE: 5 * 1024 * 1024
} as const;
