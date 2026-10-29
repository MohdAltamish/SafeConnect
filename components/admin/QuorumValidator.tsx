'use client';

import React from 'react';
import { IC_MEMBERS } from '@/lib/constants/glbitm';
import { Users, CheckCircle2, AlertTriangle } from 'lucide-react';

interface QuorumValidatorProps {
  selectedMembers: string[];
  onChange: (members: string[]) => void;
  requiredQuorum?: number;
}

export function QuorumValidator({
  selectedMembers,
  onChange,
  requiredQuorum = 3,
}: QuorumValidatorProps) {
  const isQuorumMet = selectedMembers.length >= requiredQuorum;

  const toggleMember = (name: string) => {
    if (selectedMembers.includes(name)) {
      onChange(selectedMembers.filter((m) => m !== name));
    } else {
      onChange([...selectedMembers, name]);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
            Statutory Quorum Verification (BOG Policy §1.2.6)
          </h4>
        </div>
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            isQuorumMet
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}
        >
          {isQuorumMet ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5" />
          )}
          <span>
            {selectedMembers.length} / {requiredQuorum} Required Present
          </span>
        </div>
      </div>

      <p className="text-xs text-text-muted">
        Statutory requirement: At least 3 committee members must be present to convene, take action, or resolve this grievance.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 max-h-48 overflow-y-auto pr-1">
        {IC_MEMBERS.map((member) => {
          const isSelected = selectedMembers.includes(member.name);
          return (
            <label
              key={member.sNo}
              className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                isSelected
                  ? 'border-primary bg-primary/5 text-text-primary'
                  : 'border-border/60 hover:bg-surface-tint/50 text-text-secondary'
              }`}
            >
              <input
                type="checkbox"
                className="mt-0.5 rounded border-border text-primary focus:ring-primary"
                checked={isSelected}
                onChange={() => toggleMember(member.name)}
              />
              <div className="flex flex-col">
                <span className="font-medium text-text-primary">{member.name}</span>
                <span className="text-[10px] text-text-muted">{member.designationCommittee}</span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
