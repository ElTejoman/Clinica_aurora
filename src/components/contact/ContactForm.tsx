"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/Icon";
import { fieldClass } from "@/components/ui/styles";
import { track } from "@/lib/analytics";
import { contactMessageSchema } from "@/models/contact";
import { buildContactWhatsAppUrl } from "@/services/booking.service";
import { cn } from "@/utils/cn";

type Field = "fullName" | "email" | "message";

/**
 * "Nos encanta leerte": el sitio es estático, así que el mensaje no se guarda:
 * se valida y se abre WhatsApp con el texto listo para enviar.
 */
export function ContactForm() {
  const [values, setValues] = useState<Record<Field, string>>({ fullName: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sent, setSent] = useState(false);

  const set = (field: Field) => (e: { target: { value: string } }) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = contactMessageSchema.safeParse(values);
    if (!parsed.success) {
      const next: Partial<Record<Field, string>> = {};
      for (const issue of parsed.error.issues) next[issue.path[0] as Field] ??= issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    window.open(buildContactWhatsAppUrl(parsed.data), "_blank", "noopener,noreferrer");
    track("cta_click", { location: "contact_form" });
    setSent(true);
  };

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <Field id="contact-name" label="Nombre completo" error={errors.fullName}>
        <input id="contact-name" autoComplete="name" maxLength={80} value={values.fullName} onChange={set("fullName")} className={fieldClass} aria-invalid={Boolean(errors.fullName)} aria-describedby="contact-name-error" />
      </Field>
      <Field id="contact-email" label="Correo (opcional)" error={errors.email}>
        <input id="contact-email" type="email" autoComplete="email" maxLength={120} value={values.email} onChange={set("email")} className={fieldClass} aria-invalid={Boolean(errors.email)} aria-describedby="contact-email-error" />
      </Field>
      <Field id="contact-message" label="Tu consulta" error={errors.message}>
        <textarea id="contact-message" rows={5} maxLength={800} value={values.message} onChange={set("message")} className={cn(fieldClass, "h-auto resize-y py-3.5")} aria-invalid={Boolean(errors.message)} aria-describedby="contact-message-error" />
      </Field>
      <Button type="submit" size="lg" className="self-start">
        <WhatsAppIcon size={20} />
        Enviar por WhatsApp
      </Button>
      {sent && (
        <p role="status" className="m-0 text-sm text-leaf-ink">
          Abrimos WhatsApp con tu mensaje. Si no se abrió, revisa que tu navegador permita ventanas emergentes.
        </p>
      )}
    </form>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      {error && (
        <span id={`${id}-error`} role="alert" className="text-[13px] text-[#9B2C1F]">
          {error}
        </span>
      )}
    </div>
  );
}
