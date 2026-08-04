import { db } from "../db";
import { leads } from "../db/schema";

async function seedCrmPipelineDemoData() {
  console.log("🌱 Seeding CRM Pipeline & Analytics demo leads into Supabase PostgreSQL...");

  const now = Date.now();
  const DAY_MS = 24 * 60 * 60 * 1000;

  const sampleLeads = [
    {
      title: "Manipal Hospital MRI & Telehealth Gateway Infrastructure",
      contactName: "Dr. Rajesh Sharma",
      email: "dr.sharma@manipal.edu.np",
      phone: "+977-9851012345",
      companyName: "Manipal Teaching Hospital",
      leadSource: "website_rfq" as const,
      status: "new" as const,
      priority: "urgent" as const,
      estimatedValue: 4500000,
      notes: "Inquired about 3T MRI workstation integration and telehealth PACS gateway.",
      createdAt: new Date(now - 1 * DAY_MS),
      updatedAt: new Date(now - 1 * DAY_MS),
    },
    {
      title: "Kantipur Media Network 4K Studio Encoding Workstations",
      contactName: "Bikram Adhikari",
      email: "bikram.a@kantipurmedia.com",
      phone: "+977-9801234567",
      companyName: "Kantipur Television Network",
      leadSource: "direct_inquiry" as const,
      status: "contacted" as const,
      priority: "high" as const,
      estimatedValue: 6800000,
      notes: "Initial phone call completed; requested technical spec sheet for live SDI encoders.",
      createdAt: new Date(now - 3 * DAY_MS),
      updatedAt: new Date(now - 12 * 60 * 60 * 1000), // 12h ago (fresh)
    },
    {
      title: "Norvic International Radiology Diagnostic Workstation Upgrade",
      contactName: "Sunita Thapa",
      email: "sthapa@norvichospital.com",
      phone: "+977-9841234567",
      companyName: "Norvic International Hospital",
      leadSource: "referral" as const,
      status: "assessment" as const,
      priority: "high" as const,
      estimatedValue: 3200000,
      notes: "Technical assessment phase; evaluating dual 4K medical imaging monitors.",
      createdAt: new Date(now - 5 * DAY_MS),
      updatedAt: new Date(now - 3 * DAY_MS), // >48h ago (Stale Alert badge trigger)
    },
    {
      title: "Nepal Television HD Master Control Playout System",
      contactName: "Rohan Rai",
      email: "rohan.rai@ntv.org.np",
      phone: "+977-9818765432",
      companyName: "Nepal Television Corporation",
      leadSource: "trade_show" as const,
      status: "proposal_sent" as const,
      priority: "urgent" as const,
      estimatedValue: 12500000,
      notes: "Formal technical proposal and PDF quote sent via email; pending board approval.",
      createdAt: new Date(now - 10 * DAY_MS),
      updatedAt: new Date(now - 4 * DAY_MS), // >48h ago (Stale Alert badge trigger)
    },
    {
      title: "Grand Hospital Telemedicine Mobile Command Cart",
      contactName: "Pooja Gurung",
      email: "pooja.g@grandhospital.com.np",
      phone: "+977-9860112233",
      companyName: "Grand Hospital Kathmandu",
      leadSource: "website_rfq" as const,
      status: "negotiation" as const,
      priority: "medium" as const,
      estimatedValue: 2800000,
      notes: "In negotiation regarding payment schedule and 3-year extended warranty package.",
      createdAt: new Date(now - 8 * DAY_MS),
      updatedAt: new Date(now - 1 * DAY_MS),
    },
    {
      title: "Annapurna Media Network Broadcast Storage Server Array",
      contactName: "Anish Shrestha",
      email: "anish.s@annapurnapost.com",
      phone: "+977-9803456789",
      companyName: "Annapurna Media Network",
      leadSource: "outreach" as const,
      status: "closed_won" as const,
      priority: "high" as const,
      estimatedValue: 8900000,
      notes: "Contract signed and purchase order issued. Deal successfully won!",
      createdAt: new Date(now - 14 * DAY_MS),
      updatedAt: new Date(now - 2 * DAY_MS),
    },
    {
      title: "Standard Diagnostics Clinic Portable Ultrasound Workstation",
      contactName: "Dr. Kedar Paudel",
      email: "kpaudel@standarddiag.com",
      phone: "+977-9849876543",
      companyName: "Standard Diagnostics Clinic",
      leadSource: "direct_inquiry" as const,
      status: "closed_lost" as const,
      priority: "low" as const,
      estimatedValue: 1400000,
      notes: "Lead opted for lower tier local vendor due to budget constraints.",
      createdAt: new Date(now - 20 * DAY_MS),
      updatedAt: new Date(now - 15 * DAY_MS),
    },
  ];

  await db.insert(leads).values(sampleLeads);
  console.log("✅ Successfully seeded 7 sample leads across all Kanban stages!");
}

seedCrmPipelineDemoData().catch((err) => {
  console.error("Seed script failed:", err);
  process.exit(1);
});
