export interface SampleProduct {
  id: string;
  name: string;
  category: "medical" | "broadcast";
  categoryDisplay: string;
  sku: string;
  desc: string;
}

export const SAMPLE_PRODUCTS: SampleProduct[] = [
  {
    id: "prod-1",
    name: "UltraHD Medical Imaging Workstation - MedVision X1",
    category: "medical",
    categoryDisplay: "Medical Hardware",
    sku: "BS-MED-8000",
    desc: "DICOM-compliant high-speed DICOM diagnostic processing node for hospital radiology departments.",
  },
  {
    id: "prod-2",
    name: "Live Broadcast Video Encoding Server 8K",
    category: "broadcast",
    categoryDisplay: "Broadcast Hardware",
    sku: "BS-BC-9000",
    desc: "Uncompressed low-latency 12G-SDI video encoding computer server for live television networks.",
  },
  {
    id: "prod-3",
    name: "Telehealth Hardware Gateway & Monitor Hub",
    category: "medical",
    categoryDisplay: "Medical Hardware",
    sku: "BS-MED-GATEWAY",
    desc: "HIPAA-compliant encrypted telemedicine computing terminal with bio-sensor telemetry interfaces.",
  },
  {
    id: "prod-4",
    name: "Studio Video Wall Processor Computer",
    category: "broadcast",
    categoryDisplay: "Broadcast Hardware",
    sku: "BS-BC-VWALL",
    desc: "Multi-GPU rackmount hardware engine driving ultra-wide broadcast studio LED displays and graphics.",
  },
];
