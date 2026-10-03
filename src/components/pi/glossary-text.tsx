"use client";

import * as React from "react";
import { GlossaryTrigger, GLOSSARY } from "./glossary";

interface GlossaryTextProps {
  text: string;
  className?: string;
}

/**
 * Renders plain text, automatically wrapping known Pi glossary terms
 * in clickable GlossaryTrigger popovers. Case-insensitive, longest-match-first
 * to avoid partial overlaps.
 */
export function GlossaryText({ text, className }: GlossaryTextProps) {
  // Sort terms by length descending so we match longer terms first
  const terms = React.useMemo(
    () =>
      GLOSSARY.map((g) => g.term)
        .sort((a, b) => b.length - a.length),
    []
  );

  const segments = React.useMemo(() => {
    // Build a single regex that matches any term, case-insensitive, word-bounded
    const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    if (escaped.length === 0) return [{ text, term: null as string | null }];
    const re = new RegExp(
      `\\b(${escaped.join("|")})\\b`,
      "gi"
    );
    const result: { text: string; term: string | null }[] = [];
    let last = 0;
    let match: RegExpExecArray | null;
    while ((match = re.exec(text)) !== null) {
      if (match.index > last) {
        result.push({ text: text.slice(last, match.index), term: null });
      }
      result.push({ text: match[0], term: match[0] });
      last = match.index + match[0].length;
    }
    if (last < text.length) {
      result.push({ text: text.slice(last), term: null });
    }
    return result;
  }, [text, terms]);

  return (
    <span className={className}>
      {segments.map((seg, i) =>
        seg.term ? (
          <GlossaryTrigger key={i} term={seg.term}>
            {seg.text}
          </GlossaryTrigger>
        ) : (
          <React.Fragment key={i}>{seg.text}</React.Fragment>
        )
      )}
    </span>
  );
}
