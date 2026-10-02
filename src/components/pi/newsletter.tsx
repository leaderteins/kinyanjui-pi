"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Mail, Loader2, Bell, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function Newsletter() {
  const [email, setEmail] = React.useState("");
  const [piHandle, setPiHandle] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [done, setDone] = React.useState(false);

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, piHandle }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Could not subscribe.");
        return;
      }
      setDone(true);
      toast.success(data.message ?? "Subscribed!");
      setEmail("");
      setPiHandle("");
    } catch {
      toast.error("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative overflow-hidden py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-pi-purple/15 via-card to-pi-gold/15 p-8 backdrop-blur-sm sm:p-10"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-pi-gold/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-pi-purple/20 blur-3xl" />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-pi-gold/30 bg-pi-gold/10 px-3 py-1 text-xs font-medium text-pi-gold">
                <Bell className="h-3.5 w-3.5" /> Pioneer dispatch
              </span>
              <h2 className="mt-3 text-balance text-2xl font-bold tracking-tight sm:text-3xl">
                Get Pi ecosystem updates from{" "}
                <span className="font-mono text-gradient-gold">kinyanjui.pi</span>
              </h2>
              <p className="mt-2 text-pretty text-sm text-muted-foreground">
                New domain launches, marketplace milestones, Pi network news —
                one concise dispatch, no spam, unsubscribe anytime.
              </p>
            </div>

            <div>
              {done ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-pi-teal/40 bg-pi-teal/10 p-8 text-center">
                  <CheckCircle2 className="h-10 w-10 text-pi-teal" />
                  <p className="mt-3 font-semibold">You&apos;re on the list!</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Welcome aboard, pioneer.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={subscribe}
                  className="space-y-3 rounded-2xl border border-border/60 bg-background/70 p-4 backdrop-blur-sm"
                >
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      Email address
                    </label>
                    <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="h-10 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      Pi handle (optional)
                    </label>
                    <Input
                      value={piHandle}
                      onChange={(e) => setPiHandle(e.target.value)}
                      placeholder="@yourname"
                      className="h-10 font-mono"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-11 w-full gap-2 bg-gradient-to-r from-pi-gold to-pi-purple text-primary-foreground"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Joining…
                      </>
                    ) : (
                      <>Join the pioneer list</>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
