import * as React from 'react';
import { Upload, X } from 'lucide-react';

import { cn } from '../lib/utils';

/**
 * PhotoUploader - drag-drop + file-picker entry for student photos.
 *
 * Pure UI primitive. Does NOT make API calls; the consumer wires `onUpload`
 * to the actual `/api/students/[id]/photo` endpoint per Architecture §10.
 *
 * Reference:
 *   - docs/spec/01-design-system.md §10
 *   - docs/spec/03-microcopy.md §8.2
 *
 * Microcopy is taken VERBATIM from spec 03 §8.2.
 *
 * @example
 *   <PhotoUploader
 *     studentName="Mia A."
 *     onUpload={async (file) => { await api.upload(file); }}
 *   />
 */
export interface PhotoUploaderProps {
  studentName: string;
  /** Called with the selected file. Consumer handles the actual upload. */
  onUpload: (file: File) => Promise<void> | void;
  /** Max file size in bytes. Defaults to 5MB. */
  maxBytes?: number;
  /** Accepted MIME types. Defaults to image/jpeg and image/png. */
  acceptTypes?: string[];
  /** Optional preview image already on file. */
  initialPreviewUrl?: string | null;
  /** Called when the upload completes successfully. */
  onSuccess?: () => void;
  /** Called when the upload fails or validation fails. */
  onError?: (message: string) => void;
  className?: string;
}

export function PhotoUploader({
  studentName,
  onUpload,
  maxBytes = 5 * 1024 * 1024,
  acceptTypes = ['image/jpeg', 'image/png'],
  initialPreviewUrl,
  onSuccess,
  onError,
  className,
}: PhotoUploaderProps) {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(
    initialPreviewUrl ?? null,
  );
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = React.useCallback(
    async (file: File) => {
      setErrorMessage(null);

      if (!acceptTypes.includes(file.type)) {
        const msg = 'JPEG or PNG only.';
        setErrorMessage(msg);
        onError?.(msg);
        return;
      }
      if (file.size > maxBytes) {
        const msg = `File is too large. Maximum ${Math.round(maxBytes / (1024 * 1024))} MB.`;
        setErrorMessage(msg);
        onError?.(msg);
        return;
      }

      // Show preview synchronously
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          setPreviewUrl(e.target.result);
        }
      };
      reader.readAsDataURL(file);

      setIsUploading(true);
      try {
        await onUpload(file);
        onSuccess?.();
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Couldn\'t upload. Try again.';
        setErrorMessage(msg);
        onError?.(msg);
      } finally {
        setIsUploading(false);
      }
    },
    [acceptTypes, maxBytes, onError, onSuccess, onUpload],
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  const formatLabel = `JPEG or PNG. Up to ${Math.round(maxBytes / (1024 * 1024))} MB. We'll crop to a square.`;

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <p className="text-[var(--text-body-sm)] text-[var(--color-rrt-text-soft)]">
        Upload a clear face photo. We use it on the kiosk and on coach rosters.
        We never share it externally.
      </p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`Upload photo for ${studentName}`}
        className={cn(
          'flex flex-col items-center justify-center gap-3',
          'min-h-48 p-6',
          'rounded-[var(--radius-xl)]',
          'border-2 border-dashed',
          'cursor-pointer',
          'transition-colors duration-[var(--motion-duration-fast)]',
          'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
          isDragging
            ? 'border-[var(--color-rrt-maroon-700)] bg-[var(--color-rrt-surface-hover)]'
            : 'border-[var(--color-rrt-line)] bg-[var(--color-rrt-surface)] hover:bg-[var(--color-rrt-surface-hover)]',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptTypes.join(',')}
          onChange={onSelect}
          className="sr-only"
        />
        {previewUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Photo preview"
              className="size-32 rounded-[var(--radius-xl)] object-cover"
            />
            <p className="text-[var(--text-body-sm)] text-[var(--color-rrt-text-soft)]">
              Click or drag a different photo to replace.
            </p>
          </>
        ) : (
          <>
            <Upload
              aria-hidden="true"
              className="size-8 text-[var(--color-rrt-maroon-700)]"
            />
            <p className="text-[var(--text-body)] font-semibold text-[var(--color-rrt-text)]">
              Drag a photo here or click to choose.
            </p>
            <p className="text-[var(--text-body-sm)] text-[var(--color-rrt-text-soft)]">
              {formatLabel}
            </p>
          </>
        )}
        {isUploading ? (
          <p className="text-[var(--text-body-sm)] text-[var(--color-rrt-info)]">
            Uploading...
          </p>
        ) : null}
      </div>

      {errorMessage ? (
        <p
          role="alert"
          className="inline-flex items-center gap-1.5 text-[var(--text-body-sm)] text-[var(--color-rrt-error)]"
        >
          <X aria-hidden="true" className="size-4" />
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
