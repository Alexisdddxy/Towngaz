import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isSupabaseEnabled, supabase } from "@/lib/supabase";
import {
  Building2,
  GraduationCap,
  Shuffle,
  Sparkles,
  Users,
  ClipboardList,
  BarChart3,
  Download,
  RotateCcw,
  CheckCircle2,
  ArrowRightLeft,
  Target,
  Search,
} from "lucide-react";

const projectThemes = [
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

const departments = [
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

const skills = [
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

type Intern = {
  id: string;
  name: string;
  study: string;
  desiredTeams: string[];
  desiredThemes: string[];
  skills: string[];
  goals: string;
  availability: string;
};

type Need = {
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

type SubmitNotice = {
  type: "success" | "error" | "info";
  message: string;
};

function unique(arr: string[]) {
  return [...new Set(arr)].filter(Boolean);
}

function overlap(a: string[] = [], b: string[] = []) {
  return a.filter((x) => b.includes(x));
}

function scoreMatch(intern: Intern, need: Need) {
  const themeOverlap = overlap(intern.desiredThemes, need.themes);
  const skillOverlap = overlap(intern.skills, need.skills);
  const teamOverlap = intern.desiredTeams.includes(need.department) ? [need.department] : [];
  const score = themeOverlap.length * 40 + skillOverlap.length * 25 + teamOverlap.length * 35;
  return { score, themeOverlap, skillOverlap, teamOverlap };
}

function matchQuality(score: number) {
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

export default function App() {
  const [mode, setMode] = useState("intern");
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

  const internToNeeds = useMemo(() => {
    return employeeNeeds
      .map((need) => ({ need, ...scoreMatch(activeIntern, need) }))
      .sort((a, b) => b.score - a.score);
  }, [activeIntern, employeeNeeds]);

  const needToInterns = useMemo(() => {
    return internPool
      .map((intern) => ({ intern, ...scoreMatch(intern, activeNeed) }))
      .sort((a, b) => b.score - a.score);
  }, [internPool, activeNeed]);

  const marketplaceStats = useMemo(() => {
    const allThemes = unique([
      ...employeeNeeds.flatMap((n) => n.themes),
      ...internPool.flatMap((i) => i.desiredThemes),
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
  }, [internPool, employeeNeeds]);

  const toggle = (
    setter: React.Dispatch<React.SetStateAction<any>>,
    key: string,
    value: string,
  ) => {
    setter((prev: any) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((v: string) => v !== value) : [...prev[key], value],
    }));
  };

  const Chip = ({
    active,
    children,
    onClick,
  }: {
    active: boolean;
    children: React.ReactNode;
    onClick: () => void;
  }) => (
    <button
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

  const MiniBadgeList = ({ items }: { items: string[] }) => (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Badge key={item} className="border border-emerald-200 bg-white text-emerald-700">
          {item}
        </Badge>
      ))}
    </div>
  );

  const MatchBar = ({ score }: { score: number }) => {
    const q = matchQuality(score);
    return (
      <div>
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">{q.label}</span>
          <span className="text-slate-500">Score {score}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div className={`h-full ${q.color}`} style={{ width: `${q.width}%` }} />
        </div>
      </div>
    );
  };

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
    const { data, error } = await client
      .from("department_needs")
      .insert(needToRow(newNeed))
      .select("*")
      .single();

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
    const { data, error } = await client
      .from("intern_profiles")
      .insert(internToRow(newIntern))
      .select("*")
      .single();

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

  const exportMatch = () => {
    const topInternNeed = internToNeeds[0];
    const topNeedIntern = needToInterns[0];
    const text = `Towngas Two-Sided Friday Marketplace Match\n\nMode: ${mode}\n\nIntern-side top match:\nIntern: ${activeIntern.name}\nMatched Department Project: ${topInternNeed?.need.title}\nDepartment: ${topInternNeed?.need.department}\nMatch Score: ${topInternNeed?.score}\nShared Themes: ${topInternNeed?.themeOverlap.join(", ")}\nShared Skills: ${topInternNeed?.skillOverlap.join(", ")}\n\nDepartment-side top match:\nProject: ${activeNeed.title}\nMatched Intern: ${topNeedIntern?.intern.name}\nIntern Background: ${topNeedIntern?.intern.study}\nMatch Score: ${topNeedIntern?.score}\nShared Themes: ${topNeedIntern?.themeOverlap.join(", ")}\nShared Skills: ${topNeedIntern?.skillOverlap.join(", ")}\n\nMarketplace Stats:\nIntern profiles: ${marketplaceStats.interns}\nDepartment needs: ${marketplaceStats.needs}\nPossible matches: ${marketplaceStats.matches}`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "two-sided-friday-marketplace-match.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Badge className="mb-3 bg-emerald-600">Towngas Open Source Talent Marketplace</Badge>
          <p className="mb-3 text-sm text-slate-600">
            Data mode: <span className="font-semibold">{syncState}</span>
            {isSyncing ? " (working...)" : ""}
          </p>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 md:text-6xl">
                Two-Sided Friday Match
              </h1>
              <p className="mt-3 max-w-4xl text-lg text-slate-600">
                A live matching website where interns input their desired teams, roles, project themes and
                skills, while employees input department project needs. The platform recommends matches in both
                directions.
              </p>
            </div>
            <Card className="min-w-72 rounded-3xl border-0 bg-white/85 shadow-lg backdrop-blur">
              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-3">
                  <ArrowRightLeft className="text-emerald-600" />
                  <h3 className="font-bold text-slate-900">Marketplace Snapshot</h3>
                </div>
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
          </div>
        </motion.div>

        <Tabs value={mode} onValueChange={setMode} className="space-y-6">
          <TabsList className="grid h-auto w-full grid-cols-3 rounded-3xl bg-white p-2 shadow-md">
            <TabsTrigger value="intern" className="rounded-2xl py-3">
              <GraduationCap className="mr-2" size={18} /> Intern Input
            </TabsTrigger>
            <TabsTrigger value="department" className="rounded-2xl py-3">
              <Building2 className="mr-2" size={18} /> Employee Input
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="rounded-2xl py-3">
              <Shuffle className="mr-2" size={18} /> Match Board
            </TabsTrigger>
          </TabsList>

          <TabsContent value="intern">
            <div className="grid gap-6 lg:grid-cols-5">
              <Card className="rounded-3xl border-0 bg-white shadow-xl lg:col-span-3">
                <CardContent className="p-6 md:p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-2xl bg-emerald-100 p-2 text-emerald-700">
                      <GraduationCap />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Intern Preference Profile</h2>
                      <p className="text-slate-600">
                        Interns select the teams, project themes and skills they want to explore on Fridays.
                      </p>
                    </div>
                  </div>
                  <div className="mb-5 grid gap-4 md:grid-cols-2">
                    <label className="space-y-2">
                      <span className="font-medium text-slate-700">Intern name</span>
                      <input
                        className="w-full rounded-2xl border border-slate-200 p-3"
                        value={internForm.name}
                        onChange={(e) => setInternForm({ ...internForm, name: e.target.value })}
                        placeholder="e.g. Summer Intern 01"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="font-medium text-slate-700">Study background / major</span>
                      <input
                        className="w-full rounded-2xl border border-slate-200 p-3"
                        value={internForm.study}
                        onChange={(e) => setInternForm({ ...internForm, study: e.target.value })}
                        placeholder="e.g. Engineering / Business / IT"
                      />
                    </label>
                  </div>
                  <p className="mb-3 font-semibold text-slate-700">Desired teams / departments</p>
                  <div className="mb-6 grid gap-3 md:grid-cols-3">
                    {departments.slice(0, 12).map((d) => (
                      <Chip key={d} active={internForm.desiredTeams.includes(d)} onClick={() => toggle(setInternForm, "desiredTeams", d)}>
                        {d}
                      </Chip>
                    ))}
                  </div>
                  <p className="mb-3 font-semibold text-slate-700">Preferred Friday project themes</p>
                  <div className="mb-6 grid gap-3 md:grid-cols-3">
                    {projectThemes.map((t) => (
                      <Chip key={t} active={internForm.desiredThemes.includes(t)} onClick={() => toggle(setInternForm, "desiredThemes", t)}>
                        {t}
                      </Chip>
                    ))}
                  </div>
                  <p className="mb-3 font-semibold text-slate-700">Skills / strengths the intern can contribute</p>
                  <div className="mb-6 grid gap-3 md:grid-cols-3">
                    {skills.map((s) => (
                      <Chip key={s} active={internForm.skills.includes(s)} onClick={() => toggle(setInternForm, "skills", s)}>
                        {s}
                      </Chip>
                    ))}
                  </div>
                  <label className="block space-y-2">
                    <span className="font-medium text-slate-700">Learning goal</span>
                    <textarea
                      className="min-h-24 w-full rounded-2xl border border-slate-200 p-3"
                      value={internForm.goals}
                      onChange={(e) => setInternForm({ ...internForm, goals: e.target.value })}
                      placeholder="What kind of business exposure or skill growth is the intern looking for?"
                    />
                  </label>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button
                      onClick={addInternToPool}
                      disabled={isSubmittingIntern}
                      className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
                    >
                      <Users className="mr-2" size={18} />
                      {isSubmittingIntern ? "Submitting..." : "Add Intern to Pool"}
                    </Button>
                    <Button onClick={resetIntern} variant="outline" className="rounded-2xl">
                      <RotateCcw className="mr-2" size={18} /> Reset
                    </Button>
                  </div>
                  {internNotice ? (
                    <p
                      className={`mt-3 text-sm font-medium ${
                        internNotice.type === "success"
                          ? "text-emerald-700"
                          : internNotice.type === "error"
                            ? "text-red-600"
                            : "text-slate-600"
                      }`}
                    >
                      {internNotice.message}
                    </p>
                  ) : null}
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-0 bg-white shadow-xl lg:col-span-2">
                <CardContent className="p-6 md:p-8">
                  <div className="mb-5 flex items-center gap-3">
                    <Sparkles className="text-emerald-600" />
                    <h3 className="text-xl font-bold text-slate-900">Recommended Department Needs</h3>
                  </div>
                  <div className="space-y-4">
                    {internToNeeds.slice(0, 4).map(({ need, score, themeOverlap, skillOverlap }) => (
                      <Card key={need.id} className="rounded-3xl border-slate-100 shadow-sm">
                        <CardContent className="space-y-3 p-4">
                          <div>
                            <p className="text-xs text-slate-500">{need.department}</p>
                            <h4 className="font-bold text-slate-900">{need.title}</h4>
                          </div>
                          <MatchBar score={score} />
                          <div className="text-xs text-slate-600">
                            <b>Shared themes:</b> {themeOverlap.length ? themeOverlap.join(", ") : "None yet"}
                          </div>
                          <div className="text-xs text-slate-600">
                            <b>Shared skills:</b> {skillOverlap.length ? skillOverlap.join(", ") : "None yet"}
                          </div>
                          <p className="text-sm text-slate-600">{need.value}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="department">
            <div className="grid gap-6 lg:grid-cols-5">
              <Card className="rounded-3xl border-0 bg-white shadow-xl lg:col-span-3">
                <CardContent className="p-6 md:p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-2xl bg-sky-100 p-2 text-sky-700">
                      <Building2 />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Employee Department Need</h2>
                      <p className="text-slate-600">
                        Employees submit real department needs that could become Friday 20% intern projects.
                      </p>
                    </div>
                  </div>
                  <div className="mb-5 grid gap-4 md:grid-cols-2">
                    <label className="space-y-2">
                      <span className="font-medium text-slate-700">Department</span>
                      <select
                        className="w-full rounded-2xl border border-slate-200 p-3"
                        value={deptForm.department}
                        onChange={(e) => setDeptForm({ ...deptForm, department: e.target.value })}
                      >
                        <option value="">Select one</option>
                        {departments.map((d) => (
                          <option key={d}>{d}</option>
                        ))}
                      </select>
                    </label>
                    <label className="space-y-2">
                      <span className="font-medium text-slate-700">Sponsor / contact person</span>
                      <input
                        className="w-full rounded-2xl border border-slate-200 p-3"
                        value={deptForm.sponsor}
                        onChange={(e) => setDeptForm({ ...deptForm, sponsor: e.target.value })}
                        placeholder="e.g. Department sponsor name"
                      />
                    </label>
                    <label className="space-y-2 md:col-span-2">
                      <span className="font-medium text-slate-700">Project title / business challenge</span>
                      <input
                        className="w-full rounded-2xl border border-slate-200 p-3"
                        value={deptForm.title}
                        onChange={(e) => setDeptForm({ ...deptForm, title: e.target.value })}
                        placeholder="e.g. Improve customer understanding of smart meters"
                      />
                    </label>
                  </div>
                  <p className="mb-3 font-semibold text-slate-700">Project themes</p>
                  <div className="mb-6 grid gap-3 md:grid-cols-3">
                    {projectThemes.map((t) => (
                      <Chip key={t} active={deptForm.themes.includes(t)} onClick={() => toggle(setDeptForm, "themes", t)}>
                        {t}
                      </Chip>
                    ))}
                  </div>
                  <p className="mb-3 font-semibold text-slate-700">Skills needed from interns</p>
                  <div className="mb-6 grid gap-3 md:grid-cols-3">
                    {skills.map((s) => (
                      <Chip key={s} active={deptForm.skills.includes(s)} onClick={() => toggle(setDeptForm, "skills", s)}>
                        {s}
                      </Chip>
                    ))}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2">
                      <span className="font-medium text-slate-700">Expected output</span>
                      <input
                        className="w-full rounded-2xl border border-slate-200 p-3"
                        value={deptForm.output}
                        onChange={(e) => setDeptForm({ ...deptForm, output: e.target.value })}
                        placeholder="e.g. Dashboard prototype / proposal / infographic"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="font-medium text-slate-700">Mentoring availability</span>
                      <select
                        className="w-full rounded-2xl border border-slate-200 p-3"
                        value={deptForm.mentorTime}
                        onChange={(e) => setDeptForm({ ...deptForm, mentorTime: e.target.value })}
                      >
                        {["15 minutes per week", "30 minutes per week", "1 hour per week", "Briefing and final review only"].map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    </label>
                    <label className="space-y-2">
                      <span className="font-medium text-slate-700">Confidentiality level</span>
                      <select
                        className="w-full rounded-2xl border border-slate-200 p-3"
                        value={deptForm.confidentiality}
                        onChange={(e) => setDeptForm({ ...deptForm, confidentiality: e.target.value })}
                      >
                        {["Low", "Medium", "High / sensitive", "Not sure"].map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    </label>
                    <label className="space-y-2">
                      <span className="font-medium text-slate-700">Business value</span>
                      <input
                        className="w-full rounded-2xl border border-slate-200 p-3"
                        value={deptForm.value}
                        onChange={(e) => setDeptForm({ ...deptForm, value: e.target.value })}
                        placeholder="e.g. Saves time / improves CX / supports ESG"
                      />
                    </label>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button
                      onClick={addNeedToPool}
                      disabled={isSubmittingNeed}
                      className="rounded-2xl bg-sky-600 hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-400"
                    >
                      <ClipboardList className="mr-2" size={18} />
                      {isSubmittingNeed ? "Submitting..." : "Add Need to Pool"}
                    </Button>
                    <Button onClick={resetNeed} variant="outline" className="rounded-2xl">
                      <RotateCcw className="mr-2" size={18} /> Reset
                    </Button>
                  </div>
                  {needNotice ? (
                    <p
                      className={`mt-3 text-sm font-medium ${
                        needNotice.type === "success"
                          ? "text-emerald-700"
                          : needNotice.type === "error"
                            ? "text-red-600"
                            : "text-slate-600"
                      }`}
                    >
                      {needNotice.message}
                    </p>
                  ) : null}
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-0 bg-white shadow-xl lg:col-span-2">
                <CardContent className="p-6 md:p-8">
                  <div className="mb-5 flex items-center gap-3">
                    <Search className="text-sky-600" />
                    <h3 className="text-xl font-bold text-slate-900">Recommended Intern Profiles</h3>
                  </div>
                  <div className="space-y-4">
                    {needToInterns.slice(0, 4).map(({ intern, score, themeOverlap, skillOverlap }) => (
                      <Card key={intern.id} className="rounded-3xl border-slate-100 shadow-sm">
                        <CardContent className="space-y-3 p-4">
                          <div>
                            <p className="text-xs text-slate-500">{intern.study}</p>
                            <h4 className="font-bold text-slate-900">{intern.name}</h4>
                          </div>
                          <MatchBar score={score} />
                          <div className="text-xs text-slate-600">
                            <b>Shared themes:</b> {themeOverlap.length ? themeOverlap.join(", ") : "None yet"}
                          </div>
                          <div className="text-xs text-slate-600">
                            <b>Shared skills:</b> {skillOverlap.length ? skillOverlap.join(", ") : "None yet"}
                          </div>
                          <p className="text-sm text-slate-600">{intern.goals}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="marketplace">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="rounded-3xl border-0 bg-white shadow-xl lg:col-span-2">
                <CardContent className="p-6 md:p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <Shuffle className="text-emerald-600" />
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Live Two-Sided Match Board</h2>
                      <p className="text-slate-600">
                        Shows how intern preferences and employee department needs connect in both directions.
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    {internPool.map((intern) => {
                      const top = employeeNeeds
                        .map((need) => ({ need, ...scoreMatch(intern, need) }))
                        .sort((a, b) => b.score - a.score)[0];
                      return (
                        <Card key={intern.id} className="rounded-3xl border-emerald-100 bg-emerald-50/70">
                          <CardContent className="space-y-3 p-5">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-xs font-semibold text-emerald-700">Intern</p>
                                <h3 className="font-bold text-slate-900">{intern.name}</h3>
                                <p className="text-sm text-slate-600">{intern.study}</p>
                              </div>
                              <GraduationCap className="text-emerald-600" />
                            </div>
                            <MiniBadgeList items={intern.desiredThemes.slice(0, 3)} />
                            <div className="rounded-2xl border border-emerald-100 bg-white p-4">
                              <p className="mb-1 text-xs text-slate-500">Best department project match</p>
                              <h4 className="font-bold text-slate-900">{top.need.title}</h4>
                              <p className="text-sm text-slate-600">{top.need.department}</p>
                              <MatchBar score={top.score} />
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="rounded-3xl border-0 bg-slate-950 text-white shadow-xl">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <Target className="text-emerald-300" />
                      <h3 className="text-xl font-bold">Matching Logic</h3>
                    </div>
                    <ul className="space-y-3 text-sm text-slate-200">
                      <li><b>Theme fit:</b> intern interest matches project themes.</li>
                      <li><b>Skill fit:</b> intern strengths match skills needed.</li>
                      <li><b>Team fit:</b> intern desired department matches project owner.</li>
                      <li><b>Feasibility:</b> project is suitable for 4 Friday sessions.</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="rounded-3xl border-0 bg-white shadow-xl">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <BarChart3 className="text-emerald-600" />
                      <h3 className="text-xl font-bold text-slate-900">Management Value</h3>
                    </div>
                    <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
                      <li>Shows internal demand for Gen Z intern support.</li>
                      <li>Identifies which departments have attractive Friday projects.</li>
                      <li>Captures intern learning interests before placement.</li>
                      <li>Creates measurable data for HR, L&amp;D and graduate programme design.</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="rounded-3xl border-0 bg-white shadow-xl">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <CheckCircle2 className="text-emerald-600" />
                      <h3 className="text-xl font-bold text-slate-900">Booth Use</h3>
                    </div>
                    <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-600">
                      <li>Interns submit preferences before programme start.</li>
                      <li>Employees submit Friday project needs at the booth or through QR code.</li>
                      <li>The website displays top matches instantly.</li>
                      <li>HR reviews and confirms the final Friday allocation.</li>
                    </ol>
                    <Button onClick={exportMatch} className="mt-5 w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700">
                      <Download className="mr-2" size={18} /> Export Match Summary
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
