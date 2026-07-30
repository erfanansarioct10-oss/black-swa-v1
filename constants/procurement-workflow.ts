import { FileText, Cpu, ShieldCheck, Truck, type LucideIcon } from "lucide-react";

export interface ProcurementStepItem {
  id: string;
  stepNumber: string;
  title: string;
  desc: string;
  deliverable: string;
  image: string;
  iconName: "FileText" | "Cpu" | "ShieldCheck" | "Truck";
}

export const PROCUREMENT_STEPS: ProcurementStepItem[] = [
  {
    id: "consultation",
    stepNumber: "01",
    title: "Technical Consultation & Custom Spec",
    desc: "In-depth engineering assessment of your clinical DICOM/PACS or broadcast SMPTE ST 2110 hardware requirements.",
    deliverable: "Custom Spec Proposal",
    image: "/procurement/custom-spec.webp",
    iconName: "FileText",
  },
  {
    id: "engineering",
    stepNumber: "02",
    title: "Custom Engineering & SLA Mapping",
    desc: "Tier-1 component BOM selection, thermal & power profiling, rack sizing, and 4-hour SLA field warranty mapping.",
    deliverable: "BOM & SLA Contract",
    image: "/procurement/sla-mapping.webp",
    iconName: "Cpu",
  },
  {
    id: "testing",
    stepNumber: "03",
    title: "Factory QA & 72-Hour Burn-in",
    desc: "72-hour continuous load stress testing, ISO 13485 medical device QA, and SMPTE video signal validation.",
    deliverable: "QA Certificate",
    image: "/procurement/burn-in.webp",
    iconName: "ShieldCheck",
  },
  {
    id: "deployment",
    stepNumber: "04",
    title: "White-Glove Deployment & SLA Support",
    desc: "Insured climate-controlled transport, on-site rack integration, cabling, and 24/7 dedicated engineering support.",
    deliverable: "Live System Handoff",
    image: "/procurement/sla-support.webp",
    iconName: "Truck",
  },
];

export function getProcurementStepIcon(
  iconName: ProcurementStepItem["iconName"]
): LucideIcon {
  switch (iconName) {
    case "FileText":
      return FileText;
    case "Cpu":
      return Cpu;
    case "ShieldCheck":
      return ShieldCheck;
    case "Truck":
      return Truck;
    default:
      return FileText;
  }
}
