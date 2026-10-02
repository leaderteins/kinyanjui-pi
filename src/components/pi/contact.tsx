"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Send,
  Mail,
  MessageSquare,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const INTENTS = [
  { value: "general", label: "General question" },
  { value: "purchase", label: "Make an offer" },
  { value: "partnership", label: "Partner / build together" },
  { value: "develop", label: "Develop a domain" },
];

export function Contact() {
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    domain: "",
    intent: "general",
    budget: "",
    message: "",
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Could not send your message.");
        return;
      }
      setDone(true);
      toast.success("Message sent! I'll be in touch soon.");
      setForm({
        name: "",
        email: "",
        domain: "",
        intent: "general",
        budget: "",
        message: "",
      });
    } catch {
      toast.error("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="contact"
      className="relative scroll-mt-20 overflow-hidden border-y border-border/60 bg-card/30 py-20 sm:py-24"
    >
      <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-pi-gold/15 blur-3xl" />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Left: pitch */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="outline"
              className="mb-3 gap-1.5 rounded-full border-pi-gold/30 bg-pi-gold/10 px-3 py-1 text-xs font-medium text-pi-gold"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Get in touch
            </Badge>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Let&apos;s build the{" "}
              <span className="text-gradient-gold">Pi web</span> together.
            </h2>
            <p className="mt-4 text-pretty text-muted-foreground">
              Whether you want to make an offer, partner on a build, or just say
              hello from across the network — drop a message and I&apos;ll reply
              from <span className="font-mono font-semibold text-foreground">kinyanjui.pi</span>.
            </p>

            <div className="mt-6 space-y-3">
              <ContactRow
                icon={Mail}
                label="Email"
                value="hello@kinyanjui.pi"
              />
              <ContactRow
                icon={Sparkles}
                label="Pi handle"
                value="@kinyanjui"
              />
            </div>

            <div className="mt-6 rounded-2xl border border-border/60 bg-background/60 p-4 backdrop-blur-sm">
              <p className="text-sm font-medium">Response time</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Most inquiries get a reply within 48 hours. For domain
                purchases, include your best offer in Pi.
              </p>
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
          >
            {done ? (
              <div className="flex h-full min-h-72 flex-col items-center justify-center rounded-2xl border border-pi-teal/40 bg-pi-teal/10 p-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-pi-teal" />
                <h3 className="mt-4 text-xl font-semibold">Message sent!</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Thanks for reaching out. I&apos;ll reply from{" "}
                  <span className="font-mono font-semibold">kinyanjui.pi</span>{" "}
                  soon.
                </p>
                <Button
                  variant="outline"
                  className="mt-5"
                  onClick={() => setDone(false)}
                >
                  Send another
                </Button>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="space-y-4 rounded-2xl border border-border/60 bg-background/60 p-5 backdrop-blur-sm sm:p-6"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Your name">
                    <Input
                      required
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="Jane Pioneer"
                      className="h-10"
                    />
                  </Field>
                  <Field label="Email">
                    <Input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="jane@example.com"
                      className="h-10"
                    />
                  </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Domain of interest (optional)">
                    <Input
                      value={form.domain}
                      onChange={(e) => update("domain", e.target.value)}
                      placeholder="soko.pi"
                      className="h-10 font-mono"
                    />
                  </Field>
                  <Field label="Intent">
                    <Select
                      value={form.intent}
                      onValueChange={(v) => update("intent", v)}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {INTENTS.map((i) => (
                          <SelectItem key={i.value} value={i.value}>
                            {i.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                <Field label="Budget / offer in Pi (optional)">
                  <Input
                    value={form.budget}
                    onChange={(e) => update("budget", e.target.value)}
                    placeholder="e.g. 2,000 π"
                    className="h-10 font-mono"
                  />
                </Field>

                <Field label="Message">
                  <Textarea
                    required
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    placeholder="Tell me what you have in mind…"
                    className="min-h-32 resize-y"
                  />
                </Field>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="h-11 w-full gap-2 bg-gradient-to-r from-pi-gold to-pi-purple text-primary-foreground shadow-lg shadow-pi-gold/20"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Send message
                    </>
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 px-4 py-3 backdrop-blur-sm">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-pi-gold/10 text-pi-gold">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-mono text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
