import type { ReactNode } from "react";
import { fieldClass } from "@/components/ui/styles";
import type { PatientField } from "../useBookingForm";
import { stepTitleClass } from "./stepStyles";

/**
 * Paso 4: datos mínimos. El celular no se pide: el mensaje sale desde el
 * WhatsApp del paciente y la clínica ya recibe su número.
 */
export function PatientStep({
  fullName,
  documentId,
  consent,
  errors,
  onFullNameChange,
  onDocumentIdChange,
  onConsentChange,
}: {
  fullName: string;
  documentId: string;
  consent: boolean;
  errors: Partial<Record<PatientField, string>>;
  onFullNameChange: (value: string) => void;
  onDocumentIdChange: (value: string) => void;
  onConsentChange: (value: boolean) => void;
}) {
  return (
    <>
      <h1 data-ph="" className={stepTitleClass}>
        Tus datos para confirmar
      </h1>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-4">
        <Field id="fullName" label="Nombre y apellido" error={errors.fullName}>
          <input
            id="fullName"
            autoComplete="name"
            maxLength={80}
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
            className={fieldClass}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby="err-fullName"
          />
        </Field>
        <Field id="documentId" label="DNI o CE (opcional)" error={errors.documentId}>
          <input
            id="documentId"
            inputMode="numeric"
            maxLength={12}
            value={documentId}
            onChange={(e) => onDocumentIdChange(e.target.value)}
            className={fieldClass}
            aria-invalid={Boolean(errors.documentId)}
            aria-describedby="err-documentId"
          />
        </Field>
      </div>
      <div data-it="" className="flex flex-col gap-1.5">
        <label htmlFor="consent" className="flex cursor-pointer items-start gap-3 text-sm leading-normal text-subink">
          <input
            id="consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => onConsentChange(e.target.checked)}
            className="mt-px h-5 w-5 accent-teal"
            aria-invalid={Boolean(errors.consent)}
            aria-describedby="err-consent"
          />
          <span>
            {/* TODO: enlazar la página real de política de privacidad */}
            Acepto la <a href="#">política de privacidad</a> y enviar estos datos a la clínica por WhatsApp.
          </span>
        </label>
        <FieldError id="consent" message={errors.consent} />
      </div>
    </>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div data-it="" className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      {children}
      <FieldError id={id} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <span id={`err-${id}`} role="alert" className="text-[13px] text-[#9B2C1F]">
      {message}
    </span>
  );
}
