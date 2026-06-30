"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  User, Mail, Phone, CalendarDays, BookOpen, Clock, FileText,
  CheckCircle, XCircle, MessageSquare, Hash, GraduationCap
} from "lucide-react";

interface InscriptionRequest {
  id: string;
  studentFirstName: string;
  studentLastName: string;
  age: number;
  schoolLevel?: string;
  programId: string;
  parentFirstName: string;
  parentLastName: string;
  parentPhone: string;
  parentEmail: string;
  message?: string;
  status: "pending" | "accepted" | "refused";
  createdAt: string;
  adminNotes?: string;
  rejectionMessage?: string;
}

interface Props {
  request: InscriptionRequest | null
  programName?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "En attente", color: "bg-amber/10 text-amber border-amber/20", icon: Clock },
  accepted: { label: "Accepté", color: "bg-lime/10 text-lime border-lime/20", icon: CheckCircle },
  refused: { label: "Refusé", color: "bg-coral/10 text-coral border-coral/20", icon: XCircle },
};

export function EnrollmentDetailModal({ request, programName, open, onOpenChange }: Props) {
  if (!request) return null;

  const st = statusConfig[request.status];
  const StatusIcon = st.icon;

  const initials = `${request.studentFirstName[0]}${request.studentLastName[0]}`.toUpperCase();
  const parentInitials = `${request.parentFirstName?.[0] || ""}${request.parentLastName?.[0] || ""}`.toUpperCase() || "?";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-sky to-cyan text-sm font-black text-white">
              {initials}
            </div>
            <div>
              <span className="text-lg">{request.studentFirstName} {request.studentLastName}</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${st.color}`}>
                  <StatusIcon className="size-3" />
                  {st.label}
                </span>
                <span className="text-xs text-ink-soft">{request.age} ans</span>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-surface p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-sky/10 text-sky">
                  <GraduationCap className="size-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-ink-soft">Élève</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="size-3.5 text-ink-soft shrink-0" />
                  <span className="font-semibold text-ink">{request.studentFirstName} {request.studentLastName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Hash className="size-3.5 text-ink-soft shrink-0" />
                  <span className="text-ink-soft">{request.age} ans</span>
                </div>
                {request.schoolLevel && (
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="size-3.5 text-ink-soft shrink-0" />
                    <span className="text-ink-soft">{request.schoolLevel}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-surface p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-sky/10 text-sky">
                  <BookOpen className="size-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-ink-soft">Programme</span>
              </div>
              <p className="text-sm font-semibold text-ink">{programName || request.programId}</p>
              <div className="flex items-center gap-2 mt-2 text-sm">
                <CalendarDays className="size-3.5 text-ink-soft shrink-0" />
                <span className="text-ink-soft">
                  {new Date(request.createdAt).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-surface p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-amber/10 text-amber">
                <User className="size-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-ink-soft">Parent</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-amber/10 text-[10px] font-bold text-amber">
                  {parentInitials}
                </span>
                <span className="font-semibold text-ink">
                  {request.parentFirstName} {request.parentLastName}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="size-3.5 text-ink-soft shrink-0" />
                <span className="text-ink-soft truncate">{request.parentEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-sm col-span-2">
                <Phone className="size-3.5 text-ink-soft shrink-0" />
                <span className="text-ink-soft">{request.parentPhone}</span>
              </div>
            </div>
          </div>

          {request.message && (
            <div className="rounded-xl bg-surface p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-purple/10 text-purple">
                  <MessageSquare className="size-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-ink-soft">Message</span>
              </div>
              <p className="text-sm text-ink-soft italic leading-relaxed">&ldquo;{request.message}&rdquo;</p>
            </div>
          )}

          {request.adminNotes && (
            <div className="rounded-xl bg-surface p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-sky/10 text-sky">
                  <FileText className="size-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-ink-soft">Note interne</span>
              </div>
              <p className="text-sm text-ink">{request.adminNotes}</p>
            </div>
          )}

          {request.rejectionMessage && (
            <div className="rounded-xl bg-coral/5 border border-coral/20 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-coral/10 text-coral">
                  <XCircle className="size-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-coral">Message de refus</span>
              </div>
              <p className="text-sm text-ink">{request.rejectionMessage}</p>
            </div>
          )}

          <div className="flex items-center justify-between rounded-xl bg-surface px-4 py-3">
            <span className="text-xs text-ink-soft font-medium">
              ID: <span className="font-mono">{request.id}</span>
            </span>
            <Badge variant={request.status === "pending" ? "pending" : request.status === "accepted" ? "accepted" : "rejected"}>
              {st.label}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
