"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const PIONEERS = [
  {
    name: "Amara N.",
    handle: "@amara.pi",
    role: "Marketplace seller · Nairobi",
    avatar: "🧕",
    accent: "text-pi-gold",
    quote:
      "Soko.pi is the kind of name that makes you want to build immediately. I already have a pilot shop selling handmade crafts priced in Pi — it just feels right.",
    rating: 5,
  },
  {
    name: "David K.",
    handle: "@davidk.pi",
    role: "Node operator · Lagos",
    avatar: "👨🏾‍💻",
    accent: "text-pi-purple",
    quote:
      "Watching kinyanjui.pi grow this portfolio has been inspiring. The roadmap is honest, the vision is clear, and the domains actually mean something.",
    rating: 5,
  },
  {
    name: "Lilian W.",
    handle: "@lilianw.pi",
    role: "Digital artist · Kampala",
    avatar: "👩🏾‍🎨",
    accent: "text-pi-rose",
    quote:
      "piart.pi gave me a home to mint and sell my work in Pi. Royalties actually reach creators here. This is the Web3 onboarding I always wanted.",
    rating: 5,
  },
  {
    name: "Tendai M.",
    handle: "@tendai.pi",
    role: "Community lead · Harare",
    avatar: "🧑🏾",
    accent: "text-pi-teal",
    quote:
      "pioneerhub.pi is going to be the place where pioneers discover each other. Security circles, leaderboards, projects — finally a social layer for Pi.",
    rating: 5,
  },
  {
    name: "Fatima A.",
    handle: "@fatima.pi",
    role: "Farmer cooperative · Arusha",
    avatar: "👩🏾‍🌾",
    accent: "text-pi-teal",
    quote:
      "Kilimo.pi speaks to us. Listing produce and settling in Pi could change how smallholder cooperatives work across East Africa.",
    rating: 5,
  },
];

export function PioneerSpotlight() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    containScroll: "trimSnaps",
  });
  const [selected, setSelected] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    setCount(emblaApi.scrollSnapList().length);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  // auto-advance
  React.useEffect(() => {
    if (!emblaApi) return;
    const id = setInterval(() => emblaApi.scrollNext(), 6500);
    return () => clearInterval(id);
  }, [emblaApi]);

  return (
    <section
      id="pioneers"
      className="relative scroll-mt-20 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <Badge
              variant="outline"
              className="mb-3 gap-1.5 rounded-full border-pi-rose/30 bg-pi-rose/10 px-3 py-1 text-xs font-medium text-pi-rose"
            >
              <Users className="h-3.5 w-3.5" />
              Pioneer spotlight
            </Badge>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Voices from the <span className="text-gradient-purple">network</span>
            </h2>
            <p className="mt-3 text-pretty text-muted-foreground">
              Pioneers across Africa and beyond are already building on the
              domains in this portfolio. Here&apos;s what they have to say.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={() => emblaApi?.scrollPrev()}
              aria-label="Previous pioneer"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={() => emblaApi?.scrollNext()}
              aria-label="Next pioneer"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-10 overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4">
            {PIONEERS.map((p, i) => (
              <div
                key={p.handle}
                className="min-w-0 shrink-0 grow-0 basis-full pl-4 sm:basis-1/2 lg:basis-1/3"
              >
                <motion.article
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <Quote className="absolute right-5 top-5 h-10 w-10 text-pi-gold/15" />
                  <div className="relative flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border/60 bg-gradient-to-br from-pi-gold/15 to-pi-purple/15 text-2xl">
                      {p.avatar}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold leading-tight">{p.name}</p>
                      <p className={`font-mono text-xs ${p.accent}`}>{p.handle}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{p.role}</p>
                    </div>
                  </div>

                  <div className="relative mt-4 flex gap-0.5">
                    {Array.from({ length: p.rating }).map((_, idx) => (
                      <Star
                        key={idx}
                        className="h-4 w-4 fill-pi-gold text-pi-gold"
                      />
                    ))}
                  </div>

                  <blockquote className="relative mt-3 flex-1 text-pretty text-sm leading-relaxed text-foreground/90">
                    “{p.quote}”
                  </blockquote>
                </motion.article>
              </div>
            ))}
          </div>
        </div>

        {/* dots */}
        <div className="mt-6 flex items-center justify-center gap-1.5">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Go to pioneer ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                selected === i
                  ? "w-6 bg-gradient-to-r from-pi-gold to-pi-purple"
                  : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
