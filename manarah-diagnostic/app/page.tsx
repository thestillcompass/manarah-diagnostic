"use client";
import { trackEvent } from "@/lib/gtag";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Montserrat, Cormorant_Garamond } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["500", "600", "700", "800"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
});

type Question = {
  id: number;
  area:
    | "Founder Dependency"
    | "Founder Load"
    | "Founder State"
    | "Management Capability"
    | "Firefighting"
    | "Strategic Clarity"
    | "Founder Reality";
  text: string;
  options: {
    label: string;
    value: number;
  }[];
};

type FormData = {
  name: string;
  email: string;
  phone: string;
  company: string;
  stage: string;
  revenueRange: string;
  founderState: string;
  source: string;
};

const questions: Question[] = [
  {
    id: 1,
    area: "Founder Dependency",
    text: "If you disappeared from the business for 5 days, what would actually break first?",
    options: [
      { label: "Everything slows down or stops", value: 1 },
      { label: "Things move, but I’m still involved remotely", value: 2 },
      { label: "The team runs things, but I’m still the backbone", value: 3 },
      { label: "The business runs without needing me", value: 5 },
    ],
  },
  {
    id: 2,
    area: "Founder Load",
    text: "Even when you’re not working, how much of your mind is still occupied by the business?",
    options: [
      { label: "Constantly — I can’t switch off", value: 1 },
      { label: "Most of the time — it’s always in the background", value: 2 },
      { label: "Sometimes — I get mental space", value: 3 },
      { label: "Rarely — I’m fully disconnected outside work", value: 5 },
    ],
  },
  {
    id: 3,
    area: "Founder State",
    text: "What does running your business actually feel like right now?",
    options: [
      { label: "Draining — it’s taking more than it’s giving", value: 1 },
      { label: "Heavy — constant pressure and responsibility", value: 2 },
      { label: "Demanding — but still manageable", value: 3 },
      { label: "Structured — I feel in control", value: 5 },
    ],
  },
  {
    id: 4,
    area: "Management Capability",
    text: "Your managers — how well do they actually run their departments?",
    options: [
      { label: "They depend on me for decisions and direction", value: 1 },
      { label: "They try, but execution is inconsistent", value: 2 },
      { label: "They handle some things, but they’re not fully reliable", value: 3 },
      { label: "They run departments independently with clear ownership", value: 5 },
    ],
  },
  {
    id: 5,
    area: "Firefighting",
    text: "Where does most of your time go right now?",
    options: [
      { label: "Solving problems and fixing issues", value: 1 },
      { label: "Managing people and following up", value: 2 },
      { label: "A mix of execution and growth", value: 3 },
      { label: "Mostly focused on growth and strategy", value: 5 },
    ],
  },
  {
    id: 6,
    area: "Strategic Clarity",
    text: "When you think about the next phase of growth, what happens?",
    options: [
      { label: "I feel unclear and unsure", value: 1 },
      { label: "I have ideas, but no clear path", value: 2 },
      { label: "I know what to do, but execution is slow", value: 3 },
      { label: "I have a clear plan and direction", value: 5 },
    ],
  },
  {
    id: 7,
    area: "Founder Reality",
    text: "Which of these feels most true about your business today?",
    options: [
      { label: "The business depends on me more than I expected", value: 1 },
      { label: "I thought I could step back, but I can’t", value: 2 },
      { label: "We have systems, but they don’t fully work", value: 3 },
      { label: "The business runs with structure and ownership", value: 5 },
    ],
  },
];

function getResultType(score: number) {
  if (score <= 14) {
    return {
      title: "Founder Under Strain",
      shortLabel: "High Urgency",
      summary:
        "Your business is still relying heavily on you for direction, decisions, and execution. That creates pressure, inconsistency, and a level of mental load that is difficult to sustain.",
      insight:
        "This is not just a growth issue. It is a structural issue. The business may be moving, but it is still costing you too much personally to run.",
      cta:
        "The next step is to reduce founder dependency, strengthen management capability, and install the systems required to stabilize performance.",
    };
  }

  if (score <= 22) {
    return {
      title: "Founder Bottleneck",
      shortLabel: "Priority Shift Needed",
      summary:
        "The business has momentum, but too much still flows through you. Your managers may be active, but they are not yet creating the ownership and execution needed to truly free you.",
      insight:
        "At this stage, most founders feel responsible for everything, even after building a team. Growth continues, but control and clarity do not improve at the same pace.",
      cta:
        "The next step is to build stronger management systems, clearer accountability, and better execution discipline across the business.",
    };
  }

  if (score <= 29) {
    return {
      title: "Growth Under Pressure",
      shortLabel: "Strong Potential",
      summary:
        "Your business has some meaningful structure in place, but not enough consistency to support growth without pressure. Things work, but not as smoothly as they should.",
      insight:
        "This is where many businesses get stuck. Revenue grows, but founder pressure stays high because management ownership, execution rhythm, and internal clarity are still uneven.",
      cta:
        "The next step is to tighten structure, improve ownership, and create the management discipline needed for sustainable growth.",
    };
  }

  return {
    title: "Scale-Ready Foundation",
    shortLabel: "Advanced Stage",
    summary:
      "Your business has a solid operating base. The issue is no longer survival or chaos — it is refinement, sharper management, and stronger execution at scale.",
    insight:
      "At this stage, the opportunity is to strengthen what already works, deepen leadership ownership, and ensure growth does not reintroduce founder dependency.",
    cta:
      "The next step is to refine management capability, improve strategic execution, and prepare the business for its next level of growth.",
  };
}

function getInsightStatus(score: number) {
  if (score >= 4) return "Strong";
  if (score >= 3) return "Unstable";
  return "Needs Attention";
}

function getLeadTemperature(
  score: number,
  founderState: string,
  revenueRange: string
): "Hot" | "Warm" | "Cold" {
  if (score <= 22) {
    return "Hot";
  }

  if (score >= 30) {
    if (
      founderState === "stable" &&
      (revenueRange === "₹10-25 Cr" || revenueRange === "₹25+ Cr")
    ) {
      return "Warm";
    }
    return "Cold";
  }

  if (
    founderState === "dependency" ||
    founderState === "inconsistent" ||
    revenueRange === "₹25+ Cr"
  ) {
    return "Hot";
  }

  return "Warm";
}

export default function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Removed quiz_started from useEffect. Will trigger on first answer.
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [dynamicHook, setDynamicHook] = useState("");
  const [formData, setFormData] = useState<FormData>({
  name: "",
  email: "",
  phone: "",
  company: "",
  stage: "",
  revenueRange: "",
  founderState: "",
  source: "website",
});

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);

  const source = params.get("source");
  const team = params.get("team");
  const revenue = params.get("revenue");
  const state = params.get("state");

  console.log("URL PARAMS:", { source, team, revenue, state });

  setFormData((prev) => ({
    ...prev,
    source: source || prev.source,
    stage: team || prev.stage,
    revenueRange: revenue || prev.revenueRange,
    founderState: state || prev.founderState,
  }));

  if (state === "dependency") {
    setDynamicHook("Your business still depends on you more than it should.");
  } else if (state === "inconsistent") {
    setDynamicHook("Your team is not executing consistently without you.");
  } else if (state === "growth_heavy") {
    setDynamicHook("Growth is happening — but it feels heavier, not easier.");
  } else {
    setDynamicHook("");
  }
}, []);

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / questions.length) * 100);

  const insightScores = useMemo(() => {
    return questions.map((question) => ({
      area: question.area,
      score: answers[question.id] ?? 0,
    }));
  }, [answers]);

  const totalScore = useMemo(() => {
    return Object.values(answers).reduce((sum, value) => sum + value, 0);
  }, [answers]);

  const result = getResultType(totalScore);

  const isHighValue =
    totalScore <= 22 ||
  formData.stage.includes("50–100") ||
  formData.stage.includes("100–200") ||
  formData.stage.includes("200+");


  const weakestInsight = useMemo(() => {
    const completedInsights = insightScores.filter((item) => item.score > 0);
    if (completedInsights.length === 0) return null;

    const sorted = [...completedInsights].sort((a, b) => a.score - b.score);
    return sorted[0];
  }, [insightScores]);

  const founderStateValue = formData.founderState || "";
  const leadTemperature = useMemo(
    () => getLeadTemperature(totalScore, founderStateValue, formData.revenueRange),
    [totalScore, founderStateValue, formData.revenueRange]
  );

  const handleAnswer = (value: number) => {
    // Fire quiz_started only on first interaction
    if (currentIndex === 0) {
      trackEvent("quiz_started");
    }
    const updatedAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(updatedAnswers);

    const isLastQuestion = currentIndex === questions.length - 1;

    if (isLastQuestion) {
      setShowLeadCapture(true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const handleBack = () => {
    if (showLeadCapture) {
      setShowLeadCapture(false);
      setCurrentIndex(questions.length - 1);
      return;
    }

    if (showResults) {
      setShowResults(false);
      setShowLeadCapture(true);
      return;
    }

    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email.includes("@")) {
      alert("Please enter a valid email");
      return;
    }

    if (!formData.name || !formData.email) return;

    const teamSizeToZoho = formData.stage || "";

    const founderStateMap: Record<string, string> = {
      "Business depends on me": "dependency",
      "The business depends on me more than I expected": "dependency",
      "I thought I could step back, but I can’t": "dependency",
      "Team is inconsistent": "inconsistent",
      "We have systems, but they don’t fully work": "inconsistent",
      "Growth feels heavy": "growth_heavy",
      "Things are stable": "stable",
    };

    const weakestAreaApiValue = weakestInsight?.area ?? "";
    // founderStateValue and leadTemperature are now available at the top level

    let intentTag = "Low Urgency";

    if (
      weakestAreaApiValue === "Management Capability" ||
      weakestAreaApiValue === "Firefighting"
    ) {
      intentTag = "Execution Problem";
      
    }

    if (totalScore <= 22) {
      intentTag = "High Intent";
    }

    console.log("FORM DATA BEFORE SUBMIT:", formData);
    console.log("teamSizeToZoho:", teamSizeToZoho);
    console.log("founderStateValue:", founderStateValue);

    trackEvent("form_submitted", {
      lead_temperature: leadTemperature,
      source: formData.source,
    });

    await fetch("/api/zoho/lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        source: formData.source,
        teamSize: teamSizeToZoho,
        revenueRange: formData.revenueRange,
        founderState: founderStateValue,
        score: totalScore,
        weakestArea: weakestAreaApiValue,
        resultType: result.title,
        temperature: leadTemperature,
        intentTag,
      }),
    });

    setShowLeadCapture(false);
    setShowResults(true);
    trackEvent("quiz_completed", {
      result_type: result.title,
      score: totalScore,
    });
  };

  const resetAssessment = () => {
    setAnswers({});
    setCurrentIndex(0);
    setShowLeadCapture(false);
    setShowResults(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      stage: "",
      revenueRange: "",
      founderState: "",
      source: "website",
    });
  };

  return (
    <main
      className={`${montserrat.variable} ${cormorant.variable} min-h-screen bg-[#F6F1E8] text-[#1A604B]`}
    >
      <section className="border-b border-[#1A604B]/10">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">
          <div className="max-w-3xl">
            <p className="font-[var(--font-montserrat)] text-xs font-semibold uppercase tracking-[0.24em] text-[#1A604B]/60">
  For founders of ₹10Cr+ businesses
</p>

<h1 className="mt-3 font-[var(--font-montserrat)] text-3xl font-bold leading-tight md:text-5xl">
  You built a successful business. But now the business runs you.
</h1>

{dynamicHook && (
  <p className="mt-4 text-lg text-[#1A604B]/70">
    {dynamicHook}
  </p>
)}

<p className="mt-4 font-[var(--font-cormorant)] text-2xl leading-relaxed text-[#1A604B]/85">
  You’ve already solved revenue. From the outside, it looks like you’ve made it.
</p>

<p className="mt-4 font-[var(--font-cormorant)] text-2xl leading-relaxed text-[#1A604B]/80">
  But internally, you’re still carrying the decisions, the pressure, and the weight of the business — while your team struggles to truly take ownership.
</p>

<p className="mt-4 font-[var(--font-cormorant)] text-2xl leading-relaxed text-[#1A604B]/80">
  This diagnostic reveals your <span className="font-semibold">Founder Dependency Score™</span> and shows whether the real issue lies in your <span className="font-semibold">Purpose, People, Performance, or Profit</span>.
</p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
          {!showLeadCapture && !showResults && (
            <>
              <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="rounded-[2rem] border border-[#1A604B]/10 bg-white/70 p-8 shadow-[0_18px_60px_rgba(26,96,75,0.08)] backdrop-blur-sm md:p-10"
                >
                  <div>
                    <div className="h-2 w-full rounded-full bg-[#1A604B]/10">
                      <div
                        className="h-2 rounded-full bg-[#1A604B] transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <p className="font-[var(--font-montserrat)] text-xs uppercase tracking-[0.18em] text-[#1A604B]/55">
                        {`Question ${currentIndex + 1} of ${questions.length}`}
                      </p>

                      <p className="font-[var(--font-montserrat)] text-xs uppercase tracking-[0.18em] text-[#1A604B]/55">
                        {`${progress}%`}
                      </p>
                    </div>
                  </div>

                  <h2 className="mt-5 font-[var(--font-montserrat)] text-2xl font-bold leading-tight md:text-4xl">
                    {currentQuestion.text}
                  </h2>

                  <div className="mt-8 grid gap-4">
                    {currentQuestion.options.map((option) => (
                      <motion.button
                        key={option.label}
                        type="button"
                        whileHover={{ y: -2, scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleAnswer(option.value)}
                        className="rounded-[1.5rem] border border-[#1A604B]/12 bg-[#F6F1E8] px-5 py-5 text-left transition duration-200 hover:border-[#1A604B]/25 hover:bg-[#EFE4D2] hover:shadow-[0_10px_30px_rgba(26,96,75,0.06)]"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1A604B] font-[var(--font-montserrat)] text-sm font-semibold text-[#F6F1E8] shadow-sm">
                            {option.value}
                          </div>
                          <p className="font-[var(--font-cormorant)] text-2xl leading-none text-[#1A604B]/92">
                            {option.label}
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  <div className="mt-8 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={currentIndex === 0}
                      className="inline-flex items-center justify-center rounded-full border border-[#1A604B]/15 px-5 py-3 font-[var(--font-montserrat)] text-xs font-semibold uppercase tracking-[0.16em] text-[#1A604B] transition hover:bg-[#1A604B]/5 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Back
                    </button>

                    <p className="font-[var(--font-cormorant)] text-lg text-[#1A604B]/70">
  Answer honestly — not based on what should be true, but what is actually happening inside the business.
</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-6"
              >
                <div className="rounded-[2rem] bg-[#1A604B] p-8 text-[#F6F1E8] shadow-[0_18px_60px_rgba(26,96,75,0.12)]">
                  <p className="font-[var(--font-montserrat)] text-xs font-semibold uppercase tracking-[0.2em] text-[#C1A77C]">
                    The Founder Freedom System™
                  </p>

                  <p className="mt-5 font-[var(--font-cormorant)] text-2xl leading-relaxed text-[#F6F1E8]/90">
                    Most consulting tries to fix the business from the outside.
                  </p>

                  <p className="mt-4 font-[var(--font-cormorant)] text-2xl leading-relaxed text-[#F6F1E8]/90">
                    We don’t.
                  </p>

                  <p className="mt-4 font-[var(--font-cormorant)] text-2xl leading-relaxed text-[#F6F1E8]/90">
                    Because the real problem is not just the business. It’s how the business has been built around the founder.
                  </p>

                  <div className="mt-6 space-y-4">
                    {[
                      {
                        title: "Purpose",
                        copy: "Why the founder has lost direction, clarity, or meaning after achieving success.",
                      },
                      {
                        title: "People",
                        copy: "Why managers are not truly owning execution, accountability, and decisions.",
                      },
                      {
                        title: "Performance",
                        copy: "Why the business keeps slipping into inconsistency, firefighting, and dependency.",
                      },
                      {
                        title: "Profit",
                        copy: "Why growth exists — but still feels heavy, fragile, or unfulfilling.",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="rounded-2xl border border-white/10 px-4 py-4 transition duration-200 hover:bg-white/5"
                      >
                        <p className="font-[var(--font-montserrat)] text-sm font-semibold uppercase tracking-[0.14em] text-[#C1A77C]">
                          {item.title}
                        </p>
                        <p className="mt-2 font-[var(--font-cormorant)] text-xl leading-relaxed text-[#F6F1E8]/92">
                          {item.copy}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-[#1A604B]/10 bg-[#EFE4D2] p-8 shadow-[0_18px_50px_rgba(26,96,75,0.04)]">
  <p className="font-[var(--font-montserrat)] text-xs font-semibold uppercase tracking-[0.2em] text-[#1A604B]/60">
    What this really solves
  </p>
  <p className="mt-4 font-[var(--font-cormorant)] text-2xl leading-relaxed text-[#1A604B]/88">
    This is not a motivation problem. And it is not just an operational issue.
  </p>
  <p className="mt-4 font-[var(--font-cormorant)] text-2xl leading-relaxed text-[#1A604B]/88">
    It is a founder dependency problem — where the founder carries too much, managers own too little, and growth keeps coming at a personal cost.
  </p>
</div>
              </motion.div>
            </div>

              <section className="mt-24 text-center">
                <h2 className="font-[var(--font-montserrat)] text-3xl font-bold md:text-4xl">
                  Get Your Founder Dependency Score™
                </h2>

                <p className="mt-6 font-[var(--font-cormorant)] text-2xl text-[#1A604B]/85">
                  In less than 3 minutes, this diagnostic reveals how dependent your business still is on you — and where that dependency is actually coming from.
                </p>

                <div className="mt-10 grid gap-4 md:grid-cols-2">
                  {[
                    "Founder Dependency Score™",
                    "Weakest Pressure Area",
                    "Execution & Management Gaps",
                    "Recommended Next Step",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-[#1A604B]/10 bg-white px-6 py-4 text-lg text-[#1A604B]"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-24">
                <div className="mx-auto max-w-5xl">
                <section>
                  <h2 className="text-center font-[var(--font-montserrat)] text-3xl font-bold md:text-4xl">
                    What this actually fixes
                  </h2>

                  <div className="mt-12 grid gap-10 md:grid-cols-2">
                    <div>
                      <h3 className="font-semibold text-[#1A604B]">On the founder side</h3>
                      <ul className="mt-4 space-y-3 text-lg text-[#1A604B]/85">
                        <li>Constant mental overload and decision fatigue</li>
                        <li>Loss of purpose after achieving revenue success</li>
                        <li>Feeling stuck in operations instead of strategy</li>
                        <li>Growth at the cost of time, health, and clarity</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-[#1A604B]">On the business side</h3>
                      <ul className="mt-4 space-y-3 text-lg text-[#1A604B]/85">
                        <li>Managers who cannot truly run departments</li>
                        <li>No real KPI-based accountability</li>
                        <li>Inconsistent execution and firefighting</li>
                        <li>A business that still depends on the founder</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="mt-24 rounded-[2rem] bg-[#F8F5F0] p-10">
                  <h2 className="text-center font-[var(--font-montserrat)] text-3xl font-bold md:text-4xl">
                    What you actually walk away with
                  </h2>

                  <div className="mt-10 grid gap-6 md:grid-cols-2">
                    {[
                      "A 3-year strategic growth roadmap",
                      "Department-level KPIs and accountability systems",
                      "Clear management structures and ownership",
                      "Execution rhythms and performance tracking",
                      "A culture blueprint aligned to your vision",
                      "A business that runs with less founder dependency",
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-xl border border-[#1A604B]/10 bg-white px-6 py-4 text-lg text-[#1A604B]"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="mt-24 rounded-[2rem] bg-[#F8F5F0] p-10">
                  <h2 className="text-center font-[var(--font-montserrat)] text-3xl font-bold md:text-4xl">
                    What changes
                  </h2>

                  <div className="mt-10 grid gap-6 md:grid-cols-2">
                    {[
                      ["Founder stuck in operations", "Founder focused on strategy"],
                      ["Managers dependent on founder", "Managers accountable and capable"],
                      ["Constant firefighting", "Structured execution"],
                      ["Growth feels heavy", "Growth feels controlled and scalable"],
                      ["Success costing life", "Success aligned with freedom"],
                    ].map(([before, after]) => (
                      <div
                        key={before}
                        className="rounded-xl border border-[#1A604B]/10 bg-white p-6"
                      >
                        <p className="text-sm text-[#1A604B]/60">Before</p>
                        <p className="text-lg text-[#1A604B]">{before}</p>

                        <p className="mt-4 text-sm text-[#1A604B]/60">After</p>
                        <p className="text-lg font-semibold text-[#1A604B]">{after}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="mt-24 text-center">
                  <h2 className="font-[var(--font-montserrat)] text-3xl font-bold md:text-4xl">
                    See what is still keeping your business dependent on you
                  </h2>

                  <p className="mt-6 font-[var(--font-cormorant)] text-2xl text-[#1A604B]/85">
                    If you’ve already built success but still feel the pressure, this is the next step.
                  </p>

                  <button className="mt-8 rounded-full bg-[#1A604B] px-10 py-4 text-lg text-white hover:bg-[#154c3c]">
                    Get My Founder Dependency Score
                  </button>

                  <p className="mt-4 text-sm text-[#1A604B]/60">
                    Only relevant for founders serious about reducing dependency and building a business that runs without them.
                  </p>

                  <p className="mt-4 text-xs text-[#1A604B]/50">
                    Limited weekly slots to ensure depth of engagement.
                  </p>
                </section>
                </div>
              </section>
            </>
          )}

          {showLeadCapture && !showResults && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="mx-auto max-w-3xl rounded-[2rem] border border-[#1A604B]/10 bg-white/70 p-8 shadow-[0_18px_60px_rgba(26,96,75,0.08)] backdrop-blur-sm md:p-10"
            >
              <p className="font-[var(--font-montserrat)] text-xs font-semibold uppercase tracking-[0.22em] text-[#C1A77C]">
                Final Step
              </p>

              <h2 className="mt-5 font-[var(--font-montserrat)] text-3xl font-bold leading-tight md:text-4xl">
  Unlock your Founder Dependency Score™
</h2>

              <p className="mt-5 font-[var(--font-cormorant)] text-2xl leading-relaxed text-[#1A604B]/85">
  Most founders think the issue is growth.
</p>

<p className="font-[var(--font-cormorant)] text-2xl leading-relaxed text-[#1A604B]/85">
  This will show you whether the real pressure is coming from Purpose, People, Performance, or Profit — and how dependent the business still is on you.
</p>
              <form onSubmit={handleLeadSubmit} className="mt-8 grid gap-5">
                <div>
                  <label className="mb-2 block font-[var(--font-montserrat)] text-xs font-semibold uppercase tracking-[0.16em] text-[#1A604B]/65">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full rounded-2xl border border-[#1A604B]/12 bg-[#F6F1E8] px-5 py-4 font-[var(--font-cormorant)] text-2xl text-[#1A604B] outline-none transition focus:border-[#1A604B]/30"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block font-[var(--font-montserrat)] text-xs font-semibold uppercase tracking-[0.16em] text-[#1A604B]/65">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="w-full rounded-2xl border border-[#1A604B]/12 bg-[#F6F1E8] px-5 py-4 font-[var(--font-cormorant)] text-2xl text-[#1A604B] outline-none transition focus:border-[#1A604B]/30"
                    placeholder="name@company.com"
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block font-[var(--font-montserrat)] text-xs font-semibold uppercase tracking-[0.16em] text-[#1A604B]/65">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      className="w-full rounded-2xl border border-[#1A604B]/12 bg-[#F6F1E8] px-5 py-4 font-[var(--font-cormorant)] text-2xl text-[#1A604B] outline-none transition focus:border-[#1A604B]/30"
                      placeholder="+91 ..."
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-[var(--font-montserrat)] text-xs font-semibold uppercase tracking-[0.16em] text-[#1A604B]/65">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, company: e.target.value }))
                      }
                      className="w-full rounded-2xl border border-[#1A604B]/12 bg-[#F6F1E8] px-5 py-4 font-[var(--font-cormorant)] text-2xl text-[#1A604B] outline-none transition focus:border-[#1A604B]/30"
                      placeholder="Your company"
                    />
                  </div>
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block font-[var(--font-montserrat)] text-xs font-semibold uppercase tracking-[0.16em] text-[#1A604B]/65">
                      Business Stage
                    </label>
                    <select
                      value={formData.stage}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, stage: e.target.value }))
                      }
                      className="w-full rounded-2xl border border-[#1A604B]/12 bg-[#F6F1E8] px-5 py-4 font-[var(--font-cormorant)] text-2xl text-[#1A604B] outline-none transition focus:border-[#1A604B]/30"
                      required
                    >
                      <option value="">Select your business stage</option>
                      <option value="Under 50 employees">Under 50 employees</option>
                      <option value="50–100 employees">50–100 employees</option>
                      <option value="100–200 employees">100–200 employees</option>
                      <option value="200+ employees">200+ employees</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block font-[var(--font-montserrat)] text-xs font-semibold uppercase tracking-[0.16em] text-[#1A604B]/65">
                      Revenue Range
                    </label>
                    <select
                      value={formData.revenueRange}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          revenueRange: e.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-[#1A604B]/12 bg-[#F6F1E8] px-5 py-4 font-[var(--font-cormorant)] text-2xl text-[#1A604B] outline-none transition focus:border-[#1A604B]/30"
                      required
                    >
                      <option value="">Select your revenue range</option>
                      <option value="Under ₹5 Cr">Under ₹5 Cr</option>
                      <option value="₹5-10 Cr">₹5-10 Cr</option>
                      <option value="₹10-25 Cr">₹10-25 Cr</option>
                      <option value="₹25+ Cr">₹25+ Cr</option>
                    </select>
                  </div>
                </div>

                <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center justify-center rounded-full border border-[#1A604B]/15 px-5 py-3 font-[var(--font-montserrat)] text-xs font-semibold uppercase tracking-[0.16em] text-[#1A604B] transition hover:bg-[#1A604B]/5"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full bg-[#1A604B] px-8 py-4 font-[var(--font-montserrat)] text-xs font-semibold uppercase tracking-[0.16em] text-[#F6F1E8] transition hover:opacity-90"
                  >
                    View My Result
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]"
            >
              <div className="rounded-[2rem] border border-[#1A604B]/10 bg-white/70 p-8 shadow-[0_18px_60px_rgba(26,96,75,0.06)] md:p-10">
                <p className="font-[var(--font-montserrat)] text-xs font-semibold uppercase tracking-[0.22em] text-[#C1A77C]">
                  Your Founder Clarity Breakdown
                </p>

                <h2 className="mt-5 font-[var(--font-montserrat)] text-3xl font-bold leading-tight md:text-5xl">
                  {result.title}
                </h2>

                <div className="mt-4 inline-flex rounded-full bg-[#EFE4D2] px-4 py-2 font-[var(--font-montserrat)] text-xs font-semibold uppercase tracking-[0.14em] text-[#1A604B]/80">
                  {result.shortLabel}
                </div>

                <div className="mt-8 rounded-[1.5rem] bg-[#1A604B] px-6 py-6 text-[#F6F1E8]">
                  <p className="font-[var(--font-montserrat)] text-xs font-semibold uppercase tracking-[0.16em] text-[#C1A77C]">
                    Founder Clarity Score
                  </p>
                  <p className="mt-3 font-[var(--font-montserrat)] text-4xl font-bold md:text-5xl">
                    {totalScore}/35
                  </p>
                </div>

                <p className="mt-6 font-[var(--font-cormorant)] text-2xl leading-relaxed text-[#1A604B]/88">
                  This is why the business still feels heavier than it should.
                </p>
                <p className="mt-3 font-[var(--font-cormorant)] text-2xl leading-relaxed text-[#1A604B]/88">
                  Growth may be happening — but control, ownership, and clarity are not keeping up.
                </p>

                <p className="mt-6 text-xl text-[#1A604B]">
                  This pattern does not fix itself.
                </p>

                <p className="mt-2 text-lg text-[#1A604B]/80">
                  If nothing changes, your business will continue to depend on you — even as it grows.
                </p>

                <a
                  href="https://bookings.zoho.in/..."
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-block rounded-full bg-[#1A604B] px-8 py-4 text-white"
                >
                  Book a Founder Strategy Call
                </a>

                <p className="mt-3 text-sm text-[#1A604B]/60">
                  45-min private strategy session. No generic advice. Only for serious founders.
                </p>

                <p className="mt-8 font-[var(--font-cormorant)] text-2xl leading-relaxed text-[#1A604B]/88">
                  {result.summary}
                </p>

                <div className="mt-6 rounded-[1.5rem] border border-[#1A604B]/10 bg-[#1A604B]/10 p-6">
                  <p className="font-[var(--font-montserrat)] text-xs font-semibold uppercase tracking-[0.16em] text-[#1A604B]/60">
                    What this usually means
                  </p>
                  <p className="mt-3 font-[var(--font-cormorant)] text-2xl leading-relaxed text-[#1A604B]/88">
                    {result.insight}
                  </p>
                </div>

                <div className="mt-6 rounded-[1.5rem] border border-[#1A604B]/10 bg-[#EFE4D2] p-6">
                  <p className="font-[var(--font-montserrat)] text-xs font-semibold uppercase tracking-[0.16em] text-[#1A604B]/60">
                    Area needing the most attention
                  </p>
                  <p className="mt-3 font-[var(--font-cormorant)] text-3xl leading-tight text-[#1A604B]">
                    {weakestInsight?.area ?? "Not available yet"}
                  </p>
                </div>

                <p className="mt-6 font-[var(--font-cormorant)] text-2xl leading-relaxed text-[#1A604B]/88">
                  {result.cta}
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  {isHighValue ? (
                    <a
                      href="https://zbooking.in/oJB2P"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full bg-[#1A604B] px-8 py-4 font-[var(--font-montserrat)] text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:opacity-90"
                      onClick={() =>
                        trackEvent("booking_clicked", {
                          source: formData.source,
                          lead_temperature: leadTemperature,
                        })
                      }
                    >
                      Book a Strategy Call
                    </a>
                  ) : (
                    <a
                      href="/founder-clarity"
                      className="inline-flex items-center justify-center rounded-full bg-[#1A604B] px-8 py-4 font-[var(--font-montserrat)] text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:opacity-90"
                    >
                      See the Next Step
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={resetAssessment}
                    className="inline-flex items-center justify-center rounded-full border border-[#1A604B]/15 px-8 py-4 font-[var(--font-montserrat)] text-xs font-semibold uppercase tracking-[0.16em] text-[#1A604B] transition hover:bg-[#1A604B]/5"
                  >
                    Retake Assessment
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[2rem] bg-[#1A604B] p-8 text-[#F6F1E8]">
                  <p className="font-[var(--font-montserrat)] text-xs font-semibold uppercase tracking-[0.2em] text-[#C1A77C]">
                    Operating Snapshot
                  </p>

                  <div className="mt-6 space-y-4">
                    {insightScores.map((item) => (
                      <div
                        key={item.area}
                        className="rounded-2xl border border-white/10 px-5 py-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-[var(--font-cormorant)] text-2xl leading-tight">
                              {item.area}
                            </p>
                            <p className="mt-2 font-[var(--font-montserrat)] text-xs uppercase tracking-[0.16em] text-[#F6F1E8]/70">
                              {getInsightStatus(item.score)}
                            </p>
                          </div>

                          <div className="rounded-full bg-white/10 px-4 py-2 font-[var(--font-montserrat)] text-sm font-semibold">
                            {item.score}/5
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-[#1A604B]/10 bg-white/65 p-8">
                  <p className="font-[var(--font-montserrat)] text-xs font-semibold uppercase tracking-[0.2em] text-[#1A604B]/60">
                    Next Step
                  </p>
                  <p className="mt-4 font-[var(--font-cormorant)] text-2xl leading-relaxed text-[#1A604B]/88">
                    This doesn’t fix itself. Left unaddressed, this pattern keeps increasing pressure on you as the business grows.
                    The next step is to resolve this at the root — not manage the symptoms.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}