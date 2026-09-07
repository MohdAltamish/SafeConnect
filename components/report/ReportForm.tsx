'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { type ReportCategory, CATEGORY_LABELS } from '@/types';
import { CategorySelector } from './CategorySelector';
import { StepIndicator } from './StepIndicator';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { reportSchema } from '@/lib/validators/reportSchema';
import { ArrowLeft, ArrowRight, Send, Loader2, Shield } from 'lucide-react';

const STEP_LABELS = ['Category', 'Details', 'Evidence', 'Review'];
const TOTAL_STEPS = 4;

interface FormState {
  category: ReportCategory | null;
  description: string;
  location: string;
  incidentDate: string;
  evidenceUrls: string[];
}

/**
 * Multi-step report form per Workflow.md §1 and Design.md §7.
 * State held in local component state only — never persisted until final submit.
 * Per Rules.md §1: no PII fields, no cookies, no tracking.
 */
export function ReportForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<FormState>({
    category: null,
    description: '',
    location: '',
    incidentDate: '',
    evidenceUrls: [],
  });

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 0) {
      if (!formData.category) {
        newErrors.category = 'Please select a category';
      }
    }

    if (currentStep === 1) {
      if (!formData.description || formData.description.length < 20) {
        newErrors.description =
          'A few more details will help the team act on this — please write at least 20 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    // Validate full form with Zod
    const result = reportSchema.safeParse({
      ...formData,
      location: formData.location || undefined,
      incidentDate: formData.incidentDate || undefined,
    });

    if (!result.success) {
      const zodErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          zodErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(zodErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit report');
      }

      const data = await response.json();
      // Navigate to success page with case ID and token in query params
      // These are only passed via URL once, never stored
      const params = new URLSearchParams({
        caseId: data.caseId,
        token: data.accessToken,
      });
      router.push(`/report/success?${params.toString()}`);
    } catch {
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[640px] mx-auto">
      <StepIndicator
        currentStep={step}
        totalSteps={TOTAL_STEPS}
        labels={STEP_LABELS}
      />

      <Card padding="lg">
        {/* Step 1: Category */}
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <CategorySelector
              value={formData.category}
              onChange={(category) => {
                setFormData((prev) => ({ ...prev, category }));
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.category;
                  return next;
                });
              }}
              error={errors.category}
            />

            {formData.category === 'SEXUAL_HARASSMENT' && (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-xs text-text-primary">
                <div className="flex items-start gap-2.5">
                  <Shield className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <strong className="text-primary font-semibold block mb-0.5">
                      GLBITM Internal Committee (IC) / Women Grievance Cell
                    </strong>
                    <p className="text-text-muted leading-relaxed">
                      This incident will be routed directly to the GLBITM Internal Committee (Presided over by Dr. Rashmi Mishra) formed under AICTE Regulations 2016. Complete protection against victimization is guaranteed by GLBITM Grievance Policy §1.2.7.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Details */}
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <Textarea
              label="What happened?"
              placeholder="Describe the incident — include when it happened, what was said or done, and any other details that would help someone understand the situation."
              value={formData.description}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, description: e.target.value }));
                if (e.target.value.length >= 20) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.description;
                    return next;
                  });
                }
              }}
              error={errors.description}
              helperText={`${formData.description.length} characters (20 minimum)`}
              rows={6}
            />
            <Input
              label="Where did it happen? (optional)"
              placeholder="e.g. Hostel Block A, Library, near the canteen"
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
            />
            <Input
              label="When did it happen? (optional)"
              type="date"
              value={formData.incidentDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, incidentDate: e.target.value }))
              }
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        )}

        {/* Step 3: Evidence */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-medium text-text-primary mb-1">
                Attach evidence (optional)
              </h3>
              <p className="text-xs text-text-muted mb-4">
                You can attach up to 3 files (images or PDF, max 5MB each). This step is
                optional — your report is valid without evidence.
              </p>
            </div>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
              <p className="text-text-muted text-sm">
                Evidence upload will be available once Firebase Storage is configured.
              </p>
              <p className="text-text-muted text-xs mt-2">
                You can skip this step for now.
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-text-primary">
              Review your report
            </h3>
            <p className="text-sm text-text-muted">
              Please review the details below. Nothing is submitted until you press
              &quot;Submit Securely&quot;.
            </p>

            <div className="flex flex-col gap-3 mt-2">
              <div className="bg-surface-tint rounded-lg p-4">
                <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Category</p>
                <p className="text-text-primary font-medium">
                  {formData.category ? CATEGORY_LABELS[formData.category] : '—'}
                </p>
              </div>

              <div className="bg-surface-tint rounded-lg p-4 border-l-4 border-primary">
                <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Routed Authority</p>
                <p className="text-text-primary font-medium text-sm">
                  {formData.category === 'SEXUAL_HARASSMENT'
                    ? "GLBITM Internal Committee (IC) / Women's Grievance Cell"
                    : formData.category === 'RAGGING'
                    ? 'Anti-Ragging Committee'
                    : formData.category === 'HOSTEL_ISSUE'
                    ? 'Hostel Warden'
                    : formData.category === 'OTHER'
                    ? 'Public Relations / General Cell'
                    : 'Discipline Committee'}
                </p>
                {formData.category === 'SEXUAL_HARASSMENT' && (
                  <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
                    Meeting convened within 1 week of receipt. Protected under Policy §1.2.7 against victimization.
                  </p>
                )}
              </div>

              <div className="bg-surface-tint rounded-lg p-4">
                <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Description</p>
                <p className="text-text-primary text-sm whitespace-pre-wrap">
                  {formData.description || '—'}
                </p>
              </div>

              {formData.location && (
                <div className="bg-surface-tint rounded-lg p-4">
                  <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Location</p>
                  <p className="text-text-primary text-sm">{formData.location}</p>
                </div>
              )}

              {formData.incidentDate && (
                <div className="bg-surface-tint rounded-lg p-4">
                  <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Incident Date</p>
                  <p className="text-text-primary text-sm">
                    {new Date(formData.incidentDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>

            {errors.submit && (
              <p className="text-sm text-danger mt-2" role="alert">
                {errors.submit}
              </p>
            )}

            <div className="bg-surface-tint border border-border rounded-lg p-4 mt-2">
              <p className="text-xs text-text-muted">
                <strong className="text-text-primary">Your identity is never collected</strong> — not
                even by us. This report is fully anonymous. After submitting, you&apos;ll receive a
                Case ID and Access Token to track your report.
              </p>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8 gap-3">
          {step > 0 ? (
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={isSubmitting}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < TOTAL_STEPS - 1 ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="min-w-[180px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Securely
                </>
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
