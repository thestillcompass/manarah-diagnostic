"use client";

import { useMemo, useState } from "react";
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
    | "Mental Load"
    | "Emotional Reality"
    | "Team Alignment"
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
};

const questions: Question[] = [
  {
    id: 1,
    area: "Founder Dependency",
    text: "If you step away from your business for a few days, what actually happens?",
    options: [
      { label: "Everything slows down or stops", value: 1 },
      { label: "Things move, but I stay involved", value: 2 },
      { label: "Team manages, I’m still backbone", value: 3 },
      { label: "Business runs smoothly without me", value: 5 },
    ],
  },
  {
    id: 2,
    area: "Mental Load",
    text: "How often does your business occupy your mind, even when you're not working?",
    options: [
      { label: "Constantly — I can’t switch off", value: 1 },
      { label: "Most of the time", value: 2 },
      { label: "Sometimes", value: 3 },
      { label: "Rarely — I have mental space", value: 5 },
    ],
  },
  {
    id: 3,
    area: "Emotional Reality",
    text: "How does running your business feel right now?",
    options: [
      { label: "Exhausting and overwhelming", value: 1 },
      { label: "Heavy and stressful", value: 2 },
      { label: "Demanding but manageable", value: 3 },
      { label: "Structured and in control", value: 5 },
    ],
  },
  {
    id: 4,
    area: "Team Alignment",
    text: "When you communicate your vision or expectations, what actually happens?",
    options: [
      { label: "Team doesn’t follow through", value: 1 },
      { label: "Execution is inconsistent", value: 2 },
      { label: "Some alignment exists", value: 3 },
      { label: "Team is aligned and executes", value: 5 },
    ],
  },
  {
    id: 5,
    area: "Firefighting",
    text: "How much of your time is spent solving problems instead of building the business?",
    options: [
      { label: "Almost all my time", value: 1 },
      { label: "More fixing than building", value: 2 },
      { label: "Balanced between both", value: 3 },
      { label: "Mostly growth and strategy", value: 5 },
    ],
  },
  {
    id: 6,
    area: "Strategic Clarity",
    text: "How clear are you on the next phase of growth for your business?",
    options: [
      { label: "I feel lost or unclear", value: 1 },
      { label: "Ideas, but no direction", value: 2 },
      { label: "Clear, but hard to execute", value: 3 },
      { label: "Clear plan and direction", value: 5 },
    ],
  },
  {
    id: 7,
    area: "Founder Reality",
    text: "Which statement feels closest to your current reality as a founder?",
    options: [
      { label: "Business depends on me", value: 1 },
      { label: "I carry most responsibility", value: 2 },
      { label: "Systems exist, not reliable", value: 3 },
      { label: "Business runs with ownership", value: 5 },
    ],
  },
];

function getResultType(score: number) {
  if (score <= 14) {
    return {
      title: "Founder Under Strain",
      shortLabel: "High Urgency",
      summary:
        "Your business appears to rely heavily on you to function. That usually creates constant mental load, inconsistent execution, and a level of stress that slowly drains both clarity and energy.",
      insight:
        "This is not just a growth problem. It is a founder-capacity problem. The business may be operating, but it is doing so at the cost of your peace, focus, and long-term sustainability.",
      cta:
        "The next step is to reduce founder dependency, restore strategic clarity, and install the structures your business needs to move forward without constantly pulling you back in.",
    };
  }

  if (score <= 22) {
    return {
      title: "Founder Bottleneck",
      shortLabel: "Priority Shift Needed",
      summary:
        "There is momentum in the business, but too much still flows through you. Your team may be active, but not fully aligned, and progress likely depends on your ongoing involvement.",
      insight:
        "At this stage, most founders feel busy, responsible, and stretched — yet still unsure why the business is not moving with more consistency or ease.",
      cta:
        "The next step is to strengthen leadership, accountability, and execution so the business can grow without increasing the pressure on you.",
    };
  }

  if (score <= 29) {
    return {
      title: "Growth Under Pressure",
      shortLabel: "Strong Potential",
      summary:
        "Your business has meaningful foundations in place, but the internal systems may not yet be strong enough to support growth with full confidence.",
      insight:
        "This is often the stage where growth still happens, but it feels heavier than it should. Without stronger alignment and clearer execution rhythms, scale can begin to create strain.",
      cta:
        "The next step is to reinforce clarity, structure, and leadership ownership so growth becomes sustainable rather than stressful.",
    };
  }

  return {
    title: "Scale-Ready Foundation",
    shortLabel: "Advanced Stage",
    summary:
      "Your business appears to have a strong base of clarity, ownership, and operating structure. The challenge now is refinement, not rescue.",
    insight:
      "At this level, the focus is not on fixing chaos. It is on sharpening leadership, improving strategic execution, and building a business that scales without compromising peace or purpose.",
    cta:
      "The next step is to strengthen what already works, deepen leadership capability, and create the systems that support the next level of growth.",
  };
}

function getInsightStatus(score: number) {
  if (score >= 4) return "Strong";
  if (score >= 3) return "Moderate";
  return "Needs Attention";
}

export default function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    stage: "",
  });

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
    formData.stage.toLowerCase().includes("established") ||
    formData.stage.toLowerCase().includes("scaling");

  const weakestInsight = useMemo(() => {
    const completedInsights = insightScores.filter((item) => item.score > 0);
    if (completedInsights.length === 0) return null;

    const sorted = [...completedInsights].sort((a, b) => a.score - b.score);
    return sorted[0];
  }, [insightScores]);

  const handleAnswer = (value: number) => {
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

  const handleLeadSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.email) return;

    // TODO:
    // Send formData + answers + totalScore + insightScores + result.title to your API route
    // Push into Zoho CRM

    setShowLeadCapture(false);
    setShowResults(true);
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
              Manarah Consultants
            </p>

            <h1 className="mt-3 font-[var(--font-montserrat)] text-3xl font-bold leading-tight md:text-5xl">
              Founder Clarity Diagnostic
            </h1>

            <p className="mt-4 font-[var(--font-cormorant)] text-2xl leading-relaxed text-[#1A604B]/85">
  This is not a typical business assessment. It is a reflection of how your
  business is really operating — and how that may be impacting you as the founder.
</p>
          </div>

          <div className="mt-8">
            <div className="h-2 w-full rounded-full bg-[#1A604B]/10">
              <div
                className="h-2 rounded-full bg-[#1A604B] transition-all duration-500 ease-out"
                style={{ width: `${showResults ? 100 : progress}%` }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between">
              <p className="font-[var(--font-montserrat)] text-xs uppercase tracking-[0.18em] text-[#1A604B]/55">
                {showResults
                  ? "Assessment complete"
                  : showLeadCapture
                    ? "One final step"
                    : `Question ${currentIndex + 1} of ${questions.length}`}
              </p>

              <p className="font-[var(--font-montserrat)] text-xs uppercase tracking-[0.18em] text-[#1A604B]/55">
                {showResults ? "100%" : `${progress}%`}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
          {!showLeadCapture && !showResults && (
            <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="rounded-[2rem] border border-[#1A604B]/10 bg-white/70 p-8 shadow-[0_18px_60px_rgba(26,96,75,0.08)] backdrop-blur-sm md:p-10"
                >
                  <p className="font-[var(--font-montserrat)] text-xs font-semibold uppercase tracking-[0.22em] text-[#C1A77C]">
                    {currentQuestion.area}
                  </p>

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
  Choose the answer that feels most true — not what you think it should be.
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
                    What this assesses
                  </p>

                  <div className="mt-6 space-y-4">
                    {[
                      "Founder Dependency",
                      "Financial Sustainability",
                      "Team Ownership",
                      "Execution Consistency",
                      "Leadership Depth",
                      "Strategic Clarity",
                      "Scalability",
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-white/10 px-4 py-4 transition duration-200 hover:bg-white/5"
                      >
                        <p className="font-[var(--font-cormorant)] text-2xl leading-relaxed">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-[#1A604B]/10 bg-[#EFE4D2] p-8 shadow-[0_18px_50px_rgba(26,96,75,0.04)]">
                  <p className="font-[var(--font-montserrat)] text-xs font-semibold uppercase tracking-[0.2em] text-[#1A604B]/60">
                    Designed for
                  </p>
                  <p className="mt-4 font-[var(--font-cormorant)] text-2xl leading-relaxed text-[#1A604B]/88">
                    Founder-led and family-run businesses seeking stronger
                    structure, leadership alignment, and sustainable growth.
                  </p>
                </div>
              </motion.div>
            </div>
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
                Where should we send your clarity report?
              </h2>

              <p className="mt-5 font-[var(--font-cormorant)] text-2xl leading-relaxed text-[#1A604B]/85">
                You’re about to see where your business is actually getting held back.
                Enter your details to unlock your clarity breakdown.
              </p>

              <p className="font-[var(--font-cormorant)] text-2xl leading-relaxed text-[#1A604B]/85">
                Most founders don’t realise this until they see it clearly.
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
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="w-full rounded-2xl border border-[#1A604B]/12 bg-[#F6F1E8] px-5 py-4 font-[var(--font-cormorant)] text-2xl text-[#1A604B] outline-none transition focus:border-[#1A604B]/30"
                    placeholder="name@company.com"
                    required
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

                <div className="mt-5">
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
                    <option value="Emerging">Emerging</option>
                    <option value="Growing">Growing</option>
                    <option value="Established">Established</option>
                    <option value="Scaling">Scaling</option>
                  </select>
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
                  This is why the business feels heavier than it should.
                </p>
                <p className="mt-3 font-[var(--font-cormorant)] text-2xl leading-relaxed text-[#1A604B]/88">
                  And why growth isn’t translating into clarity or control.
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
                      href="https://your-calendly-link"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full bg-[#1A604B] px-8 py-4 font-[var(--font-montserrat)] text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:opacity-90"
                    >
                      Fix This At The Root
                    </a>
                  ) : (
                    <a
                      href="/founder-clarity"
                      className="inline-flex items-center justify-center rounded-full bg-[#1A604B] px-8 py-4 font-[var(--font-montserrat)] text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:opacity-90"
                    >
                      Speak With Manarah
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