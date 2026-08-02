"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LeadTable } from "@/components/admin/leads/lead-table";
import { LeadFormModal } from "@/components/admin/leads/lead-form-modal";
import { ConvertLeadModal } from "@/components/admin/leads/convert-lead-modal";
import type { LeadListItem } from "@/actions/lead";

interface LeadsTableContainerProps {
  leads: LeadListItem[];
}

export function LeadsTableContainer({ leads }: LeadsTableContainerProps) {
  const router = useRouter();

  const [selectedEditLead, setSelectedEditLead] = useState<LeadListItem | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [selectedConvertLead, setSelectedConvertLead] = useState<LeadListItem | null>(null);
  const [convertModalOpen, setConvertModalOpen] = useState(false);

  const handleEditClick = (lead: LeadListItem) => {
    setSelectedEditLead(lead);
    setEditModalOpen(true);
  };

  const handleConvertClick = (lead: LeadListItem) => {
    setSelectedConvertLead(lead);
    setConvertModalOpen(true);
  };

  return (
    <>
      <LeadTable
        leads={leads}
        onEditClick={handleEditClick}
        onConvertClick={handleConvertClick}
      />

      {selectedEditLead && (
        <LeadFormModal
          key={selectedEditLead.id}
          open={editModalOpen}
          onOpenChange={(open) => {
            setEditModalOpen(open);
            if (!open) setSelectedEditLead(null);
          }}
          initialData={selectedEditLead}
          onSuccess={() => router.refresh()}
        />
      )}


      {selectedConvertLead && (
        <ConvertLeadModal
          open={convertModalOpen}
          onOpenChange={(open) => {
            setConvertModalOpen(open);
            if (!open) setSelectedConvertLead(null);
          }}
          lead={selectedConvertLead}
          onSuccess={() => router.refresh()}
        />
      )}
    </>
  );
}
