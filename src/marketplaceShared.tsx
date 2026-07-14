import React, { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { isSupabaseEnabled, supabase } from "@/lib/supabase";

export const projectThemes = [
  "Digital & AI",
  "Data & Analytics",
  "ESG & Sustainability",
  "Customer Experience",
  "Engineering Innovation",
  "Safety & Operations",
  "Corporate Communications",
  "Finance & Efficiency",
  "HR & Employee Experience",
  "New Energy",
  "Business Research",
  "Open Innovation",
];

export const departments = [
  "Engineering",
  "Gas Network",
  "Finance",
  "Customer Installation",
  "Marketing",
  "Corporate Communications",
  "Sustainability / ESG",
  "Corporate Affairs",
  "Human Resources",
  "Safety / Operations",
  "Procurement",
  "Group Legal",
  "Other",
];

export const skills = [
  "Data analysis",
  "Excel / Power BI",
  "AI tools",
  "Coding / automation",
  "Engineering knowledge",
  "Finance analysis",
  "Marketing",
  "Design",
  "Writing / storytelling",
  "Research",
  "ESG knowledge",
  "Customer mindset",
  "Presentation skills",
  "Project coordination",
  "Process improvement",
  "Chinese writing",
  "English writing",
  "Video / media production",
  "UX review",
];

const defaultDepartmentNeeds = [
  {
    id: "need-1",
    department: "Customer Service",
    sponsor: "Customer Service Team",
    title: "Customer App Journey Review",
    themes: ["Customer Experience", "Digital & AI"],
    skills: ["Customer mindset", "UX review", "Presentation skills"],
    output: "Customer journey map + improvement suggestions",
    value: "Supports better digital adoption and service experience.",
    mentorTime: "30 minutes per week",
    confidentiality: "Low",
  },
  {
    id: "need-2",
    department: "Sustainability / ESG",
    sponsor: "ESG / Corporate Communications",
    title: "Youth-Friendly Sustainability Storytelling",
    themes: ["ESG & Sustainability", "Corporate Communications"],
    skills: ["ESG knowledge", "Writing / storytelling", "Design"],
    output: "Infographic / short campaign concept",
    value: "Makes sustainability messages easier for young audiences to understand.",
    mentorTime: "15 minutes per week",
    confidentiality: "Low",
  },
  {
    id: "need-3",
    department: "IT / Digital",
    sponsor: "Digital Team",
    title: "AI Tool Testing for Internal Workflow",
    themes: ["Digital & AI", "Finance & Efficiency"],
    skills: ["AI tools", "Process improvement", "Presentation skills"],
    output: "Testing report + practical use cases",
    value: "Identifies small automation opportunities and improves staff productivity.",
    mentorTime: "30 minutes per week",
    confidentiality: "Medium",
  },
  {
    id: "need-4",
    department: "Engineering",
    sponsor: "Engineering Team",
    title: "Smart Meter Data Storytelling Prototype",
    themes: ["Engineering Innovation", "Data & Analytics", "Customer Experience"],
    skills: ["Engineering knowledge", "Data analysis", "Excel / Power BI"],
    output: "Dashboard prototype + simple explanation pack",
    value: "Helps translate technical data into useful customer and business insight.",
    mentorTime: "1 hour per week",
    confidentiality: "Medium",
  },
  {
    id: "need-5",
    department: "Safety / Operations",
    sponsor: "HSE / Operations Team",
    title: "Safety Micro-Learning Content Sprint",
    themes: ["Safety & Operations", "Corporate Communications"],
    skills: ["Design", "Writing / storytelling", "Video / media production"],
    output: "Storyboard + sample safety learning content",
    value: "Improves safety awareness through more engaging communication.",
    mentorTime: "30 minutes per week",
    confidentiality: "Low",
  },
  {
    id: "need-6",
    department: "New Energy",
    sponsor: "New Energy Team",
    title: "Hydrogen / New Energy Benchmarking Study",
    themes: ["New Energy", "ESG & Sustainability", "Business Research"],
    skills: ["Research", "ESG knowledge", "Presentation skills"],
    output: "Benchmarking summary + opportunity map",
    value: "Supports awareness of new energy trends and future business opportunities.",
    mentorTime: "30 minutes per week",
    confidentiality: "Low",
  },
];

const sampleInterns = [
  {
    id: "intern-1",
    name: "Intern A",
    study: "Engineering",
    desiredTeams: ["Engineering", "New Energy"],
    desiredThemes: ["Engineering Innovation", "New Energy", "Data & Analytics"],
    skills: ["Engineering knowledge", "Excel / Power BI", "Data analysis", "Presentation skills"],
    goals: "Learn how technical projects connect with future energy and customer value.",
    availability: "4 Fridays",
  },
  {
    id: "intern-2",
    name: "Intern B",
    study: "Business / Marketing",
    desiredTeams: ["Marketing", "Corporate Communications", "Customer Service"],
    desiredThemes: ["Customer Experience", "Corporate Communications", "ESG & Sustainability"],
    skills: ["Writing / storytelling", "Design", "Customer mindset", "Research"],
    goals: "Build communication, campaign and customer insight experience.",
    availability: "4 Fridays",
  },
  {
    id: "intern-3",
    name: "Intern C",
    study: "Data Analytics / IT",
    desiredTeams: ["IT / Digital", "Finance", "Customer Service"],
    desiredThemes: ["Digital & AI", "Data & Analytics", "Finance & Efficiency"],
    skills: ["AI tools", "Coding / automation", "Excel / Power BI", "Data analysis"],
    goals: "Apply analytics and AI tools to real business workflow problems.",
    availability: "4 Fridays",
  },
];

export type Intern = {
  id: string;
  name: string;
  study: string;
  desiredTeams: string[];
  desiredThemes: string[];
  skills: string[];
  goals: string;
  availability: string;
};

export type Need = {
  id: string;
  department: string;
  sponsor: string;
  title: string;
  themes: string[];
  skills: string[];
  output: string;
  value: string;
  mentorTime: string;
  confidentiality: string;
};

type InternRow = {
  id: string;
  name: string;
  study: string;
  desired_teams: string[];
  desired_themes: string[];
  skills: string[];
  goals: string;
  availability: string;
};

type NeedRow = {
  id: string;
  department: string;
  sponsor: string;
  title: string;
  themes: string[];
  skills: string[];
  output: string;
  value: string;
  mentor_time: string;
  confidentiality: string;
};

export type SubmitNotice = {
  type: "success" | "error" | "info";
  message: string;
};

function unique(arr: string[]) {
  return [...new Set(arr)].filter(Boolean);
}

function overlap(a: string[] = [], b: string[] = []) {
  return a.filter((x) => b.includes(x));
}

export function scoreMatch(intern: Intern, need: Need) {
  const themeOverlap = overlap(intern.desiredThemes, need.themes);
  const skillOverlap = overlap(intern.skills, need.skills);
  const teamOverlap = intern.desiredTeams.includes(need.department) ? [need.department] : [];
  const score = themeOverlap.length * 40 + skillOverlap.length * 25 + teamOverlap.length * 35;
  return { score, themeOverlap, skillOverlap, teamOverlap };
}

export function matchQuality(score: number) {
  if (score >= 130) return { label: "Excellent Match", color: "bg-emerald-600", width: 100 };
  if (score >= 85) return { label: "Strong Match", color: "bg-sky-600", width: 78 };
  if (score >= 45) return { label: "Possible Match", color: "bg-amber-500", width: 52 };
  return { label: "Explore Further", color: "bg-slate-500", width: 28 };
}

function internToRow(intern: Intern): InternRow {
  return {
    id: intern.id,
    name: intern.name,
    study: intern.study,
    desired_teams: intern.desiredTeams,
    desired_themes: intern.desiredThemes,
    skills: intern.skills,
    goals: intern.goals,
    availability: intern.availability,
  };
}

function rowToIntern(row: InternRow): Intern {
  return {
    id: row.id,
    name: row.name,
    study: row.study,
    desiredTeams: row.desired_teams ?? [],
    desiredThemes: row.desired_themes ?? [],
    skills: row.skills ?? [],
    goals: row.goals,
    availability: row.availability,
  };
}

function needToRow(need: Need): NeedRow {
  return {
    id: need.id,
    department: need.department,
    sponsor: need.sponsor,
    title: need.title,
    themes: need.themes,
    skills: need.skills,
    output: need.output,
    value: need.value,
    mentor_time: need.mentorTime,
    confidentiality: need.confidentiality,
  };
}

function rowToNeed(row: NeedRow): Need {
  return {
    id: row.id,
    department: row.department,
    sponsor: row.sponsor,
    title: row.title,
    themes: row.themes ?? [],
    skills: row.skills ?? [],
    output: row.output,
    value: row.value,
    mentorTime: row.mentor_time,
    confidentiality: row.confidentiality,
  };
}

export function useMarketplaceData() {
  const [internForm, setInternForm] = useState({
    name: "",
    study: "",
    desiredTeams: [] as string[],
    desiredThemes: [] as string[],
    skills: [] as string[],
    goals: "",
    availability: "4 Fridays",
  });
  const [deptForm, setDeptForm] = useState({
    department: "",
    sponsor: "",
    title: "",
    themes: [] as string[],
    skills: [] as string[],
    output: "",
    value: "",
    mentorTime: "30 minutes per week",
    confidentiality: "Low",
  });
  const [employeeNeeds, setEmployeeNeeds] = useState<Need[]>(defaultDepartmentNeeds);
  const [internPool, setInternPool] = useState<Intern[]>(sampleInterns);
  const [syncState, setSyncState] = useState("Local mode (data resets on refresh)");
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSubmittingIntern, setIsSubmittingIntern] = useState(false);
  const [isSubmittingNeed, setIsSubmittingNeed] = useState(false);
  const [internNotice, setInternNotice] = useState<SubmitNotice | null>(null);
  const [needNotice, setNeedNotice] = useState<SubmitNotice | null>(null);
  const [favoriteInternIds, setFavoriteInternIds] = useState<string[]>([]);

  useEffect(() => {
    if (!isSupabaseEnabled || !supabase) {
      return;
    }

    const client = supabase;

    async function loadMarketplaceData() {
      setIsSyncing(true);
      setSyncState("Syncing from Supabase...");

      const [internResult, needResult] = await Promise.all([
        client.from("intern_profiles").select("*").order("created_at", { ascending: false }),
        client.from("department_needs").select("*").order("created_at", { ascending: false }),
      ]);

      if (internResult.error || needResult.error) {
        setSyncState("Supabase sync failed; using local defaults");
        setIsSyncing(false);
        return;
      }

      const remoteInterns = (internResult.data as InternRow[]).map(rowToIntern);
      const remoteNeeds = (needResult.data as NeedRow[]).map(rowToNeed);

      if (remoteInterns.length > 0) {
        setInternPool(remoteInterns);
      }

      if (remoteNeeds.length > 0) {
        setEmployeeNeeds(remoteNeeds);
      }

      setSyncState("Supabase connected");
      setIsSyncing(false);
    }

    void loadMarketplaceData();
  }, []);

  useEffect(() => {
    if (!internNotice) return;
    const timer = window.setTimeout(() => setInternNotice(null), 3500);
    return () => window.clearTimeout(timer);
  }, [internNotice]);

  useEffect(() => {
    if (!needNotice) return;
    const timer = window.setTimeout(() => setNeedNotice(null), 3500);
    return () => window.clearTimeout(timer);
  }, [needNotice]);

  const fallbackIntern = internPool[0] ?? sampleInterns[0];
  const fallbackNeed = employeeNeeds[0] ?? defaultDepartmentNeeds[0];

  const activeIntern =
    internForm.name || internForm.desiredThemes.length || internForm.skills.length
      ? {
          id: "current-intern",
          name: internForm.name || "Current Intern",
          study: internForm.study || "Not specified",
          desiredTeams: internForm.desiredTeams,
          desiredThemes: internForm.desiredThemes,
          skills: internForm.skills,
          goals: internForm.goals,
          availability: internForm.availability,
        }
      : fallbackIntern;

  const activeNeed =
    deptForm.title || deptForm.themes.length || deptForm.skills.length
      ? {
          id: "current-need",
          department: deptForm.department || "Not specified",
          sponsor: deptForm.sponsor || "Department Sponsor",
          title: deptForm.title || "Department Friday Project",
          themes: deptForm.themes,
          skills: deptForm.skills,
          output: deptForm.output || "Practical prototype / short proposal",
          value: deptForm.value || "Creates practical innovation capacity for the department.",
          mentorTime: deptForm.mentorTime,
          confidentiality: deptForm.confidentiality,
        }
      : fallbackNeed;

  const internToNeeds = useMemo(
    () =>
      employeeNeeds
        .map((need) => ({ need, ...scoreMatch(activeIntern, need) }))
        .sort((a, b) => b.score - a.score),
    [activeIntern, employeeNeeds],
  );

  const needToInterns = useMemo(
    () =>
      internPool
        .map((intern) => ({ intern, ...scoreMatch(intern, activeNeed) }))
        .sort((a, b) => b.score - a.score),
    [activeNeed, internPool],
  );

  const marketplaceStats = useMemo(() => {
    const allThemes = unique([
      ...employeeNeeds.flatMap((need) => need.themes),
      ...internPool.flatMap((intern) => intern.desiredThemes),
    ]);
    const totalPossibleMatches = internPool.reduce(
      (sum, intern) => sum + employeeNeeds.filter((need) => scoreMatch(intern, need).score >= 45).length,
      0,
    );

    return {
      interns: internPool.length,
      needs: employeeNeeds.length,
      themes: allThemes.length,
      matches: totalPossibleMatches,
    };
  }, [employeeNeeds, internPool]);

  const favoriteInterns = useMemo(
    () => internPool.filter((intern) => favoriteInternIds.includes(intern.id)),
    [favoriteInternIds, internPool],
  );

  const noticeClass = (notice: SubmitNotice) =>
    notice.type === "success"
      ? "text-emerald-700"
      : notice.type === "error"
        ? "text-red-600"
        : "text-slate-600";

  const toggleListValue = <T extends Record<string, unknown>>(
    setter: React.Dispatch<React.SetStateAction<T>>,
    key: keyof T,
    value: string,
  ) => {
    setter((prev) => {
      const list = ((prev[key] as string[]) ?? []).filter(Boolean);
      return {
        ...prev,
        [key]: list.includes(value) ? list.filter((item) => item !== value) : [...list, value],
      };
    });
  };

  const toggleFavoriteIntern = (internId: string) => {
    setFavoriteInternIds((prev) =>
      prev.includes(internId) ? prev.filter((id) => id !== internId) : [...prev, internId],
    );
  };

  const resetIntern = () =>
    setInternForm({
      name: "",
      study: "",
      desiredTeams: [],
      desiredThemes: [],
      skills: [],
      goals: "",
      availability: "4 Fridays",
    });

  const resetNeed = () =>
    setDeptForm({
      department: "",
      sponsor: "",
      title: "",
      themes: [],
      skills: [],
      output: "",
      value: "",
      mentorTime: "30 minutes per week",
      confidentiality: "Low",
    });

  const addNeedToPool = async () => {
    const newNeed: Need = { ...activeNeed, id: `need-${Date.now()}` };
    setIsSubmittingNeed(true);
    setNeedNotice({ type: "info", message: "Submitting department need..." });

    if (!isSupabaseEnabled || !supabase) {
      setEmployeeNeeds((prev) => [newNeed, ...prev]);
      setSyncState("Saved locally only");
      setNeedNotice({ type: "success", message: "Submitted locally (Supabase not configured)." });
      setIsSubmittingNeed(false);
      return;
    }

    const client = supabase;

    setIsSyncing(true);
    const { data, error } = await client.from("department_needs").insert(needToRow(newNeed)).select("*").single();

    if (error || !data) {
      setSyncState("Supabase write failed (department need)");
      setIsSyncing(false);
      setNeedNotice({
        type: "error",
        message: `Submit failed: ${error?.message ?? "unknown error"}`,
      });
      setIsSubmittingNeed(false);
      return;
    }

    setEmployeeNeeds((prev) => [rowToNeed(data as NeedRow), ...prev]);
    setSyncState("Saved to Supabase");
    setNeedNotice({ type: "success", message: "Department need submitted successfully." });
    setIsSyncing(false);
    setIsSubmittingNeed(false);
  };

  const addInternToPool = async () => {
    const newIntern: Intern = { ...activeIntern, id: `intern-${Date.now()}` };
    setIsSubmittingIntern(true);
    setInternNotice({ type: "info", message: "Submitting intern profile..." });

    if (!isSupabaseEnabled || !supabase) {
      setInternPool((prev) => [newIntern, ...prev]);
      setSyncState("Saved locally only");
      setInternNotice({ type: "success", message: "Submitted locally (Supabase not configured)." });
      setIsSubmittingIntern(false);
      return;
    }

    const client = supabase;

    setIsSyncing(true);
    const { data, error } = await client.from("intern_profiles").insert(internToRow(newIntern)).select("*").single();

    if (error || !data) {
      setSyncState("Supabase write failed (intern)");
      setIsSyncing(false);
      setInternNotice({
        type: "error",
        message: `Submit failed: ${error?.message ?? "unknown error"}`,
      });
      setIsSubmittingIntern(false);
      return;
    }

    setInternPool((prev) => [rowToIntern(data as InternRow), ...prev]);
    setSyncState("Saved to Supabase");
    setInternNotice({ type: "success", message: "Intern profile submitted successfully." });
    setIsSyncing(false);
    setIsSubmittingIntern(false);
  };

  const exportMatch = (label: string) => {
    const topInternNeed = internToNeeds[0];
    const topNeedIntern = needToInterns[0];
    const text = `Towngas Friday Marketplace Match\n\nSite: ${label}\n\nIntern-side top match:\nIntern: ${activeIntern.name}\nMatched Department Project: ${topInternNeed?.need.title}\nDepartment: ${topInternNeed?.need.department}\nMatch Score: ${topInternNeed?.score}\nShared Themes: ${topInternNeed?.themeOverlap.join(", ")}\nShared Skills: ${topInternNeed?.skillOverlap.join(", ")}\n\nDepartment-side top match:\nProject: ${activeNeed.title}\nMatched Intern: ${topNeedIntern?.intern.name}\nIntern Background: ${topNeedIntern?.intern.study}\nMatch Score: ${topNeedIntern?.score}\nShared Themes: ${topNeedIntern?.themeOverlap.join(", ")}\nShared Skills: ${topNeedIntern?.skillOverlap.join(", ")}\n\nMarketplace Stats:\nIntern profiles: ${marketplaceStats.interns}\nDepartment needs: ${marketplaceStats.needs}\nPossible matches: ${marketplaceStats.matches}`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${label.toLowerCase()}-match-summary.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return {
    activeIntern,
    activeNeed,
    addInternToPool,
    addNeedToPool,
    deptForm,
    employeeNeeds,
    exportMatch,
    favoriteInternIds,
    favoriteInterns,
    internForm,
    internNotice,
    internPool,
    internToNeeds,
    isSubmittingIntern,
    isSubmittingNeed,
    isSyncing,
    marketplaceStats,
    needNotice,
    needToInterns,
    noticeClass,
    resetIntern,
    resetNeed,
    setDeptForm,
    setInternForm,
    syncState,
    toggleFavoriteIntern,
    toggleListValue,
  };
}

export function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-4 py-3 text-left shadow-sm transition hover:shadow-md ${
        active
          ? "border-emerald-600 bg-emerald-600 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300"
      }`}
    >
      {children}
    </button>
  );
}

export function MiniBadgeList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Badge key={item} className="border border-emerald-200 bg-white text-emerald-700">
          {item}
        </Badge>
      ))}
    </div>
  );
}

export function MatchBar({ score }: { score: number }) {
  const quality = matchQuality(score);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-700">{quality.label}</span>
        <span className="text-slate-500">Score {score}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full ${quality.color}`} style={{ width: `${quality.width}%` }} />
      </div>
    </div>
  );
}

export function SharedSnapshot({ syncState, isSyncing, marketplaceStats }: {
  syncState: string;
  isSyncing: boolean;
  marketplaceStats: { interns: number; needs: number; themes: number; matches: number };
}) {
  return (
    <Card className="min-w-72 rounded-3xl border-0 bg-white/85 shadow-lg backdrop-blur">
      <CardContent className="p-5">
        <p className="mb-3 text-sm text-slate-600">
          Data mode: <span className="font-semibold">{syncState}</span>
          {isSyncing ? " (working...)" : ""}
        </p>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="rounded-2xl bg-emerald-50 p-3">
            <p className="text-2xl font-bold text-emerald-700">{marketplaceStats.interns}</p>
            <p className="text-xs text-slate-500">Intern profiles</p>
          </div>
          <div className="rounded-2xl bg-sky-50 p-3">
            <p className="text-2xl font-bold text-sky-700">{marketplaceStats.needs}</p>
            <p className="text-xs text-slate-500">Dept needs</p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-3">
            <p className="text-2xl font-bold text-amber-700">{marketplaceStats.themes}</p>
            <p className="text-xs text-slate-500">Themes</p>
          </div>
          <div className="rounded-2xl bg-violet-50 p-3">
            <p className="text-2xl font-bold text-violet-700">{marketplaceStats.matches}</p>
            <p className="text-xs text-slate-500">Possible matches</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
