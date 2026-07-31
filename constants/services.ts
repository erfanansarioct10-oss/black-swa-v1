import {
  Activity,
  Server,
  Cpu,
  Wrench,
  ShieldCheck,
  Zap,
  Calendar,
  Newspaper,
  HardDrive,
  Database,
  Sparkles,
  Type,
  LayoutGrid,
  Monitor,
  Users,
  Tv,
  Signal,
  ShoppingBag,
  Truck,
  Globe,
  Lock,
  LucideIcon,
} from "lucide-react";

export type ServiceCategory =
  | "automation"
  | "management"
  | "graphics"
  | "distribution"
  | "telecom";

export interface ServiceFeature {
  title: string;
  desc: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceBlogSection {
  heading: string;
  body: string;
}

export interface ServiceBlogContent {
  readingTime: string;
  publishedDate: string;
  author: string;
  authorTitle: string;
  sections: ServiceBlogSection[];
  architecturalHighlights: string[];
  faq: ServiceFAQ[];
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  category: ServiceCategory;
  categoryLabel: string;
  slaBadge: string;
  desc: string;
  longDescription: string;
  deliverables: string[];
  features: ServiceFeature[];
  blogContent: ServiceBlogContent;
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
  Calendar,
  Newspaper,
  HardDrive,
  Database,
  Sparkles,
  Type,
  LayoutGrid,
  Monitor,
  Users,
  Tv,
  Signal,
  ShoppingBag,
  Truck,
  Globe,
  Lock,
};

export function getServiceIcon(iconName: string): LucideIcon {
  return ICON_MAP[iconName] || Wrench;
}

export const CATEGORY_TABS: { id: "all" | ServiceCategory; label: string }[] = [
  { id: "all", label: "All Services" },
  { id: "automation", label: "Automation & Newsroom" },
  { id: "management", label: "Media Asset Management" },
  { id: "graphics", label: "Graphics & Display" },
  { id: "distribution", label: "Distribution & Telecom" },
  { id: "telecom", label: "Turnkey & Infrastructure" },
];

export const ALL_SERVICES: ServiceItem[] = [
  {
    id: "serv-playout-scheduler",
    slug: "playout-scheduler",
    title: "PLAYOUT SCHEDULER",
    category: "automation",
    categoryLabel: "Playout & Automation",
    slaBadge: "99.999% Uptime Guarantee",
    desc: "Playout Scheduler Automation is an enterprise system that automates the precise scheduling, secondary event triggers, and seamless master control delivery of 24/7 linear TV channels.",
    longDescription:
      "Our Playout Scheduler solution bridges playlist authoring with real-time hardware execution. Engineered for frame-accurate automation, SCTE-35 commercial insertion, graphics keying, and multi-channel redundancy, it provides broadcasting networks with uncompromised operational reliability.",
    image: "/services/playout-scheduler.webp",
    iconName: "Calendar",
    deliverables: [
      "Frame-accurate multi-channel playlist automation & timeline verification",
      "Automated SCTE-35 / SCTE-104 ad-insertion trigger integration",
      "N+N dynamic failover master control server redundancy",
      "Automated as-run log generation and compliance reconciliation",
    ],
    features: [
      {
        title: "Frame-Accurate Scheduling",
        desc: "Deterministic sub-frame media playback timing synchronized to GPS NTP timecodes.",
      },
      {
        title: "Secondary Trigger Engine",
        desc: "Automated trigger execution for CG overlays, bugs, parental ratings, and audio track switching.",
      },
      {
        title: "Live Feed Interruption",
        desc: "Instant seamless switching from scheduled VOD blocks to breaking live SDI/IP streams.",
      },
      {
        title: "As-Run Reconciliation",
        desc: "Automated real-time broadcast compliance logging with broadcast traffic system synchronization.",
      },
    ],
    blogContent: {
      readingTime: "6 min read",
      publishedDate: "2026-07-28",
      author: "Engineered by Black Swan Systems Team",
      authorTitle: "Broadcast Automation Systems Group",
      sections: [
        {
          heading: "Modernizing 24/7 Master Control Automation",
          body: "In high-density broadcast television environments, manual playout intervention introduces operational risk and human error. Black Swan's Playout Scheduler Automation architecture decouples playlist creation from execution, ensuring hardware video servers execute frame-accurate transitions regardless of upstream network latency or file ingest delays.",
        },
        {
          heading: "Redundancy Architecture & Failover Mechanics",
          body: "Each primary playout node is mirrored by a hot-standby secondary system reading synchronously from twin redundant NAS storage pools. In the event of primary decoder packet loss or GPU hardware stalls, master control switches video feeds within 1 frame (33ms at 1080p59.94) without viewer disruption.",
        },
        {
          heading: "Traffic System & Ad Insertion Integration",
          body: "Seamless RESTful API integration with commercial traffic management platforms enables direct BXF/XML playlist synchronization. Standard SCTE-35 digital cue marks are automatically generated to drive OTT programmatic ad insertion downstream.",
        },
      ],
      architecturalHighlights: [
        "SMPTE ST 2110-21 uncompressed IP playout support",
        "BXF 5.0 bi-directional traffic system synchronization",
        "Integrated dual-redundant SCTE-35 cue mark generator",
        "Web-based multi-viewer timeline inspection console",
      ],
      faq: [
        {
          question: "Can the scheduler handle live breaking news preemptions?",
          answer:
            "Yes. The Playout Scheduler features a one-click breaking news override panel that seamlessly holds scheduled events and routes live newsroom SDI/IP feeds directly to air.",
        },
        {
          question: "What video formats are supported natively for direct playout?",
          answer:
            "Native playout support includes XAVC-Intra, Apple ProRes 422, AVC-Intra 100, DNxHD, MPEG-2 Transport Stream, and H.264/HEVC containers without transcoding.",
        },
      ],
    },
  },
  {
    id: "serv-nrcs",
    slug: "nrcs",
    title: "NRCS (NEWSROOM COMPUTER SYSTEM)",
    category: "automation",
    categoryLabel: "Newsroom Technology",
    slaBadge: "MOS Protocol Certified",
    desc: "NRCS (Newsroom Computer System) empowers journalists, producers, and editors to collaboratively create stories, build rundowns, and drive live studio playout devices.",
    longDescription:
      "Black Swan's NRCS platform consolidates story drafting, wire agency feeds (AP, Reuters, AFP), media previewing, and MOS-driven studio device automation into a unified web interface for modern newsrooms.",
    image: "/services/nrcs.webp",
    iconName: "Newspaper",
    deliverables: [
      "MOS protocol v4.0 integration with CG, prompter, and video servers",
      "Real-time collaborative story authoring and rundown management",
      "Unified wire service ingestion (AP, Reuters, RSS) with keyword tagging",
      "Integrated web-proxy video playback for journalist rough-cut edits",
    ],
    features: [
      {
        title: "Collaborative Rundowns",
        desc: "Multi-user real-time rundown editing with active locking and duration math.",
      },
      {
        title: "MOS Active Control",
        desc: "Direct drag-and-drop graphic and clip object association into teleprompter feeds.",
      },
      {
        title: "Multi-Platform Publishing",
        desc: "Single-click story distribution to TV broadcast, website CMS, and mobile applications.",
      },
      {
        title: "Wire Agency Harvester",
        desc: "Automated ingestion and AI topic clustering for incoming agency news feeds.",
      },
    ],
    blogContent: {
      readingTime: "7 min read",
      publishedDate: "2026-07-25",
      author: "Engineered by Black Swan News Systems",
      authorTitle: "Journalism Workflow Architecture",
      sections: [
        {
          heading: "Transforming Live News Production Speed",
          body: "In competitive news broadcasting, seconds matter. Our NRCS provides journalists with instant access to media asset archives and live wire feeds inside a zero-latency web interface, allowing breaking news packages to go from wire to air in minutes.",
        },
        {
          heading: "MOS Protocol Interoperability Standard",
          body: "By adhering strictly to MOS (Media Object Server) Protocol standards, our NRCS communicates directly with Character Generators, Teleprompters, Playout Servers, and MAM proxies. When a producer re-orders stories in the rundown, prompters and graphic CG sequences instantly re-sequence.",
        },
        {
          heading: "Omnichannel Digital Publishing",
          body: "Stories written in the NRCS are automatically reformatted for digital web publishing and social media alerts, eliminating duplicate data entry across television and online news desks.",
        },
      ],
      architecturalHighlights: [
        "Full MOS 4.0 object agreement compliance",
        "Integrated WebRTC prompter scroll preview",
        "Role-based multi-tier editorial approval workflow",
        "Elasticsearch instant story archive retrieval",
      ],
      faq: [
        {
          question: "Does the system support remote field reporters?",
          answer:
            "Yes. Field reporters can access story templates, submit scripts, and preview lower-third CG graphics from any smartphone or tablet via secure HTTPS login.",
        },
        {
          question: "Can it integrate with existing teleprompters?",
          answer:
            "Yes. We support standard MOS-compliant teleprompters (Autocue, CueScript, Telescript, Autoscript) out of the box.",
        },
      ],
    },
  },
  {
    id: "serv-ingest-system",
    slug: "ingest-system",
    title: "INGEST SYSTEM",
    category: "management",
    categoryLabel: "Content Ingestion",
    slaBadge: "High-Throughput Processing",
    desc: "Ingest System handles automated multi-channel capture, file-based transcode ingestion, camera card ingest, and high-speed network content transfer from satellite and field crews.",
    longDescription:
      "Engineered for high-volume broadcast operations, Black Swan's Ingest System captures incoming live SDI/NDI/ST 2110 feeds and transcodes incoming file media into production edit formats while simultaneously creating web proxies for instant MAM indexing.",
    image: "/services/ingest-system.webp",
    iconName: "HardDrive",
    deliverables: [
      "Multi-channel 12G-SDI / NDI / ST 2110 scheduled & gang recording",
      "Automated camera card (XDCAM, P2, ProRes) watch folder ingestion",
      "Hardware-accelerated parallel mezzanine and proxy transcode engine",
      "Automated QC checks (interlace, aspect ratio, audio dropouts)",
    ],
    features: [
      {
        title: "Multi-Channel Live Ingest",
        desc: "Simultaneous gang-recording of up to 16 HD/4K SDI & IP streams per node.",
      },
      {
        title: "Growing File Edit",
        desc: "Allows NLE editors to edit live incoming feeds while recording is in progress.",
      },
      {
        title: "Automated QC Validation",
        desc: "Real-time black frame, freeze frame, audio clipping, and loudness checks.",
      },
      {
        title: "Smart Metadata Tagging",
        desc: "Automatic metadata extraction from incoming camera EXIF and sidecar XML.",
      },
    ],
    blogContent: {
      readingTime: "5 min read",
      publishedDate: "2026-07-20",
      author: "Engineered by Black Swan Storage & Media Team",
      authorTitle: "Broadcast Ingest Systems Specialist",
      sections: [
        {
          heading: "Eliminating Ingest Bottlenecks in Production Workflows",
          body: "Media ingestion is the entryway for all raw content into a broadcast facility. Bottlenecks at ingest delay post-production and live editing. Black Swan's Ingest System utilizes parallel GPU hardware pipelines to ingest, verify QC compliance, generate H.264/HEVC web proxies, and notify editors instantly.",
        },
        {
          heading: "Growing File Technology for Live Sports & Events",
          body: "For live sporting events and long-form studio recordings, editors cannot wait for events to conclude. Our growing file technology streams MXF OP1a files directly to shared SAN/NAS storage, enabling Adobe Premiere Pro and DaVinci Resolve editors to start cutting highlights while live capture continues.",
        },
        {
          heading: "Integrated Automated Quality Control (Auto-QC)",
          body: "Before media reaches edit suites, integrated file inspection verifies audio channel mapping, detects corrupted GOP structures, checks EBU R128 audio loudness, and flags out-of-gamut video signals.",
        },
      ],
      architecturalHighlights: [
        "Simultaneous MXF OP1a & H.264 proxy creation",
        "Adobe Premiere & Avid Interplay growing file support",
        "GPU-accelerated NVENC / QuickSync transcode pipeline",
        "Automated MD5 / SHA-256 checksum file integrity validation",
      ],
      faq: [
        {
          question: "Does the system support NDI and ST 2110 IP video streams?",
          answer:
            "Yes. The Ingest System natively records NDI 5 high-bandwidth streams and SMPTE ST 2110 uncompressed network video.",
        },
        {
          question: "What happens if a network connection drops during ingest?",
          answer:
            "Local NVMe buffer caching protects incoming streams against network latency bursts, automatically flushing content to central storage once reconnected.",
        },
      ],
    },
  },
  {
    id: "serv-mam",
    slug: "mam",
    title: "MAM (MEDIA ASSET MANAGEMENT)",
    category: "management",
    categoryLabel: "Asset Management",
    slaBadge: "Enterprise Archive Integration",
    desc: "MAM (Media Asset Management) enables broadcast organizations to index, organize, enrich with AI metadata, search, and instantly retrieve petabytes of media content.",
    longDescription:
      "Black Swan's Enterprise MAM platform serves as the single source of truth for media production assets. Featuring deep LTO tape library orchestration, cloud tiering, micro-proxy streaming, and AI facial & speech recognition tagging.",
    image: "/services/mam.webp",
    iconName: "Database",
    deliverables: [
      "Scalable metadata database cataloging high-res, proxy, and archive assets",
      "AI Speech-to-Text, face detection, and OCR video index automation",
      "LTO-8/9 tape library & S3 cold storage tiering lifecycle management",
      "Fine-grained RBAC permission matrix for production teams & external partners",
    ],
    features: [
      {
        title: "AI Cognitive Search",
        desc: "Sub-second search across spoken dialogue, visual faces, and visual OCR text.",
      },
      {
        title: "Multi-Tier Storage Orchestration",
        desc: "Automated media movement between NVMe SAN, Nearline NAS, LTO Tape, and Cloud.",
      },
      {
        title: "NLE Extension Panel",
        desc: "Native panel for Adobe Premiere and Avid to browse and drag proxy clips into timelines.",
      },
      {
        title: "Rights & Usage Management",
        desc: "Built-in license tracking to prevent unauthorized usage of expired licensed content.",
      },
    ],
    blogContent: {
      readingTime: "8 min read",
      publishedDate: "2026-07-18",
      author: "Engineered by Black Swan Data & Media Engineering",
      authorTitle: "Media Asset Management Systems Architect",
      sections: [
        {
          heading: "Solving the Challenge of Unstructured Media Archives",
          body: "Broadcast facilities accumulate hundreds of terabytes of media every month. Without an intelligent MAM system, assets become lost in unorganized folder hierarchies. Black Swan's MAM automatically catalogs incoming media, extracts embedded EXIF/MXF headers, and runs AI indexing scripts.",
        },
        {
          heading: "AI-Powered Multimodal Video Indexing",
          body: "By running automated speech-to-text transcription, facial recognition models, and optical character recognition (OCR) on lower-third graphics, journalists can type 'Prime Minister Speech 2025' and pinpoint exact video timecodes in seconds.",
        },
        {
          heading: "Storage Cost Optimization & Lifecycle Tiering",
          body: "Active productions require fast NVMe access, while completed projects belong on lower-cost LTO tape libraries or AWS Glacier storage. Our automated lifecycle policies migrate idle high-res files to tape while retaining light H.265 proxies online indefinitely.",
        },
      ],
      architecturalHighlights: [
        "PostgreSQL + Vector search index architecture",
        "LTO-7/8/9 LTFS tape robotics driver support",
        "S3 / Azure Blob multi-cloud storage connector",
        "SAML / OAuth2 single sign-on security integration",
      ],
      faq: [
        {
          question: "Can editors work off proxy files when out of the office?",
          answer:
            "Yes. Remote editors can stream micro-proxies via the MAM web panel, edit timelines locally, and trigger server-side high-res relinking upon final export.",
        },
        {
          question: "Is the MAM searchable by external third-party systems?",
          answer:
            "Yes. A rich REST and GraphQL API allows external NRCS, web CMS, and archive solutions to query media items programmatically.",
        },
      ],
    },
  },
  {
    id: "serv-realtime-3d-cg",
    slug: "realtime-3d-cg",
    title: "REAL-TIME 3D CG",
    category: "graphics",
    categoryLabel: "3D Broadcast Graphics",
    slaBadge: "Unreal Engine 5 Powered",
    desc: "Real-Time 3D CG delivers photorealistic 3D virtual sets, augmented reality (AR) telemetry graphics, and real-time raytraced broadcast visual effects during live television productions.",
    longDescription:
      "Driven by custom multi-GPU hardware servers and Unreal Engine broadcast toolkits, Black Swan's Real-Time 3D CG platform enables sports networks and news broadcasters to render dynamic 3D elements that track seamlessly with studio cameras.",
    image: "/services/realtime-3d-cg.webp",
    iconName: "Sparkles",
    deliverables: [
      "Dual GPU server nodes with low-latency key & fill 12G-SDI video outputs",
      "Camera tracking data integration (FreeD, Mo-Sys, Stype, NCam protocols)",
      "Unreal Engine 5 photorealistic render pipeline for virtual studios",
      "Live data-driven graphic control panel for graphics operators",
    ],
    features: [
      {
        title: "Photorealistic AR Graphics",
        desc: "Real-time Unreal Engine 5 raytraced graphics with dynamic shadows and reflections.",
      },
      {
        title: "Multi-Protocol Camera Tracking",
        desc: "Sub-millimeter lens & spatial tracking integration for optical and mechanical trackers.",
      },
      {
        title: "Live Data Feed Binding",
        desc: "Instant graphic updating bound to live sports data feeds, election feeds, and weather API.",
      },
      {
        title: "Key/Fill SDI Output",
        desc: "Synchronized dual-link 12G-SDI hardware video output with genlock frame locking.",
      },
    ],
    blogContent: {
      readingTime: "6 min read",
      publishedDate: "2026-07-15",
      author: "Engineered by Black Swan Graphics Systems",
      authorTitle: "Real-Time 3D Rendering Lead",
      sections: [
        {
          heading: "The Evolution of Virtual Production in Live Television",
          body: "Virtual set technology has advanced beyond static green screen keying. Today's live television broadcasts incorporate augmented reality graphics—such as 3D player stats floating above a stadium pitch—that respond dynamically to studio lighting and camera movement.",
        },
        {
          heading: "Sub-Frame Camera Tracking Synchronization",
          body: "To prevent virtual graphics from floating or sliding relative to physical props, camera position and optical zoom tracking data (FreeD protocol) must sync with rendering hardware. Black Swan's dual-redundant CG nodes maintain zero-latency sync with tracking sensors.",
        },
        {
          heading: "Data-Bound Graphics Controls",
          body: "Graphics operators do not need 3D modeling expertise. Custom HTML5 control interfaces allow operators to trigger complex 3D graphic animations with single keystrokes while data inputs auto-populate.",
        },
      ],
      architecturalHighlights: [
        "Unreal Engine 5.4 broadcast plugin stack",
        "AJA / Blackmagic Design 12G-SDI hardware video I/O",
        "FreeD / Stype / Mo-Sys tracking protocol parser",
        "Genlock Tri-Level sync input locking",
      ],
      faq: [
        {
          question: "Can this system drive large LED video walls in physical studios?",
          answer:
            "Yes. The system supports both green screen keying and LED wall camera tracking (nDisplay virtual production technology).",
        },
        {
          question: "What tracking systems are supported out of the box?",
          answer:
            "We natively support Mo-Sys, Stype, NCam, Trackmen, Vinten, and standard FreeD protocol encoders.",
        },
      ],
    },
  },
  {
    id: "serv-character-generator",
    slug: "character-generator",
    title: "CHARACTER GENERATOR (CG)",
    category: "graphics",
    categoryLabel: "Channel Titling & Overlay",
    slaBadge: "Multi-Layer Keyer Engine",
    desc: "Character Generator (CG) delivers frame-accurate broadcast channel titling, lower-thirds, tickers, scoreboards, and emergency alert system (EAS) graphics.",
    longDescription:
      "Black Swan's Character Generator platform combines an intuitive template designer with an ultra-reliable playout server. Built for rapid news operations, sports broadcasts, and live events.",
    image: "/services/character-generator.webp",
    iconName: "Type",
    deliverables: [
      "Multi-channel SDI/NDI broadcast lower-third & ticker graphics overlay server",
      "Dynamic XML/JSON data binder for news tickers, weather, and stock market feeds",
      "Standalone template editor with Unicode multi-language font support",
      "EAS emergency alert automated override graphic keyer",
    ],
    features: [
      {
        title: "Multi-Layer Compositing",
        desc: "Render up to 64 independent graphic layers (tickers, bugs, lower thirds, banners).",
      },
      {
        title: "Real-Time Data Feeds",
        desc: "Automated polling of RSS, JSON, XML, and Excel spreadsheets for sports & financial tickers.",
      },
      {
        title: "Multi-Language Support",
        desc: "Full UTF-8 Unicode support for English, Nepali, Hindi, Arabic, and CJK typography.",
      },
      {
        title: "Hot-Key Execution",
        desc: "Custom physical keyboard map for rapid live sports scorekeeping and graphic triggers.",
      },
    ],
    blogContent: {
      readingTime: "5 min read",
      publishedDate: "2026-07-12",
      author: "Engineered by Black Swan Graphics Team",
      authorTitle: "Broadcast Titling Specialist",
      sections: [
        {
          heading: "High-Impact Visual Overlay for Live Broadcasts",
          body: "Lower-third graphics and continuous news tickers keep television viewers informed. Black Swan's Character Generator system features GPU-accelerated 2D/3D compositing, ensuring smooth anti-aliased font rendering and fluid scrolling ticker animations at 60fps.",
        },
        {
          heading: "Automated Data Feeds & Scoreboard Integration",
          body: "Manual data input during live sports or elections is prone to mistakes. Our CG platform binds graphic template fields directly to live scoreboard controllers (Daktronics, Bodet) and automated news room API feeds.",
        },
        {
          heading: "EAS & Regulatory Overlay Compliance",
          body: "Built-in Emergency Alert System (EAS) interfaces guarantee that regulatory emergency warning tickers take top priority over active graphic templates, automatically muting background audio and displaying text overlays.",
        },
      ],
      architecturalHighlights: [
        "60fps smooth anti-aliased text rendering engine",
        "Direct Daktronics & Sportzcast scoreboard serial protocols",
        "HTML5 / Web-based template authoring suite",
        "Key & Fill SDI output pair",
      ],
      faq: [
        {
          question: "Can non-technical newsroom staff trigger graphics?",
          answer:
            "Yes. Station journalists can select templates inside the NRCS plugin, type text content, and push graphics directly into the master control queue.",
        },
        {
          question: "Does the ticker support continuous smooth scrolling without stuttering?",
          answer:
            "Yes. The rendering engine locks scroll speeds directly to broadcast frame rate clocks (50Hz / 59.94Hz).",
        },
      ],
    },
  },
  {
    id: "serv-multiviewer",
    slug: "multiviewer",
    title: "MULTIVIEWER",
    category: "graphics",
    categoryLabel: "Studio Monitoring",
    slaBadge: "Zero-Latency Processing",
    desc: "Multiviewer is an enterprise hardware system that displays multiple SDI, NDI, and IP video sources on large master control room display monitors with embedded audio meters and tally indicators.",
    longDescription:
      "Designed for control rooms and production trucks, Black Swan's Multiviewer system aggregates up to 64 uncompressed HD/4K video inputs into customizable layout grids on 4K display monitors with sub-frame processing latency.",
    image: "/services/multiviewer.webp",
    iconName: "LayoutGrid",
    deliverables: [
      "Ultra-low latency multi-channel 12G-SDI / ST 2110 / NDI video aggregation",
      "Dynamic TSL 5.0 tally indicators and UMD text displays",
      "On-screen VU audio level meters with peak hold & clip alert indicators",
      "Interactive layout designer software for customizable monitor wall presets",
    ],
    features: [
      {
        title: "Sub-Frame Latency",
        desc: "Hardware FPGA video pipeline delivers under 1 frame of total display latency.",
      },
      {
        title: "TSL 5.0 Tally & UMD",
        desc: "Dynamic red/green tally border highlights driven by vision mixer switchers.",
      },
      {
        title: "Alarms & Error Detection",
        desc: "On-screen visual alerts for video black, video freeze, and audio silence loss.",
      },
      {
        title: "Multi-Format Hybrid Input",
        desc: "Simultaneous monitoring of 12G-SDI, HDMI, NDI, and SMPTE ST 2110 IP streams.",
      },
    ],
    blogContent: {
      readingTime: "6 min read",
      publishedDate: "2026-07-09",
      author: "Engineered by Black Swan Studio Engineering",
      authorTitle: "Control Room Monitoring Specialist",
      sections: [
        {
          heading: "Critical Video Monitoring for Control Rooms",
          body: "Master control operators must observe dozens of video feeds simultaneously. Black Swan's Multiviewer system provides crystal-clear 4K resolution scaling across display screens, displaying critical audio meters, clocks, and source names.",
        },
        {
          heading: "TSL Tally Protocol & Vision Switcher Integration",
          body: "Active studio cameras and playout sources must signal their live status to directors. Our Multiviewer listens for TSL 3.1/5.0 serial and IP network tally packets, illuminating green preview and red program borders around tile displays.",
        },
        {
          heading: "Real-Time Signal Loss & Silence Alarms",
          body: "Operator fatigue can lead to unnoticed video freezes or audio loss. Integrated real-time signal analysis triggers visual border flashing and SNMP network alerts immediately when a channel degrades.",
        },
      ],
      architecturalHighlights: [
        "FPGA-accelerated scaling engine",
        "HDMI 2.0 / DisplayPort 4K 60Hz quad monitor outputs",
        "TSL 3.1 & TSL 5.0 protocol network receiver",
        "EBU R128 audio meter visualizer overlay",
      ],
      faq: [
        {
          question: "How many video inputs can a single 2U chassis handle?",
          answer:
            "A single 2U chassis handles up to 32 3G-SDI or 16 12G-SDI inputs, scalable across interconnected units.",
        },
        {
          question: "Can layouts be switched dynamically during a live show?",
          answer:
            "Yes. Preset layouts can be recalled instantly via web browser, hardware button panels, or vision mixer macro commands.",
        },
      ],
    },
  },
  {
    id: "serv-videowall-processor",
    slug: "videowall-processor",
    title: "VIDEOWALL PROCESSOR",
    category: "graphics",
    categoryLabel: "Display Canvas Processing",
    slaBadge: "Pixel-Perfect Resolution",
    desc: "VideoWall Processor is a hardware system that drives ultra-large LED display canvases and LCD matrix video walls in broadcast news studios and command centers.",
    longDescription:
      "Black Swan's VideoWall Processor handles pixel-accurate video scaling, bezel compensation, frame synchronization, and flexible windowing across complex studio display backdrops.",
    image: "/services/videowall-processor.webp",
    iconName: "Monitor",
    deliverables: [
      "Multi-screen 8K studio LED canvas and LCD video wall controller hardware",
      "Bezel compensation and sub-pixel edge-blending calibration",
      "Multi-window video pip placement (picture-in-picture) across screen boundaries",
      "Genlock frame synchronization preventing visual tearing across display panels",
    ],
    features: [
      {
        title: "Pixel-Accurate Canvas",
        desc: "Drives custom non-standard LED resolution canvases up to 16K width.",
      },
      {
        title: "Tear-Free Genlock",
        desc: "Frame-locked video outputs sync with studio camera shutter phase.",
      },
      {
        title: "Free-Form Windowing",
        desc: "Position, scale, crop, and overlap live SDI/IP sources anywhere on screen.",
      },
      {
        title: "Redundant Power & Control",
        desc: "Hot-swappable dual power supplies and dual controller card failover.",
      },
    ],
    blogContent: {
      readingTime: "5 min read",
      publishedDate: "2026-07-06",
      author: "Engineered by Black Swan Display Technology",
      authorTitle: "Video Wall & Canvas Architect",
      sections: [
        {
          heading: "Powering Modern Studio Backdrops",
          body: "Broadcast news studios rely heavily on dynamic video wall backdrops behind presenters. Black Swan's VideoWall Processor ensures video content remains sharp, color-calibrated, and free of visual scanline flicker when captured on broadcast cameras.",
        },
        {
          heading: "Genlock & Shutter Phase Synchronization",
          body: "When studio cameras record un-synced LED displays, horizontal scan lines appear. Our processor locks output refresh cycles directly to house Tri-Level Genlock, eliminating visual moiré artifacts and phase sync issues.",
        },
        {
          heading: "Dynamic Scene Presets & Layout Control",
          body: "Directors can recall scene configurations—such as shifting from full-screen graphics to a 3-way split featuring live field reporters—with zero display blackouts.",
        },
      ],
      architecturalHighlights: [
        "Pure hardware FPGA crossbar architecture",
        "Genlock sync input with phase offset adjustment",
        "HDCP 2.2 & 4K60 4:4:4 color processing pipeline",
        "Redundant hot-swap power supply modules",
      ],
      faq: [
        {
          question: "Does it support custom LED cabinet resolutions?",
          answer:
            "Yes. Custom canvas EDID configurations allow drive signals to match exact LED tile cabinet layouts without scaling distortions.",
        },
        {
          question: "Can live SDI cameras be displayed directly on the video wall?",
          answer:
            "Yes. Low-latency 12G-SDI input cards allow live camera feeds to be windowed directly on the studio backdrop.",
        },
      ],
    },
  },
  {
    id: "serv-sms",
    slug: "sms",
    title: "SMS (SUBSCRIBER MANAGEMENT SYSTEM)",
    category: "distribution",
    categoryLabel: "Pay-TV Billing & Subscriber Ops",
    slaBadge: "High-Volume Subscriber Engine",
    desc: "SMS (Subscriber Management System) manages customer accounts, subscription packages, automated billing, payment gateways, and subscriber entitlements for Cable TV, DTH, and OTT operators.",
    longDescription:
      "Black Swan's Subscriber Management System integrates seamlessly with Conditional Access Systems (CAS) and Middleware to handle subscriber lifecycle events, automated billing invoices, self-care portals, and channel package provisioning.",
    image: "/services/sms.webp",
    iconName: "Users",
    deliverables: [
      "Complete subscriber lifecycle management (registration, activation, suspension)",
      "Automated recurring billing, invoicing, and local payment gateway integration",
      "Real-time CAS / DRM subscriber entitlement provisioning API",
      "Self-care mobile app and web portal for subscriber package management",
    ],
    features: [
      {
        title: "Automated Provisioning",
        desc: "Instant channel activation and smartcard entitlement updates upon payment.",
      },
      {
        title: "Flexible Tiering & Bundling",
        desc: "A-la-carte channel selection, BOUQUET packages, and promotional pricing.",
      },
      {
        title: "Multi-Gateway Payments",
        desc: "Integrated online banking, credit cards, digital wallets, and agent billing.",
      },
      {
        title: "Regulatory Tax Compliance",
        desc: "Built-in VAT, fiscalizing invoicing, and local telecommunication tax reporting.",
      },
    ],
    blogContent: {
      readingTime: "7 min read",
      publishedDate: "2026-07-04",
      author: "Engineered by Black Swan Telecom & Pay-TV Group",
      authorTitle: "Subscriber Operations Lead",
      sections: [
        {
          heading: "Streamlining Operations for Digital TV Operators",
          body: "Managing hundreds of thousands of pay-TV subscribers demands high transaction throughput and reliable billing accuracy. Black Swan's SMS platform automates subscriber onboarding, recurring payments, and instant entitlement updates to set-top boxes.",
        },
        {
          heading: "CAS & Middleware Synchronization",
          body: "When a subscriber purchases a new channel bouquet or settles an overdue bill, the SMS fires instant API commands to the Conditional Access System (CAS) or DRM server to enable viewing keys within seconds.",
        },
        {
          heading: "Subscriber Self-Care & Agent Portals",
          body: "Empower end-users to manage their subscriptions, check balances, and renew channels via iOS/Android apps or local retail agent POS portals, drastically reducing call center workload.",
        },
      ],
      architecturalHighlights: [
        "High-performance PostgreSQL transaction DB core",
        "RESTful & SOAP API connectors for CAS/DRM",
        "PCI-DSS compliant payment processing integration",
        "Automated SMS/Email notification trigger engine",
      ],
      faq: [
        {
          question: "Can the SMS integrate with our existing CAS server?",
          answer:
            "Yes. We support pre-integrated adapters for major CAS vendors (Conax, Verimatrix, Gospell, Sumavision, Nagra).",
        },
        {
          question: "Does it support local fiscal billing compliance?",
          answer:
            "Yes. Invoicing models support local tax fiscalization and regional invoice formats out of the box.",
        },
      ],
    },
  },
  {
    id: "serv-iptv",
    slug: "iptv",
    title: "IP TV",
    category: "distribution",
    categoryLabel: "IP Television Systems",
    slaBadge: "Low-Latency HLS/DASH",
    desc: "IPTV (Internet Protocol Television) delivers live TV channels, video-on-demand (VOD), interactive electronic program guides (EPG), and catch-up TV over managed IP networks.",
    longDescription:
      "Black Swan's Turnkey IPTV Solution includes high-density headend encoders, middleware servers, edge CDNs, and custom Android TV / Apple TV / Smart TV user applications engineered for telecom operators and hospitality networks.",
    image: "/services/iptv.webp",
    iconName: "Tv",
    deliverables: [
      "Complete IPTV headend encoding, packaging (HLS, MPEG-DASH), and DRM licensing",
      "Custom subscriber IPTV apps for Android TV, Apple TV, Web, LG webOS, and Samsung Tizen",
      "Interactive 7-day EPG, Cloud NVR time-shift recording, and catch-up TV middleware",
      "Edge CDN caching node architecture for local network bandwidth reduction",
    ],
    features: [
      {
        title: "Ultra-Low Latency Streaming",
        desc: "Delivers live streams under 3 seconds end-to-end latency over IP.",
      },
      {
        title: "Multi-Screen Applications",
        desc: "Custom branded UI for Smart TVs, set-top boxes, mobile, and web browsers.",
      },
      {
        title: "Catch-Up & Cloud NVR",
        desc: "Allows subscribers to pause live TV, rewind, and record shows to cloud storage.",
      },
      {
        title: "Multi-DRM Protection",
        desc: "Integrated Google Widevine, Apple FairPlay, and Microsoft PlayReady.",
      },
    ],
    blogContent: {
      readingTime: "8 min read",
      publishedDate: "2026-07-01",
      author: "Engineered by Black Swan Streaming Engineering",
      authorTitle: "IPTV & OTT Architecture Lead",
      sections: [
        {
          heading: "Next-Generation Broadcast over IP Networks",
          body: "Telecom providers and cable operators are transitioning from legacy RF distribution to IP networks. Black Swan's IPTV ecosystem delivers crystal-clear 4K HDR live streams and VOD content across managed fiber and broadband connections.",
        },
        {
          heading: "Middleware & Interactive User Experience",
          body: "A great TV service depends on user experience. Our IPTV middleware provides rapid channel switching (under 1 second), rich visual EPG metadata, personalized recommendations, and seamless catch-up TV functionality.",
        },
        {
          heading: "Multi-DRM & Content Security",
          body: "Protect premium sports and movie content with integrated hardware-backed DRM protection, satisfying stringent studio licensing demands.",
        },
      ],
      architecturalHighlights: [
        "H.264 / H.265 / AV1 hardware packaging",
        "LL-CMAF (Low Latency CMAF) live streaming pipeline",
        "Multi-tenant hotel & hospitality guest mode support",
        "Widevine, FairPlay, & PlayReady DRM cluster",
      ],
      faq: [
        {
          question: "Can this system be deployed for hospitality / hotel environments?",
          answer:
            "Yes. We offer specialized hospitality IPTV middleware featuring guest welcome screens, PMS billing integration (Opera/Oracle), and room service ordering.",
        },
        {
          question: "How fast is channel switching on set-top boxes?",
          answer:
            "Our optimized player engine achieves channel zapping speeds under 800 milliseconds.",
        },
      ],
    },
  },
  {
    id: "serv-tv-distribution",
    slug: "tv-distribution",
    title: "TV DISTRIBUTION",
    category: "distribution",
    categoryLabel: "Signal RF & Fiber Transport",
    slaBadge: "Carrier-Grade Reliability",
    desc: "TV Distribution encompasses the multiplexing, RF modulation (DVB-C, DVB-T2, ISDB-T), fiber-optic transport, and satellite uplink transmission of television signals across regional networks.",
    longDescription:
      "Black Swan's TV Distribution engineering builds high-density QAM/COFDM modulators, optical transmitter nodes, and IP transport gateways, ensuring broadcast signals reach viewers with maximum Signal-to-Noise Ratio (SNR) and zero packet loss.",
    image: "/services/tv-distribution.webp",
    iconName: "Signal",
    deliverables: [
      "DVB-C / DVB-T2 / ISDB-T digital headend multiplexing and RF modulation systems",
      "Long-haul dense wavelength division multiplexing (DWDM) optical fiber transport links",
      "Reliable IP transport (SRT, Zixi, RIST) setup over unmanaged internet infrastructure",
      "RF spectrum analysis, signal balancing, and carrier-to-noise optimization",
    ],
    features: [
      {
        title: "High-Density RF Modulation",
        desc: "Up to 64 QAM / COFDM carrier frequencies modulated per 1U hardware frame.",
      },
      {
        title: "SRT & RIST IP Transport",
        desc: "Error-corrected low-latency video transport across public internet links.",
      },
      {
        title: "Optical Fiber Nodes",
        desc: "High-power 1550nm optical transmitters and erbium-doped fiber amplifiers (EDFA).",
      },
      {
        title: "Automated Redundancy",
        desc: "1+1 optical and RF automatic protection switches (APS) for zero downtime.",
      },
    ],
    blogContent: {
      readingTime: "6 min read",
      publishedDate: "2026-06-28",
      author: "Engineered by Black Swan RF & Optical Team",
      authorTitle: "RF & Network Transmission Engineer",
      sections: [
        {
          heading: "Ensuring Broadcast Signal Integrity Across Terrestrial & Cable Networks",
          body: "Whether delivering signals across city-wide coaxial cable networks or connecting transmission towers via optical fiber, television distribution demands strict signal calibration. Black Swan provides complete carrier-grade RF headends and optical transport systems.",
        },
        {
          heading: "SRT & RIST Protocols for Internet Video Backhaul",
          body: "Satellite backhaul can be expensive for regional stations. Modern Secure Reliable Transport (SRT) and RIST protocols allow broadcast feeds to traverse public internet connections with packet loss recovery up to 30%, serving as reliable primary or backup transmission links.",
        },
        {
          heading: "DVB-T2 / DVB-C Digital Multiplexing",
          body: "Our hardware statistical multiplexers optimize bandwidth allocation across channel bundles, dynamically reassigning bitrates to fast-action sports while maintaining crisp video quality across all multiplexed channels.",
        },
      ],
      architecturalHighlights: [
        "DVB-T2 Single PLP & Multi PLP support",
        "SRT / RIST / Zixi protocol error correction",
        "1550nm EDFA optical amplifier integration",
        "SNMP v2c/v3 remote telemetry monitoring",
      ],
      faq: [
        {
          question: "Can we use SRT over public internet instead of leased fiber?",
          answer:
            "Yes. SRT protocol provides encryption and ARQ packet recovery, delivering broadcast-grade reliability over internet connections.",
        },
        {
          question: "How many digital channels can be multiplexed into one DVB-C QAM carrier?",
          answer:
            "Using H.264/HEVC compression, a single 256-QAM carrier (38Mbps capacity) can carry 8 to 12 HD channels.",
        },
      ],
    },
  },
  {
    id: "serv-equipment-sales",
    slug: "equipment-sales",
    title: "EQUIPMENT SALES",
    category: "telecom",
    categoryLabel: "Hardware Procurement",
    slaBadge: "Authorized Tier-1 Distributor",
    desc: "Equipment Sales provides direct access, procurement, warranty fulfillment, and authorized sales of broadcast cameras, video servers, encoders, switchers, and studio gear.",
    longDescription:
      "Black Swan International is an authorized supply partner for world-leading medical hardware and broadcast equipment manufacturers. We handle official channel imports, customs clearance, warranty backed support, and spare parts availability.",
    image: "/services/equipment-sales.webp",
    iconName: "ShoppingBag",
    deliverables: [
      "Authorized procurement of Tier-1 broadcast hardware, cameras, and encoders",
      "Complete system quotation, bill of materials (BOM) design, and compliance verification",
      "In-country customs clearance, duty handling, and direct logistics delivery",
      "Official manufacturer warranty coverage, local spare parts stock, and RMA support",
    ],
    features: [
      {
        title: "Tier-1 Provenance",
        desc: "Direct factory-certified hardware sourcing with original manufacturer warranties.",
      },
      {
        title: "Custom BOM Design",
        desc: "Expert engineering consultation to build complete equipment bills of materials.",
      },
      {
        title: "Local Spare Inventory",
        desc: "In-region buffer stock for critical power supplies, cards, and optical transceivers.",
      },
      {
        title: "Turnkey Staging & Testing",
        desc: "Pre-delivery factory acceptance testing (FAT) before client site dispatch.",
      },
    ],
    blogContent: {
      readingTime: "4 min read",
      publishedDate: "2026-06-25",
      author: "Engineered by Black Swan Procurement Team",
      authorTitle: "Supply Chain & Hardware Procurement Manager",
      sections: [
        {
          heading: "Simplifying Enterprise Technology Procurement",
          body: "Acquiring specialized broadcast and medical hardware requires dealing with global supply chains, international compliance standards, and complex import logistics. Black Swan serves as your single authorized procurement partner, simplifying the quote-to-delivery lifecycle.",
        },
        {
          heading: "Authorized Manufacturer Partnerships",
          body: "We partner directly with leading technology manufacturers, ensuring every chassis, video processing card, and encoder comes with genuine warranties, factory firmware updates, and direct manufacturer escalation paths.",
        },
        {
          heading: "Factory Acceptance Staging & Local Spare Inventory",
          body: "Before equipment is dispatched to client facilities, our engineers stage hardware in our integration lab, updating firmware, testing stress loads, and verifying optical outputs.",
        },
      ],
      architecturalHighlights: [
        "100% Genuine manufacturer serial validation",
        "Pre-shipment Factory Acceptance Testing (FAT)",
        "Local warehouse spare component buffer stock",
        "Flexible enterprise quote cart & quotation workflow",
      ],
      faq: [
        {
          question: "Can I request a formal enterprise quotation for bulk equipment?",
          answer:
            "Yes. Use our website Quote Cart system or contact our sales engineering desk directly to generate formal B2B pricing quotes.",
        },
        {
          question: "Do you offer post-warranty local repair and component replacement?",
          answer:
            "Yes. We offer local SLA maintenance contracts covering out-of-warranty hardware replacement and diagnostic repairs.",
        },
      ],
    },
  },
  {
    id: "serv-ob-van-solution",
    slug: "ob-van-solution",
    title: "OB VAN SOLUTION",
    category: "telecom",
    categoryLabel: "Mobile Production Units",
    slaBadge: "Custom Vehicle Coachbuilding",
    desc: "OB VAN SOLUTION provides turnkey mobile broadcast production vehicles, customized OB vans, DSNG trucks, and flight-case production systems for live outdoor sports and news coverage.",
    longDescription:
      "Black Swan designs, coachbuilds, and integrates custom Outside Broadcast (OB) vans. From compact 4-camera mobile news trucks to expandable 24-camera 4K HDR production trailers, our vehicles feature integrated climate control, redundant power generators, and ergonomic production desks.",
    image: "/services/ob-van-solution.webp",
    iconName: "Truck",
    deliverables: [
      "Turnkey OB van custom vehicle coachbuilding, acoustic isolation, and climate control",
      "12G-SDI / SMPTE ST 2110 mobile production switcher & audio console integration",
      "Pneumatic motorized antenna mast & motorized satellite dish (DSNG) mounting",
      "On-board diesel generator systems with automatic shore power transfer switches",
    ],
    features: [
      {
        title: "Turnkey Coachbuilding",
        desc: "Custom chassis modification, thermal insulation, and acoustic soundproofing.",
      },
      {
        title: "12G-SDI / IP Workflows",
        desc: "High-density mobile routing infrastructure supporting 4K HDR camera feeds.",
      },
      {
        title: "Ergonomic Layouts",
        desc: "Separate operational zones for Production, Audio, Engineering, and Replay.",
      },
      {
        title: "Heavy-Duty Power Systems",
        desc: "Dual UPS backup with automatic generator shore-power switching.",
      },
    ],
    blogContent: {
      readingTime: "7 min read",
      publishedDate: "2026-06-20",
      author: "Engineered by Black Swan Mobile Engineering",
      authorTitle: "OB Van Coachbuilding & Systems Integration Lead",
      sections: [
        {
          heading: "Engineering High-Performance Outside Broadcast Vehicles",
          body: "Live sports and event coverage require full studio production capabilities on wheels. Outside Broadcast (OB) vans operate in demanding environments—from extreme heat to rugged terrain. Black Swan's vehicle engineering delivers robust, ergonomically optimized mobile studios.",
        },
        {
          heading: "Weight Distribution, Power & Climate Control",
          body: "Proper axle weight distribution and heavy-duty suspension modifications prevent vehicle fatigue. Integrated high-capacity HVAC climate systems maintain cool rack environments even under harsh ambient weather conditions.",
        },
        {
          heading: "Integrated Mobile Production Stack",
          body: "Our vehicle integrations fit production switchers, multi-channel slow-motion replay servers, digital audio consoles, wireless camera receivers, and satellite uplinks into compact, highly functional operator spaces.",
        },
      ],
      architecturalHighlights: [
        "Custom vehicle chassis & pneumatic mast installation",
        "HVAC dual-zone precision climate control",
        "ST 2110 IP & 12G-SDI mobile routing core",
        "On-board silent diesel generator integration",
      ],
      faq: [
        {
          question: "What vehicle chassis sizes do you support?",
          answer:
            "We build on Mercedes-Benz Sprinter, Iveco Daily, MAN trucks, and custom expandable trailer chassis.",
        },
        {
          question: "Can existing studio equipment be integrated into a new OB Van chassis?",
          answer:
            "Yes. We frequently re-integrate client-owned cameras, switchers, and audio consoles into custom mobile vehicles.",
        },
      ],
    },
  },
  {
    id: "serv-teleport-services",
    slug: "teleport-services",
    title: "TELEPORT SERVICES",
    category: "telecom",
    categoryLabel: "Satellite Earth Station Ops",
    slaBadge: "24/7 Global Uplink Operations",
    desc: "Teleport Services provide satellite Earth station uplink, C-band / Ku-band transponder leasing, satellite turnaround, and global IP teleport connectivity for broadcasters.",
    longDescription:
      "Black Swan operates carrier-grade Teleport Earth station facilities, providing TV networks with reliable C-band and Ku-band uplink, downlink, transponder capacity, and fiber turnaround services to distribute channels across continents.",
    image: "/services/teleport-services.webp",
    iconName: "Globe",
    deliverables: [
      "C-band & Ku-band satellite uplink/downlink transmission services",
      "High-power amplifier (HPA) redundant transmitter facility management",
      "Satellite channel turnaround and IP fiber backhaul interconnections",
      "24/7 RF spectrum monitoring and satellite carrier monitoring desk",
    ],
    features: [
      {
        title: "Multi-Satellite Uplink",
        desc: "Direct line-of-sight access to major geostationary broadcast satellites.",
      },
      {
        title: "1+1 HPA Redundancy",
        desc: "Automated waveguide switching between primary and backup High Power Amplifiers.",
      },
      {
        title: "Fiber-to-Satellite Turnaround",
        desc: "Seamless conversion of terrestrial IP/fiber streams into satellite carriers.",
      },
      {
        title: "24/7 Teleport NOC",
        desc: "Round-the-clock RF spectrum analysis and carrier monitoring.",
      },
    ],
    blogContent: {
      readingTime: "6 min read",
      publishedDate: "2026-06-15",
      author: "Engineered by Black Swan Satellite Operations",
      authorTitle: "Teleport Operations & Uplink Manager",
      sections: [
        {
          heading: "Global Content Distribution via Teleport Earth Stations",
          body: "Satellite television remains the gold standard for reaching millions of simultaneous viewers across wide geographic areas. Black Swan's Teleport Services connect broadcast studios with orbital satellite capacity, ensuring flawless signal transmission.",
        },
        {
          heading: "High-Power Uplink Architecture & Weather Protection",
          body: "Rain fade and atmospheric attenuation can impact Ku-band satellite signals. Our Earth stations employ automatic uplink power control (AUPC) and motorized dish anti-icing systems to maintain signal lock during severe weather.",
        },
        {
          heading: "Terrestrial Fiber & Cloud Interconnects",
          body: "Our teleports link directly to global Tier-1 fiber backbones and major cloud service providers (AWS Elemental MediaConnect, GCP), allowing content to flow seamlessly from remote studios to satellite dishes.",
        },
      ],
      architecturalHighlights: [
        "C-band & Ku-band 4.5m / 7.2m motorized dish arrays",
        "AUPC Automatic Uplink Power Control system",
        "Direct AWS Elemental & GCP media fiber interconnects",
        "24/7 NOC carrier monitoring with SNMP trap alerts",
      ],
      faq: [
        {
          question: "Can we lease temporary satellite transponder capacity for occasional live events?",
          answer:
            "Yes. We offer both occasional use (OU) hourly satellite slots and full-time 24/7 transponder lease agreements.",
        },
        {
          question: "What satellites are accessible from your teleport facilities?",
          answer:
            "Our antennas cover major orbital slots across Asia-Pacific, South Asia, Middle East, and European coverage footprints.",
        },
      ],
    },
  },
  {
    id: "serv-cas",
    slug: "cas",
    title: "CONDITIONAL ACCESS SYSTEM (CAS)",
    category: "distribution",
    categoryLabel: "Broadcast Content Security",
    slaBadge: "DVB-CSA & AES Encryption",
    desc: "Conditional Access System (CAS) provides broadcast signal encryption, subscriber entitlement management (EMM/ECM), and anti-piracy protection for Cable TV, DTH satellite, and IPTV operators.",
    longDescription:
      "Black Swan's Conditional Access System safeguards Pay-TV revenues through DVB-CSA3 and AES-128 encryption. Built to prevent signal piracy, card sharing, and unauthorized redistribution, our CAS secures content across card-based set-top boxes and cardless software client architectures.",
    image: "/services/cas.webp",
    iconName: "Lock",
    deliverables: [
      "Hardware DVB-CSA2 / DVB-CSA3 / AES simulcrypt encryptor scrambler deployment",
      "ECM (Entitlement Control Message) and EMM generator integration",
      "Dynamic visual fingerprinting & dynamic serial number watermarking on set-top boxes",
      "Cardless CAS and Smartcard security provisioning server setup",
    ],
    features: [
      {
        title: "DVB-CSA3 Encryption",
        desc: "Advanced military-grade scrambling preventing stream decryption hacks.",
      },
      {
        title: "Dynamic Fingerprinting",
        desc: "Injects invisible or visual subscriber ID watermarks onto TV screens to catch illegal restreamers.",
      },
      {
        title: "Simulcrypt Compliant",
        desc: "Supports DVB Simulcrypt standard to run multiple CAS vendors on one stream.",
      },
      {
        title: "Cardless & Smartcard Options",
        desc: "Deploy legacy smartcard systems or modern chip-set paired cardless software CAS.",
      },
    ],
    blogContent: {
      readingTime: "7 min read",
      publishedDate: "2026-06-10",
      author: "Engineered by Black Swan Security Architecture",
      authorTitle: "Broadcast Content Protection Specialist",
      sections: [
        {
          heading: "Protecting Broadcast Revenue Against Signal Piracy",
          body: "Signal piracy costs pay-TV operators millions in lost subscription revenue every year. Black Swan's Conditional Access System (CAS) provides robust DVB-compliant encryption and real-time subscriber authorization controls.",
        },
        {
          heading: "Forensic Fingerprinting & Anti-Restreaming Defense",
          body: "When pirates attempt to capture HDMI feeds from set-top boxes for illegal IPTV restreaming, our CAS dynamically overlays unique covert subscriber ID numbers onto the screen, allowing operators to identify and disable the offending account within minutes.",
        },
        {
          heading: "DVB Simulcrypt Architecture",
          body: "Our CAS hardware scramblers strictly follow DVB Simulcrypt guidelines, enabling cable operators to run multiple CAS vendors side by side without duplicating video bandwidth streams.",
        },
      ],
      architecturalHighlights: [
        "DVB Simulcrypt TS 103 197 compliance",
        "Hardware-based FPGA DVB-CSA3 scrambler card",
        "Dynamic visual & covert forensic watermarking",
        "Direct integration with Subscriber Management Systems (SMS)",
      ],
      faq: [
        {
          question: "Can this system protect high-definition 4K channels?",
          answer:
            "Yes. DVB-CSA3 encryption and chip-set pairing ensure 4K UHD content meets strict Hollywood studio security guidelines.",
        },
        {
          question: "What is the difference between Card-Based and Cardless CAS?",
          answer:
            "Card-Based CAS uses physical ISO smartcards inserted into STBs, while Cardless CAS relies on secure hardware chipsets inside the set-top box processor, reducing logistics costs.",
        },
      ],
    },
  },
];

export const POPULAR_SERVICES: ServiceItem[] = ALL_SERVICES.slice(0, 4);
