import {
  Activity,
  Server,
  Cpu,
  Wrench,
  ShieldCheck,
  Zap,
  LucideIcon,
} from "lucide-react";

export type ServiceCategory = "medical" | "broadcast" | "custom" | "maintenance";

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  category: ServiceCategory;
  categoryLabel: string;
  slaBadge: string;
  desc: string;
  deliverables: string[];
  iconName: string;
  image: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Activity,
  Server,
  Cpu,
  Wrench,
  ShieldCheck,
  Zap,
};

export function getServiceIcon(iconName: string): LucideIcon {
  return ICON_MAP[iconName] || Wrench;
}

export const POPULAR_SERVICES: ServiceItem[] = [
  {
    id: "serv-1",
    slug: "medical-hardware-integration",
    title: "Medical Hardware System Integration",
    category: "medical",
    categoryLabel: "Medical Engineering",
    slaBadge: "HIPAA & DICOM Certified",
    desc: "Turnkey assembly, DICOM Part 14 calibration, and HIPAA security hardening for hospital radiology processing nodes.",
    image: "/services/medical-integration.webp",
    deliverables: [
      "Custom radiology workstation & PACS node assembly",
      "DICOM Part 14 grayscale display sensor calibration",
      "Quad 10GbE SFP+ optical fiber network integration",
    ],
    iconName: "Activity",
  },
  {
    id: "serv-2",
    slug: "broadcast-media-assembly",
    title: "Broadcast Media Server Assembly",
    category: "broadcast",
    categoryLabel: "Broadcast Systems",
    slaBadge: "SMPTE ST 2110 Ready",
    desc: "High-density 2U/4U rackmount server configuration, multi-GPU array tuning, and uncompressed 12G-SDI card installation.",
    image: "/services/broadcast-assembly.webp",
    deliverables: [
      "12G-SDI 8K video encoder cluster rack wiring",
      "Multi-GPU studio video wall processor canvas tuning",
      "Redundant hitless failover IP video transport setup",
    ],
    iconName: "Server",
  },
  {
    id: "serv-3",
    slug: "custom-embedded-computing",
    title: "Custom Embedded Computing Solutions",
    category: "custom",
    categoryLabel: "Hardware R&D",
    slaBadge: "Bespoke Engineering",
    desc: "Tailored micro-architecture firmware configuration and specialized I/O expansion for industrial broadcast & telemetry.",
    image: "/services/custom-computing.webp",
    deliverables: [
      "Tailored micro-architecture firmware optimization",
      "Specialized PCIe Gen5 bus & telemetry expansion",
      "Acoustic & thermal enclosure optimization",
    ],
    iconName: "Cpu",
  },
  {
    id: "serv-4",
    slug: "enterprise-hardware-sla",
    title: "24/7 Enterprise Hardware SLA Support",
    category: "maintenance",
    categoryLabel: "System Maintenance",
    slaBadge: "4-Hour On-Site SLA",
    desc: "Mission-critical hardware diagnostics, rapid hot-swappable component deployment, and 24/7 infrastructure support.",
    image: "/services/enterprise-sla.webp",
    deliverables: [
      "24/7 continuous diagnostic monitoring & alerts",
      "Rapid hot-swappable spare component inventory",
      "Annual regulatory technical audit binders",
    ],
    iconName: "Wrench",
  },
];
