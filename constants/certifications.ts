import {
  ShieldCheck,
  Award,
  FileCheck,
  CheckCircle2,
  Building2,
  Zap,
  Activity,
  Check,
  LucideIcon,
} from "lucide-react";

/**
 * Category types for filtering or styling certifications in the future
 */
export type CertificationCategory = "medical" | "broadcast" | "quality" | "environmental" | "security";

/**
 * Status types for certification validity
 */
export type CertificationStatus = "Active" | "Verified" | "Under Renewal";

/**
 * Flexible Data Model for Certifications
 * Designed for easy future expansion, editing, or replacement (e.g. via CMS or Database).
 */
export interface CertificationItem {
  id: string;
  code: string;
  title: string;
  category: CertificationCategory;
  categoryLabel: string;
  issuingBody: string;
  issuingBodyLogo?: string;
  certificateId: string;
  status: CertificationStatus;
  validityRange?: string;
  scope: string;
  summary: string;
  details: string;
  auditFrequency: string;
  badgeColor: string;
  iconName: string;
  verificationUrl?: string;
  pdfSampleUrl?: string;
}

/**
 * Dynamic Lucide Icon Mapper with safe fallback
 */
const ICON_MAP: Record<string, LucideIcon> = {
  ShieldCheck,
  Award,
  FileCheck,
  CheckCircle2,
  Building2,
  Zap,
  Activity,
  Check,
};

export function getCertificationIcon(iconName: string): LucideIcon {
  return ICON_MAP[iconName] || ShieldCheck;
}

/**
 * Centralized Certifications Dataset
 * To replace or add certifications in the future, simply update or append items to this array
 * (or fetch from API/Database without changing component markup).
 */
export const CERTIFICATIONS_DATA: CertificationItem[] = [
  {
    id: "iso-13485",
    code: "ISO 13485:2016",
    title: "Medical Devices Quality Management",
    category: "medical",
    categoryLabel: "Medical Equipment Standard",
    issuingBody: "TÜV SÜD South Asia / International",
    certificateId: "ISO-13485-2026-MED-9942",
    status: "Active",
    validityRange: "2024 - 2027",
    scope: "Design, assembly, quality control, and distribution of medical imaging processors and telehealth computing gateways.",
    summary: "Certified quality management standard for medical device assembly, hardware integration, and risk management.",
    details: "Specifies requirements for a quality management system where an organization needs to demonstrate its ability to provide medical devices and related services that consistently meet customer and applicable regulatory requirements.",
    auditFrequency: "Annual Surveillance Audit",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    iconName: "ShieldCheck",
  },
  {
    id: "iec-60601-1",
    code: "IEC 60601-1",
    title: "Medical Electrical Equipment Safety",
    category: "medical",
    categoryLabel: "Electrical Safety & EMC",
    issuingBody: "BSI Group / TÜV Rheinland",
    certificateId: "IEC-60601-1-SAF-8821",
    status: "Verified",
    validityRange: "2025 - 2028",
    scope: "General requirements for basic safety and essential performance of medical electrical hardware workstations.",
    summary: "Comprehensive compliance for electrical insulation, risk mitigation, and electromagnetic compatibility in operating rooms.",
    details: "Ensures that medical computer systems and imaging hardware pass rigorous testing for electrical shock prevention, thermal safety, radiation exposure safety, and electromagnetic interference resistance.",
    auditFrequency: "Bi-Annual Hardware Testing",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
    iconName: "Zap",
  },
  {
    id: "ce-mdr",
    code: "CE MDR (EU 2017/745)",
    title: "European Conformity Medical Directive",
    category: "medical",
    categoryLabel: "EU Regulatory Marking",
    issuingBody: "DEKRA Certification B.V.",
    certificateId: "CE-MDR-EU-2026-4412",
    status: "Active",
    validityRange: "2024 - 2029",
    scope: "Compliance with European Union Medical Device Regulation for health, safety, and environmental standards.",
    summary: "Mandatory EU product compliance for medical technology units deployed in European and partner healthcare systems.",
    details: "Demonstrates full compliance with EU Regulation 2017/745, confirming clinical evaluation, post-market surveillance, and technical documentation integrity for hardware systems.",
    auditFrequency: "Annual Notified Body Review",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-300",
    iconName: "Award",
  },
  {
    id: "fda-registered",
    code: "FDA Infrastructure Compliant",
    title: "US FDA Medical Hardware Standards",
    category: "medical",
    categoryLabel: "US Healthcare Compliance",
    issuingBody: "US Food & Drug Administration (CDRH)",
    certificateId: "FDA-REG-3018892410",
    status: "Verified",
    validityRange: "2026 Annual Registration",
    scope: "Medical device facility registration and device listing for clinical video processing and diagnostic computing hardware.",
    summary: "Registered facility compliance meeting US FDA Quality System Regulation (QSR 21 CFR Part 820) criteria.",
    details: "Facilitates seamless deployment of clinical hardware gateways into US-regulated hospitals and diagnostic facilities adhering to strict traceability and quality controls.",
    auditFrequency: "Annual Establishment Registration",
    badgeColor: "bg-cyan-100 text-cyan-800 border-cyan-300",
    iconName: "FileCheck",
  },
  {
    id: "iso-9001",
    code: "ISO 9001:2015",
    title: "Enterprise Quality Management",
    category: "quality",
    categoryLabel: "Global Quality System",
    issuingBody: "TÜV SÜD / Bureau Veritas",
    certificateId: "ISO-9001-2025-QMS-1102",
    status: "Active",
    validityRange: "2023 - 2026",
    scope: "Quality management across custom hardware procurement, server assembly, client quotation management, and technical support.",
    summary: "Internationally recognized framework for continuous quality improvement, supply chain reliability, and customer satisfaction.",
    details: "Provides structure for operational efficiency, risk-based thinking, vendor qualification, and standardized quality assurance protocols across all business divisions.",
    auditFrequency: "Annual Quality Audit",
    badgeColor: "bg-slate-200 text-slate-800 border-slate-300",
    iconName: "CheckCircle2",
  },
  {
    id: "fcc-rohs",
    code: "FCC Class A/B & RoHS 3",
    title: "Broadcast Signal & Eco Compliance",
    category: "broadcast",
    categoryLabel: "Broadcast & Environment",
    issuingBody: "FCC / Nemko Testing",
    certificateId: "FCC-ROHS-BC-9901",
    status: "Verified",
    validityRange: "Continuous Compliance",
    scope: "Electromagnetic interference compliance for broadcast servers and hazardous substance restrictions in hardware.",
    summary: "Guarantees zero radio interference in studio environments and hazardous material compliance (Directive 2011/65/EU).",
    details: "Certified for commercial broadcast environments to prevent interference with live audio/video spectrum while adhering to global environmental standards for lead, mercury, and cadmium reduction.",
    auditFrequency: "Per Batch Production Testing",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    iconName: "Building2",
  },
];
