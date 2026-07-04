"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { GlassCard, SectionLabel } from "./shared";

const faqs = [
  {
    q: "How does the AI assessment work?",
    a: "Our AI evaluates you across four dimensions: coding skills, project quality, certification relevance, and resume effectiveness. You complete adaptive coding challenges, submit your GitHub profile, and upload your resume. The AI cross-references everything against real industry data and 1,000+ live job descriptions.",
  },
  {
    q: "How accurate is the skill gap analysis?",
    a: "Our analysis has a verified 94% accuracy rate based on follow-up data from students who received job offers. The model is trained on 10,000+ job descriptions and continuously updated with live hiring signals from top engineering companies.",
  },
  {
    q: "Do I need coding experience to take the assessment?",
    a: "No. The assessment adapts to your level — whether you're a beginner or an experienced engineer. The AI adjusts challenge difficulty in real time to accurately profile your current state, so there's no baseline requirement.",
  },
  {
    q: "How long does the assessment take?",
    a: "The full assessment takes approximately 12–18 minutes. You can complete it in one session or save your progress and return later. Your personalized report is generated within 60 seconds of completion.",
  },
  {
    q: "Can recruiters view my results?",
    a: "Only if you choose to share them. You control a shareable report link that you can include in your resume or send directly to recruiters. Sharing is always opt-in — your data is never shared without your explicit permission.",
  },
];

export default function FAQ() {
  return (
    <section id="pricing" className="py-28 relative">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center">
          <SectionLabel>FAQ</SectionLabel>
          <h2
            className="font-bold text-white mb-12"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
          >
            Common Questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map(({ q, a }, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-none">
              <GlassCard className="overflow-hidden">
                <AccordionTrigger
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 text-white font-medium text-sm hover:no-underline"
                >
                  {q}
                </AccordionTrigger>
                <AccordionContent
                  className="overflow-hidden text-sm text-white/50 border-t border-white/5"
                >
                  <div className="px-6 pb-5 pt-4 leading-relaxed">{a}</div>
                </AccordionContent>
              </GlassCard>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
