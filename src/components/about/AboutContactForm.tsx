"use client";

import { useActionState } from "react";
import { submitContactForm } from "@/app/actions/contact";

export default function AboutContactForm() {
    const [formState, formAction, isPending] = useActionState(
        async (_previous: { success?: boolean; error?: string } | null, formData: FormData) => submitContactForm(formData),
        null
    );

    if (formState?.success) {
        return (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center" role="status">
                <p className="font-heading text-xl font-bold text-primary">Message sent</p>
                <p className="mt-2 font-body text-dark/65">Thank you. The TAS team will be in touch.</p>
            </div>
        );
    }

    return (
        <form action={formAction} className="grid gap-5">
            <label className="grid gap-2 font-body text-sm font-semibold text-dark" htmlFor="about-contact-name">
                Name
                <input id="about-contact-name" name="name" type="text" autoComplete="name" required placeholder="Your name" className="min-h-12 rounded-2xl border border-dark/15 bg-white px-4 py-3 font-normal text-dark outline-none transition-colors placeholder:text-dark/40 focus:border-primary" />
            </label>
            <label className="grid gap-2 font-body text-sm font-semibold text-dark" htmlFor="about-contact-email">
                Email
                <input id="about-contact-email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" className="min-h-12 rounded-2xl border border-dark/15 bg-white px-4 py-3 font-normal text-dark outline-none transition-colors placeholder:text-dark/40 focus:border-primary" />
            </label>
            <label className="grid gap-2 font-body text-sm font-semibold text-dark" htmlFor="about-contact-message">
                Message
                <textarea id="about-contact-message" name="message" rows={5} required placeholder="Tell us how you would like to connect." className="rounded-2xl border border-dark/15 bg-white px-4 py-3 font-normal text-dark outline-none transition-colors placeholder:text-dark/40 focus:border-primary" />
            </label>
            {formState?.error ? <p className="font-body text-sm font-semibold text-red-700" role="alert">{formState.error}</p> : null}
            <button type="submit" disabled={isPending} className="min-h-12 rounded-full bg-secondary px-6 py-3 font-heading text-sm font-bold text-dark transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                {isPending ? "Sending…" : "Send Message"}
            </button>
        </form>
    );
}
