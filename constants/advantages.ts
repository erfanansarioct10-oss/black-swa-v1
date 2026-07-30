import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  Truck,
  LucideIcon,
} from "lucide-react";

export interface AdvantageItem {
  id: string;
  title: string;
  metric: string;
  badge: string;
  desc: string;
  image: string;
  points: string[];
  iconName: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  ShieldCheck,
  Clock,
  CheckCircle2,
  Truck,
};

export function getAdvantageIcon(iconName: string): LucideIcon {
  return ICON_MAP[iconName] || ShieldCheck;
}

export const ENTERPRISE_ADVANTAGES: AdvantageItem[] = [
  {
    id: "adv-1",
    title: "100% Traceable OEM Components",
    metric: "Tier-1 Provenance",
    badge: "Full Batch Tracking",
    desc: "Every silicon component, FPGA chip, and optical interface is sourced directly from certified Tier-1 OEM partners with complete lot traceability.",
    image: "/advantages/traceable-oem.webp",
    points: [
      "Counterfeit-proof silicon supply chain verification",
      "Full batch certification attached to every shipment",
      "Extended 5-year hardware component availability",
    ],
    iconName: "ShieldCheck",
  },
  {
    id: "adv-2",
    title: "4-Hour On-Site SLA Response",
    metric: "Guaranteed Uptime",
    badge: "24/7 Field Dispatch",
    desc: "Mission-critical hardware failures are backed by our global emergency field engineering team with 4-hour on-site hot-swap dispatch.",
    image: "/advantages/sla-response.webp",
    points: [
      "Dedicated 24/7 emergency field engineering dispatch",
      "Pre-staged spare inventory in regional hubs",
      "99.999% guaranteed hardware infrastructure uptime",
    ],
    iconName: "Clock",
  },
  {
    id: "adv-3",
    title: "Factory Pre-Calibrated Standards",
    metric: "Zero Setup Required",
    badge: "Plug & Play Ready",
    desc: "Workstations and encoding nodes arrive fully pre-calibrated to DICOM Part 14 and SMPTE ST 2110 standards for instant deployment.",
    image: "/advantages/pre-calibrated.webp",
    points: [
      "Factory-certified DICOM Part 14 sensor binders",
      "SMPTE ST 2110 uncompressed IP verification",
      "Pre-hardened BIOS & OS security profile pre-loaded",
    ],
    iconName: "CheckCircle2",
  },
  {
    id: "adv-4",
    title: "White-Glove Global Logistics",
    metric: "Climate Controlled",
    badge: "Insured Transit",
    desc: "Sensitive medical imaging controllers and multi-GPU video wall servers are delivered via insured, climate-controlled transport directly to surgical suites.",
    image: "/advantages/global-logistics.webp",
    points: [
      "Shock & temperature monitored transport containers",
      "Direct delivery to operating rooms & control centers",
      "Unpacking, rack installation, and power validation",
    ],
    iconName: "Truck",
  },
];
