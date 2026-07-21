import * as React from 'react';

import { cn } from '../lib/utils';
import { Checkbox } from './ui/checkbox';
import { FormField } from './ui/form-field';
import { Input } from './ui/input';

/**
 * ConsentForm - parental consent form (COPPA + photo consent).
 *
 * Reference:
 *   - docs/spec/01-design-system.md §10.2 + §10.3
 *   - docs/spec/03-microcopy.md §8.1 (copy is VERBATIM)
 *
 * Microcopy ships in the package because the COPPA copy is highly regulated;
 * a separate jurisdiction-specific override is intentionally NOT supported in
 * Slice 1 (deferred). The consumer wires the signed payload to its API.
 *
 * Required checkboxes (1, 2). Optional checkboxes (3 photos, 4 marketing).
 *
 * The consumer renders this inside a Sheet or Dialog and handles submission;
 * the form itself is a controlled component.
 *
 * @example
 *   <ConsentForm
 *     childName="Mia"
 *     phoneNumber="(972) 555-0100"
 *     supportEmail="info@rhythmicribbon.com"
 *     onSubmit={(payload) => api.recordConsent(payload)}
 *   />
 */
export interface ConsentFormPayload {
  /** Required: parent confirms guardianship + age 18+ */
  parentalConfirmation: boolean;
  /** Required: parent consents to identity data collection */
  identityConsent: boolean;
  /** Optional: parent consents to photo storage */
  photoConsent: boolean;
  /** Optional: parent consents to marketing-style communications */
  communicationsConsent: boolean;
  /** Typed legal signature */
  signature: string;
  /** ISO date string of signing */
  signedAt: string;
}

export interface ConsentFormProps {
  childName: string;
  phoneNumber: string;
  supportEmail: string;
  onSubmit: (payload: ConsentFormPayload) => Promise<void> | void;
  onCancel?: () => void;
  className?: string;
  /** Pre-fill the parent's name to seed the signature field. */
  defaultParentName?: string;
}

export function ConsentForm({
  childName,
  phoneNumber,
  supportEmail,
  onSubmit,
  onCancel,
  className,
  defaultParentName = '',
}: ConsentFormProps) {
  const [parentalConfirmation, setParentalConfirmation] = React.useState(false);
  const [identityConsent, setIdentityConsent] = React.useState(false);
  const [photoConsent, setPhotoConsent] = React.useState(false);
  const [communicationsConsent, setCommunicationsConsent] = React.useState(false);
  const [signature, setSignature] = React.useState(defaultParentName);
  const [signatureError, setSignatureError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const today = React.useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  const canSubmit =
    parentalConfirmation &&
    identityConsent &&
    signature.trim().length > 0 &&
    !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signature.trim().length === 0) {
      setSignatureError('Type your full legal name as your electronic signature.');
      return;
    }
    setSignatureError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({
        parentalConfirmation,
        identityConsent,
        photoConsent,
        communicationsConsent,
        signature: signature.trim(),
        signedAt: new Date().toISOString(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('flex flex-col gap-6', className)}
      aria-label="Parental consent form"
    >
      <header className="flex flex-col gap-2">
        <h2 className="font-display [font-size:var(--text-h2)] text-[var(--color-rrt-text)]">
          Parental consent
        </h2>
        <p className="[font-size:var(--text-body)] text-[var(--color-rrt-text-soft)]">
          Federal law requires us to ask for your consent before we collect or
          store certain information about your child. Please read carefully.
        </p>
      </header>

      <div className="max-w-none space-y-4 [font-size:var(--text-body)] leading-relaxed text-[var(--color-rrt-text)]">
        <p>
          Rhythmic Ribbon of Texas is required by the Children&apos;s Online Privacy
          Protection Act (COPPA) to obtain verifiable consent from a parent or
          legal guardian before collecting personal information from a child
          under 13. By signing this form, you confirm that you are the legal
          parent or guardian of the child named on this form and that you
          authorize RRT to collect and store the following information for the
          purposes described below.
        </p>

        <p className="mt-4 font-semibold">Information we collect:</p>
        <ul className="list-disc pl-5">
          <li>Your child&apos;s first name, age, and date of birth.</li>
          <li>
            Your child&apos;s photo (only if you check the box below and only after
            class observation that they&apos;re comfortable being photographed).
          </li>
          <li>Class attendance records for your child.</li>
          <li>
            Notes about your child&apos;s progress, allergies, or special needs as
            you provide them.
          </li>
        </ul>

        <p className="mt-4 font-semibold">How we use it:</p>
        <ul className="list-disc pl-5">
          <li>To identify your child at our kiosk and on coach rosters.</li>
          <li>To recommend appropriate classes and track skill progression.</li>
          <li>
            To contact you with class updates, makeup options, or safety
            notices.
          </li>
        </ul>

        <p className="mt-4 font-semibold">How we protect it:</p>
        <ul className="list-disc pl-5">
          <li>We store all data on encrypted servers in the United States.</li>
          <li>Only authorized RRT staff with a need to know have access.</li>
          <li>
            We do not sell, rent, or share your child&apos;s information with third
            parties for marketing purposes.
          </li>
          <li>
            We retain data only as long as your family is actively enrolled,
            plus one year after the last activity for record-keeping.
          </li>
        </ul>

        <p className="mt-4 font-semibold">Your rights:</p>
        <ul className="list-disc pl-5">
          <li>
            You may request a copy of the information we have about your child
            at any time.
          </li>
          <li>
            You may correct or update any information you believe is
            inaccurate.
          </li>
          <li>
            You may withdraw consent and request deletion of your child&apos;s
            information at any time. We will respond within 14 days.
          </li>
        </ul>

        <p className="mt-4">
          To exercise any of these rights, contact us at {supportEmail} or {phoneNumber}.
        </p>
      </div>

      <fieldset className="flex flex-col gap-4">
        <legend className="sr-only">Required consents</legend>

        <label className="flex items-start gap-3 cursor-pointer">
          <Checkbox
            checked={parentalConfirmation}
            onCheckedChange={(v) =>
              setParentalConfirmation(v === true)
            }
            required
          />
          <span className="[font-size:var(--text-body-sm)] text-[var(--color-rrt-text)]">
            I am the legal parent or legal guardian of {childName} and I am at
            least 18 years of age.
            <span aria-hidden="true" className="ml-1 text-[var(--color-rrt-error)]">*</span>
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <Checkbox
            checked={identityConsent}
            onCheckedChange={(v) => setIdentityConsent(v === true)}
            required
          />
          <span className="[font-size:var(--text-body-sm)] text-[var(--color-rrt-text)]">
            I consent to RRT collecting and storing my child&apos;s name, age, date
            of birth, and attendance records as described above.
            <span aria-hidden="true" className="ml-1 text-[var(--color-rrt-error)]">*</span>
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <Checkbox
            checked={photoConsent}
            onCheckedChange={(v) => setPhotoConsent(v === true)}
          />
          <span className="[font-size:var(--text-body-sm)] text-[var(--color-rrt-text)]">
            I consent to RRT taking and storing photos of my child to be used
            for class identification at the kiosk and on coach rosters only. I
            understand that these photos will not be shared publicly, posted on
            social media, or used in marketing without separate written
            consent.
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <Checkbox
            checked={communicationsConsent}
            onCheckedChange={(v) =>
              setCommunicationsConsent(v === true)
            }
          />
          <span className="[font-size:var(--text-body-sm)] text-[var(--color-rrt-text)]">
            I consent to RRT contacting me by email and SMS with class updates,
            makeup options, and important notices. I understand I can opt out
            at any time by replying STOP to any SMS or clicking unsubscribe in
            any email.
          </span>
        </label>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Signature"
          description="Type your full legal name as your electronic signature."
          required
          error={signatureError ?? undefined}
        >
          <Input
            type="text"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            autoComplete="name"
          />
        </FormField>

        <FormField label="Date">
          <Input type="text" value={today} readOnly aria-readonly="true" />
        </FormField>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className={cn(
              'inline-flex items-center justify-center',
              'h-12 px-5 rounded-[var(--radius-lg)]',
              'bg-transparent text-[var(--color-rrt-maroon-700)]',
              'border border-[var(--color-rrt-line)]',
              '[font-size:var(--text-body)] font-semibold',
              'hover:bg-[var(--color-rrt-surface-hover)]',
              'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
            )}
          >
            I have questions; contact me first
          </button>
        ) : null}
        <button
          type="submit"
          disabled={!canSubmit}
          className={cn(
            'inline-flex items-center justify-center',
            'h-12 px-5 rounded-[var(--radius-lg)]',
            'bg-[var(--color-rrt-maroon-800)] text-[var(--color-rrt-cream-50)]',
            '[font-size:var(--text-body)] font-semibold',
            'hover:bg-[var(--color-rrt-maroon-700)]',
            'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
            'disabled:opacity-55 disabled:cursor-not-allowed',
          )}
        >
          {isSubmitting ? 'Signing...' : 'Sign and submit'}
        </button>
      </div>
    </form>
  );
}
