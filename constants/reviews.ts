export interface CustomerReviewItem {
  id: string;
  quote: string;
  authorName: string;
  authorTitle: string;
  organization: string;
  rating: number;
  deploymentBadge: string;
  category: "medical" | "broadcast";
  avatar: string;
  location: string;
  metric: string;
}

export const CUSTOMER_REVIEWS: CustomerReviewItem[] = [
  {
    id: "review-1",
    quote:
      "Black Swan's DICOM Part 14 pre-calibrated workstation gateways reduced PACS volumetric rendering latency by 45%. Their guaranteed 4-hour hardware replacement SLA gives our radiology department absolute operational confidence.",
    authorName: "Dr. Aris Thorne",
    authorTitle: "Chief Medical Information Officer",
    organization: "Mount Sinai Health System",
    rating: 5,
    deploymentBadge: "Deployed 150+ PACS Workstations",
    category: "medical",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&h=256&q=80",
    location: "New York, USA",
    metric: "45% Faster Rendering",
  },
  {
    id: "review-2",
    quote:
      "Deploying Black Swan's ST-2110 8K uncompressed video processors transformed our master control room. Zero frame drops across 24/7 continuous multi-channel live sports broadcasts.",
    authorName: "Marcus Vance",
    authorTitle: "VP of Broadcast Infrastructure",
    organization: "Sky Broadcast Networks",
    rating: 5,
    deploymentBadge: "Deployed 8K ST-2110 Processing Nodes",
    category: "broadcast",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&h=256&q=80",
    location: "London, UK",
    metric: "100% Zero Frame Drop",
  },
  {
    id: "review-3",
    quote:
      "The pre-configured telehealth hardware nodes arrived ready for instant clinical deployment across 22 regional medical centers. Flawless hardware architecture and white-glove engineering support.",
    authorName: "Dr. Harrison Vance",
    authorTitle: "Director of Diagnostic Imaging",
    organization: "Apex Healthcare Alliance",
    rating: 5,
    deploymentBadge: "22 Regional Medical Centers",
    category: "medical",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80",
    location: "Chicago, USA",
    metric: "22 Hospitals Synchronized",
  },
  {
    id: "review-4",
    quote:
      "In live OB-van production, hardware thermal failure is catastrophic. Black Swan's liquid-cooled FPGA video servers operate under peak summer stadium conditions without thermal throttling.",
    authorName: "David Sterling",
    authorTitle: "Head of Live Production Engineering",
    organization: "Global Sports Network",
    rating: 5,
    deploymentBadge: "4K OB-Van Live Production Rigs",
    category: "broadcast",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80",
    location: "Toronto, Canada",
    metric: "0% Thermal Throttling",
  },
  {
    id: "review-5",
    quote:
      "Integrating Black Swan's ultra-low latency surgical video routing processors into our hybrid operating suites increased endoscopic clarity while eliminating video transport delays.",
    authorName: "Dr. Julian Mercer",
    authorTitle: "Director of Surgical Technology",
    organization: "Johns Hopkins Medical Center",
    rating: 5,
    deploymentBadge: "Hybrid OR Surgical Suites",
    category: "medical",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&h=256&q=80",
    location: "Baltimore, USA",
    metric: "<2ms Video Latency",
  },
  {
    id: "review-6",
    quote:
      "Our broadcast automation required rack-dense 12G-SDI frame synchronizers with dual redundant power. Black Swan engineered a custom 2U server chassis that exceeded all SMPTE benchmarks.",
    authorName: "Klaus Hoffmann",
    authorTitle: "Senior Broadcast Systems Architect",
    organization: "EuroMedia Studios",
    rating: 5,
    deploymentBadge: "SMPTE ST 2022-6 Compliant",
    category: "broadcast",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&h=256&q=80",
    location: "Munich, Germany",
    metric: "99.999% SLA Uptime",
  },
];
