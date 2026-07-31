import {
  Radio,
  Tv,
  MonitorPlay,
  Code,
  ShieldCheck,
  Building2,
  Users,
  Wrench,
  Clock,
  CheckCircle2,
  LucideIcon,
} from "lucide-react";

export interface AboutStat {
  value: string;
  label: string;
  subtext: string;
}

export interface AboutPillar {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  icon: LucideIcon;
  image: string;
  features: string[];
  badge: string;
}

export interface WorkflowStep {
  step: string;
  title: string;
  description: string;
  deliverables: string[];
  icon: LucideIcon;
}

export interface ValueItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const ABOUT_STATS: AboutStat[] = [
  {
    value: "15+",
    label: "Years of Engineering Leadership",
    subtext: "Delivering mission-critical hardware and broadcast solutions",
  },
  {
    value: "100+",
    label: "Head-end & DVB Deployments",
    subtext: "DVB-C, DVB-S2, and IPTV systems commissioned",
  },
  {
    value: "24/7",
    label: "Dedicated AMC SLA Support",
    subtext: "Rapid on-site & remote maintenance engineers",
  },
  {
    value: "99.9%",
    label: "Operational Uptime SLA",
    subtext: "Redundant architecture for continuous transmission",
  },
];

export const ABOUT_PILLARS: AboutPillar[] = [
  {
    id: "broadcast-integrator",
    title: "Broadcasting Systems Integration",
    badge: "Full-Service Engineering",
    shortDesc:
      "End-to-end design, hardware selection, installation, and lifecycle maintenance of broadcast infrastructure.",
    fullDesc:
      "As a primary broadcast integrator, we guide clients from initial technical concept through hardware procurement, signal routing, facility installation, and ongoing performance optimization. We ensure seamless interoperability between legacy distribution networks and next-generation digital standards.",
    icon: Radio,
    image: "/about/broadcast-headend.png",
    features: [
      "Turnkey broadcast facility design & rack integration",
      "Studio hardware & master control room (MCR) setup",
      "Signal distribution, routing, and multiplexing",
      "Full lifecycle maintenance & hardware upgrades",
    ],
  },
  {
    id: "headend-systems",
    title: "Digital Video Broadcasting (DVB) & Head-End",
    badge: "DVB-C / DVB-S2 / IPTV",
    shortDesc:
      "High-density head-end systems designed to receive, process, multiplex, and transmit video/audio content.",
    fullDesc:
      "Specialized in head-end architecture, we deploy carrier-grade DVB-C (Cable), DVB-S2 (Satellite), and IPTV processing nodes. Our head-end solutions support multi-channel descrambling, stream encoding/transcoding, PSI/SI generation, and high-reliability transmission to millions of subscriber endpoints.",
    icon: Tv,
    image: "/about/noc-operations.png",
    features: [
      "DVB-C, DVB-S2 satellite receiver & multiplexer arrays",
      "IPTV streaming head-ends with IGMP multicast distribution",
      "Real-time MPEG-4 AVC & HEVC H.265 video transcoding",
      "Conditional Access System (CAS) & DRM integration",
    ],
  },
  {
    id: "ott-services",
    title: "Over-The-Top (OTT) Video Platforms",
    badge: "Cloud & Internet Video",
    shortDesc:
      "Implementation of modern OTT platforms enabling multi-device video streaming over IP networks.",
    fullDesc:
      "We assist broadcasters and content owners in launching robust OTT streaming solutions. From ingest and packaging (HLS / DASH) to CDN integration and custom front-end player applications, our OTT implementations deliver secure, low-latency live TV and video-on-demand (VOD) to smart TVs, mobile apps, and web browsers.",
    icon: MonitorPlay,
    image: "/about/ott-platform.png",
    features: [
      "Live TV channel ingestion & dynamic packaging (HLS/DASH)",
      "Multi-bitrate adaptive streaming & origin shield setup",
      "Cross-platform user applications (Web, iOS, Android, Smart TV)",
      "Subscriber analytics, billing, & subscriber access control",
    ],
  },
  {
    id: "it-software",
    title: "Enterprise IT & Custom Software Solutions",
    badge: "Custom Software & Systems",
    shortDesc:
      "Custom software application development and enterprise IT integration to optimize operational efficiency.",
    fullDesc:
      "Beyond core broadcast hardware, we design custom software applications and integrate enterprise IT infrastructure. We build workflow automation tools, broadcast management systems (BMS), media asset management (MAM) software, and custom middleware that connects legacy hardware with modern cloud APIs.",
    icon: Code,
    image: "/about/engineering-team.png",
    features: [
      "Custom broadcast workflow automation software",
      "Media Asset Management (MAM) & metadata indexing",
      "Enterprise IT network architecture & firewall security",
      "API middleware connecting legacy hardware with cloud CRM/ERP",
    ],
  },
  {
    id: "amc-contracts",
    title: "Annual Maintenance Contracts (AMC)",
    badge: "24/7 SLA Maintenance",
    shortDesc:
      "Comprehensive AMC programs ensuring hardware stability, preventive maintenance, and zero downtime.",
    fullDesc:
      "Operational continuity is vital for broadcast and media infrastructure. Our Annual Maintenance Contracts (AMC) guarantee round-the-clock technical support, scheduled hardware health audits, emergency spare part replacement, and software/firmware updates to keep your systems operating flawlessly.",
    icon: Wrench,
    image: "/about/amc-support.png",
    features: [
      "Guaranteed response time SLAs (Up to 4-hour on-site dispatch)",
      "24/7/365 remote monitoring & diagnostic telemetry",
      "Regular hardware health audits & firmware updates",
      "Spare parts inventory management & hot-swap replacement",
    ],
  },
];

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    step: "01",
    title: "Discovery & Needs Assessment",
    description:
      "Our system engineers evaluate your current broadcasting infrastructure, technical requirements, bandwidth constraints, and growth objectives.",
    deliverables: [
      "Technical audit report",
      "Network & signal flow diagram",
      "Equipment requirement specification",
    ],
    icon: Building2,
  },
  {
    step: "02",
    title: "Custom System Architecture Design",
    description:
      "We design a tailored, high-density solution combining DVB head-ends, IPTV encoders, OTT packagers, or custom software middleware.",
    deliverables: [
      "Rack elevation & wiring schematics",
      "BoM (Bill of Materials) quotation",
      "Interoperability verification matrix",
    ],
    icon: Code,
  },
  {
    step: "03",
    title: "Deployment & System Integration",
    description:
      "Our engineering team handles on-site hardware installation, cable management, firmware configuration, and end-to-end signal testing.",
    deliverables: [
      "Turnkey rack commissioning",
      "Stress testing & failover verification",
      "Operator training & handover",
    ],
    icon: ShieldCheck,
  },
  {
    step: "04",
    title: "Ongoing AMC & SLA Support",
    description:
      "We enroll your system into an Annual Maintenance Contract (AMC), providing 24/7 monitoring, preventive maintenance, and emergency response.",
    deliverables: [
      "24/7 direct engineer hotline",
      "Quarterly hardware inspections",
      "Priority spare parts dispatch",
    ],
    icon: Clock,
  },
];

export const COMPANY_VALUES: ValueItem[] = [
  {
    icon: ShieldCheck,
    title: "Uncompromised Reliability",
    description:
      "Every head-end processor, multiplexer, and server undergo rigorous stress-testing to guarantee continuous transmission.",
  },
  {
    icon: Users,
    title: "Expert Engineering Team",
    description:
      "Our certified broadcast integrators and software engineers bring decades of field experience to complex projects.",
  },
  {
    icon: CheckCircle2,
    title: "Future-Ready Technology",
    description:
      "We bridge traditional RF/DVB distribution with cloud OTT and IP-based SMPTE ST 2110 workflows.",
  },
];
