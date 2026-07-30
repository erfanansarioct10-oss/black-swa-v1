export interface SampleProduct {
  id: string;
  name: string;
  category: "medical" | "broadcast";
  categoryDisplay: string;
  sku: string;
  desc: string;
  isSpotlight?: boolean;
  specs: string[];
  compliance: string[];
  badge?: string;
  stockStatus: string;
  image: string;
}

export const SAMPLE_PRODUCTS: SampleProduct[] = [
  {
    id: "prod-1",
    name: "UltraHD Medical Imaging Workstation - MedVision X1",
    category: "medical",
    categoryDisplay: "Medical Hardware",
    sku: "BS-MED-8000",
    desc: "DICOM-compliant high-speed diagnostic processing node engineered for hospital radiology departments.",
    isSpotlight: true,
    badge: "Flagship Medical System",
    stockStatus: "In Stock • Enterprise Configurable",
    image: "/products/medvision-x1.webp",
    specs: [
      "DICOM Part 14 Grayscale Display Calibration & 10-bit Color Rendering",
      "Dual Intel Xeon Processors + NVIDIA RTX A6000 Medical GPU",
      "PACS Network Integration with Quad 10GbE SFP+ Fiber Interfaces",
      "Ultra-Quiet 28dB Acoustic Enclosure for Hospital Suite Deployment",
    ],
    compliance: ["ISO 13485", "IEC 60601-1", "CE MDR", "FDA Registered"],
  },
  {
    id: "prod-2",
    name: "Live Broadcast Video Encoding Server 8K",
    category: "broadcast",
    categoryDisplay: "Broadcast Hardware",
    sku: "BS-BC-9000",
    desc: "Uncompressed low-latency 12G-SDI video encoding computer server for live television networks.",
    stockStatus: "In Stock • Rackmount Ready",
    image: "/products/broadcast-8k.webp",
    specs: [
      "12G-SDI Quad-Link Uncompressed 8K Video Capture & Streaming",
      "SMPTE ST 2110 IP Video Transport with Redundant Hitless Failover",
      "< 5ms Ultra-Low Latency Hardware Encoding Subsystem",
    ],
    compliance: ["SMPTE ST 2110", "FCC Class A", "RoHS"],
  },
  {
    id: "prod-3",
    name: "Telehealth Hardware Gateway & Monitor Hub",
    category: "medical",
    categoryDisplay: "Medical Hardware",
    sku: "BS-MED-GATEWAY",
    desc: "HIPAA-compliant encrypted telemedicine computing terminal with bio-sensor telemetry interfaces.",
    stockStatus: "In Stock • Custom Assembly",
    image: "/products/telehealth-gateway.webp",
    specs: [
      "HIPAA-Compliant AES-256 Encrypted Embedded Edge Computing",
      "Isolated Multi-Sensor Bio-Telemetry & Clinical Camera Interfaces",
      "Dual Hot-Swappable Medical-Grade Power Supplies",
    ],
    compliance: ["HIPAA Compliant", "IEC 60601-1", "ISO 27001"],
  },
  {
    id: "prod-4",
    name: "Studio Video Wall Processor Computer",
    category: "broadcast",
    categoryDisplay: "Broadcast Hardware",
    sku: "BS-BC-VWALL",
    desc: "Multi-GPU rackmount hardware engine driving ultra-wide broadcast studio LED displays and graphics.",
    stockStatus: "In Stock • Rackmount Ready",
    image: "/products/videowall-processor.webp",
    specs: [
      "Multi-GPU PCIe Gen5 Canvas Engine Driving up to 32 HD Displays",
      "Genlock Frame Synchronization for Seamless Broadcast Walls",
      "24/7 Mission-Critical Hot-Swappable Enterprise Componentry",
    ],
    compliance: ["FCC Class A", "CE Certified", "RoHS"],
  },
  {
    id: "prod-5",
    name: "4K PACS Diagnostic Display Controller Node",
    category: "medical",
    categoryDisplay: "Medical Hardware",
    sku: "BS-MED-PACS",
    desc: "Precision multi-display medical controller node supporting ultra-high resolution clinical diagnostic displays.",
    stockStatus: "In Stock • Ready to Ship",
    image: "/products/pacs-controller.webp",
    specs: [
      "Multi-Head 4K DisplayPort Outputs with Hardware Luminance Sensor",
      "Real-Time DICOM Image Processing Acceleration Engine",
    ],
    compliance: ["ISO 13485", "FDA Registered", "IEC 60601-1"],
  },
  {
    id: "prod-6",
    name: "12G-SDI Broadcast Matrix Router Workstation",
    category: "broadcast",
    categoryDisplay: "Broadcast Hardware",
    sku: "BS-BC-ROUTER",
    desc: "High-density hardware routing computing workstation for multi-channel live production studio feeds.",
    stockStatus: "In Stock • Rackmount Ready",
    image: "/products/sdi-router.webp",
    specs: [
      "32x32 12G-SDI Re-clocking Hardware Matrix Switching",
      "IP Media Edge Gateway with SMPTE ST 2022-6 Protocol Support",
    ],
    compliance: ["SMPTE Certified", "FCC Class A", "RoHS"],
  },
];
