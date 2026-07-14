import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { isSupabaseEnabled, supabase } from "@/lib/supabase";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  Download,
  GraduationCap,
  Heart,
  RotateCcw,
  Search,
  Sparkles,
  Target,
  Users,
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

type Page = "home" | "intern" | "employee";

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

function getPageFromPath(pathname: string): Page {
  if (pathname.startsWith("/intern")) return "intern";
  if (pathname.startsWith("/employee")) return "employee";
  return "home";
}

function getPathForPage(page: Exclude<Page, "home">) {
  return `/${page}`;
}

export default function App() {
  const [page, setPage] = useState<Page>(() => getPageFromPath(window.location.pathname));
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

  useEffect(() => {
    const handlePopState = () => setPage(getPageFromPath(window.location.pathname));
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

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
  }, [activeNeed, internPool]);

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

  const navigate = (nextPage: Exclude<Page, "home">) => {
    window.history.pushState({}, "", getPathForPage(nextPage));
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
    const text = `Towngas Friday Marketplace Match\n\nPage: ${page}\n\nIntern-side top match:\nIntern: ${activeIntern.name}\nMatched Department Project: ${topInternNeed?.need.title}\nDepartment: ${topInternNeed?.need.department}\nMatch Score: ${topInternNeed?.score}\nShared Themes: ${topInternNeed?.themeOverlap.join(", ")}\nShared Skills: ${topInternNeed?.skillOverlap.join(", ")}\n\nDepartment-side top match:\nProject: ${activeNeed.title}\nMatched Intern: ${topNeedIntern?.intern.name}\nIntern Background: ${topNeedIntern?.intern.study}\nMatch Score: ${topNeedIntern?.score}\nShared Themes: ${topNeedIntern?.themeOverlap.join(", ")}\nShared Skills: ${topNeedIntern?.skillOverlap.join(", ")}\n\nMarketplace Stats:\nIntern profiles: ${marketplaceStats.interns}\nDepartment needs: ${marketplaceStats.needs}\nPossible matches: ${marketplaceStats.matches}`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "friday-marketplace-match-summary.txt";
    anchor.click();
    URL.revokeObjectURL(url);
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
  };

  const renderInternPage = () => (
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
            {departments.slice(0, 12).map((department) => (
              <Chip
                key={department}
                active={internForm.desiredTeams.includes(department)}
                onClick={() => toggleListValue(setInternForm, "desiredTeams", department)}
              >
                {department}
              </Chip>
            ))}
          </div>

          <p className="mb-3 font-semibold text-slate-700">Preferred Friday project themes</p>
          <div className="mb-6 grid gap-3 md:grid-cols-3">
            {projectThemes.map((theme) => (
              <Chip
                key={theme}
                active={internForm.desiredThemes.includes(theme)}
                onClick={() => toggleListValue(setInternForm, "desiredThemes", theme)}
              >
                {theme}
              </Chip>
            ))}
          </div>

          <p className="mb-3 font-semibold text-slate-700">Skills / strengths the intern can contribute</p>
          <div className="mb-6 grid gap-3 md:grid-cols-3">
            {skills.map((skill) => (
              <Chip
                key={skill}
                active={internForm.skills.includes(skill)}
                onClick={() => toggleListValue(setInternForm, "skills", skill)}
              >
                {skill}
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
              <RotateCcw className="mr-2" size={18} />
              Reset
            </Button>
          </div>

          {internNotice ? (
            <p className={`mt-3 text-sm font-medium ${noticeClass(internNotice)}`}>{internNotice.message}</p>
          ) : null}
        </CardContent>
      </Card>

      <div className="space-y-6 lg:col-span-2">
        <Card className="rounded-3xl border-0 bg-white shadow-xl">
          <CardContent className="p-6 md:p-8">
            <div className="mb-5 flex items-center gap-3">
              <Sparkles className="text-emerald-600" />
              <div>
                <h3 className="text-xl font-bold text-slate-900">Best-Fit Projects</h3>
                <p className="text-sm text-slate-600">
                  Interns now only see their top two recommendations from the shared marketplace data.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {internToNeeds.slice(0, 2).map(({ need, score, themeOverlap, skillOverlap }) => (
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

        <Card className="rounded-3xl border-0 bg-slate-950 text-white shadow-xl">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <Target className="text-emerald-300" />
              <h3 className="text-xl font-bold">How Matching Works</h3>
            </div>
            <ul className="space-y-3 text-sm text-slate-200">
              <li><b>Theme fit:</b> intern interest matches project themes.</li>
              <li><b>Skill fit:</b> intern strengths match skills needed.</li>
              <li><b>Team fit:</b> intern desired department matches project owner.</li>
              <li><b>Feasibility:</b> project is suitable for 4 Friday sessions.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderEmployeePage = () => (
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
                Employees submit real department needs and compare them against the full intern pool.
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
                {departments.map((department) => (
                  <option key={department}>{department}</option>
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
            {projectThemes.map((theme) => (
              <Chip
                key={theme}
                active={deptForm.themes.includes(theme)}
                onClick={() => toggleListValue(setDeptForm, "themes", theme)}
              >
                {theme}
              </Chip>
            ))}
          </div>

          <p className="mb-3 font-semibold text-slate-700">Skills needed from interns</p>
          <div className="mb-6 grid gap-3 md:grid-cols-3">
            {skills.map((skill) => (
              <Chip
                key={skill}
                active={deptForm.skills.includes(skill)}
                onClick={() => toggleListValue(setDeptForm, "skills", skill)}
              >
                {skill}
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
                {["15 minutes per week", "30 minutes per week", "1 hour per week", "Briefing and final review only"].map((option) => (
                  <option key={option}>{option}</option>
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
                {["Low", "Medium", "High / sensitive", "Not sure"].map((option) => (
                  <option key={option}>{option}</option>
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
              <RotateCcw className="mr-2" size={18} />
              Reset
            </Button>
          </div>

          {needNotice ? (
            <p className={`mt-3 text-sm font-medium ${noticeClass(needNotice)}`}>{needNotice.message}</p>
          ) : null}
        </CardContent>
      </Card>

      <div className="space-y-6 lg:col-span-2">
        <Card className="rounded-3xl border-0 bg-white shadow-xl">
          <CardContent className="p-6 md:p-8">
            <div className="mb-5 flex items-center gap-3">
              <Search className="text-sky-600" />
              <div>
                <h3 className="text-xl font-bold text-slate-900">Recommended Intern Profiles</h3>
                <p className="text-sm text-slate-600">
                  Employees can see the strongest matches for the active department need.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {needToInterns.slice(0, 4).map(({ intern, score, themeOverlap, skillOverlap }) => {
                const isFavorite = favoriteInternIds.includes(intern.id);
                return (
                  <Card key={intern.id} className="rounded-3xl border-slate-100 shadow-sm">
                    <CardContent className="space-y-3 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs text-slate-500">{intern.study}</p>
                          <h4 className="font-bold text-slate-900">{intern.name}</h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleFavoriteIntern(intern.id)}
                          className={`rounded-full border p-2 transition ${
                            isFavorite
                              ? "border-rose-200 bg-rose-50 text-rose-600"
                              : "border-slate-200 bg-white text-slate-500 hover:border-rose-200 hover:text-rose-600"
                          }`}
                          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                        >
                          <Heart className={isFavorite ? "fill-current" : ""} size={16} />
                        </button>
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
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 bg-white shadow-xl">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Employee Shortlist</h3>
                <p className="text-sm text-slate-600">Favorites are stored in this page session for now.</p>
              </div>
              <Badge className="bg-rose-100 text-rose-700">{favoriteInterns.length} saved</Badge>
            </div>

            <div className="space-y-3">
              {favoriteInterns.length > 0 ? (
                favoriteInterns.map((intern) => (
                  <div key={intern.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{intern.name}</p>
                        <p className="text-xs text-slate-500">{intern.study}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleFavoriteIntern(intern.id)}
                        className="text-sm font-medium text-rose-600"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{intern.goals}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-600">
                  Pick favorite interns from the recommendation list or the full directory below.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl border-0 bg-white shadow-xl lg:col-span-5">
        <CardContent className="p-6 md:p-8">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">All Intern Profiles</h3>
              <p className="text-slate-600">Employees can browse the full shared intern pool from this page.</p>
            </div>
            <Badge className="bg-sky-100 text-sky-700">{internPool.length} interns</Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {internPool.map((intern) => {
              const bestNeed = employeeNeeds
                .map((need) => ({ need, ...scoreMatch(intern, need) }))
                .sort((a, b) => b.score - a.score)[0];
              const isFavorite = favoriteInternIds.includes(intern.id);

              return (
                <Card key={intern.id} className="rounded-3xl border-slate-100 shadow-sm">
                  <CardContent className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-slate-900">{intern.name}</h4>
                        <p className="text-sm text-slate-500">{intern.study}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleFavoriteIntern(intern.id)}
                        className={`rounded-full border p-2 transition ${
                          isFavorite
                            ? "border-rose-200 bg-rose-50 text-rose-600"
                            : "border-slate-200 bg-white text-slate-500 hover:border-rose-200 hover:text-rose-600"
                        }`}
                        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Heart className={isFavorite ? "fill-current" : ""} size={16} />
                      </button>
                    </div>
                    <MiniBadgeList items={intern.desiredThemes.slice(0, 3)} />
                    <p className="text-sm text-slate-600">{intern.goals}</p>
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                      <p className="mb-1 text-xs text-slate-500">Current best project match</p>
                      <h5 className="font-semibold text-slate-900">{bestNeed.need.title}</h5>
                      <p className="text-sm text-slate-600">{bestNeed.need.department}</p>
                      <div className="mt-3">
                        <MatchBar score={bestNeed.score} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Badge className="mb-3 bg-emerald-600">Towngas Open Talent Marketplace</Badge>
          <p className="mb-3 text-sm text-slate-600">
            Data mode: <span className="font-semibold">{syncState}</span>
            {isSyncing ? " (working...)" : ""}
          </p>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 md:text-6xl">
                Friday Match Portal
              </h1>
              <p className="mt-3 max-w-4xl text-lg text-slate-600">
                One shared data source, with simpler role-based pages for interns and employees.
              </p>
            </div>
            <Card className="min-w-72 rounded-3xl border-0 bg-white/85 shadow-lg backdrop-blur">
              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-3">
                  <Target className="text-emerald-600" />
                  <h3 className="font-bold text-slate-900">Shared Snapshot</h3>
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

        <div className="mb-6 flex flex-wrap gap-3">
          <Button
            onClick={() => navigate("intern")}
            className={`rounded-2xl ${
              page === "intern" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-white text-slate-900 hover:bg-slate-50"
            }`}
          >
            <GraduationCap className="mr-2" size={18} />
            Intern Page
          </Button>
          <Button
            onClick={() => navigate("employee")}
            className={`rounded-2xl ${
              page === "employee" ? "bg-sky-600 hover:bg-sky-700" : "bg-white text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Building2 className="mr-2" size={18} />
            Employee Page
          </Button>
          <Button onClick={exportMatch} variant="outline" className="rounded-2xl bg-white">
            <Download className="mr-2" size={18} />
            Export Match Summary
          </Button>
        </div>

        {page === "home" ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="rounded-3xl border-0 bg-white shadow-xl">
              <CardContent className="p-8">
                <div className="mb-4 flex items-center gap-3">
                  <GraduationCap className="text-emerald-600" />
                  <h2 className="text-2xl font-bold text-slate-900">Intern Experience</h2>
                </div>
                <p className="mb-6 text-slate-600">
                  Interns only fill in their profile and see the top one or two project matches from the shared database.
                </p>
                <Button onClick={() => navigate("intern")} className="rounded-2xl bg-emerald-600 hover:bg-emerald-700">
                  Open `/intern`
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 bg-white shadow-xl">
              <CardContent className="p-8">
                <div className="mb-4 flex items-center gap-3">
                  <Building2 className="text-sky-600" />
                  <h2 className="text-2xl font-bold text-slate-900">Employee Experience</h2>
                </div>
                <p className="mb-6 text-slate-600">
                  Employees submit needs, browse all intern profiles, and keep a quick shortlist of favorites.
                </p>
                <Button onClick={() => navigate("employee")} className="rounded-2xl bg-sky-600 hover:bg-sky-700">
                  Open `/employee`
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 bg-slate-950 text-white shadow-xl lg:col-span-2">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <CheckCircle2 className="text-emerald-300" />
                  <h3 className="text-xl font-bold">Current Setup</h3>
                </div>
                <ul className="space-y-3 text-sm text-slate-200">
                  <li><b>Shared data:</b> both pages still use the same intern and department records.</li>
                  <li><b>Simple routing:</b> use `/intern` and `/employee` without adding a new backend.</li>
                  <li><b>Next upgrade:</b> authentication can be added later if you want true access control.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        ) : page === "intern" ? (
          renderInternPage()
        ) : (
          renderEmployeePage()
        )}
      </div>
    </div>
  );
}
