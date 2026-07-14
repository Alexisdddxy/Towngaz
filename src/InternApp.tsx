import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, GraduationCap, RotateCcw, Sparkles, Target, Users } from "lucide-react";
import {
  Chip,
  MatchBar,
  SharedSnapshot,
  departments,
  projectThemes,
  skills,
  useMarketplaceData,
} from "@/marketplaceShared";

export default function InternApp() {
  const {
    addInternToPool,
    exportMatch,
    internForm,
    internNotice,
    internToNeeds,
    isSubmittingIntern,
    isSyncing,
    marketplaceStats,
    noticeClass,
    resetIntern,
    setInternForm,
    syncState,
    toggleListValue,
  } = useMarketplaceData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Badge className="mb-3 bg-emerald-600">Intern Website</Badge>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 md:text-6xl">
                Friday Match For Interns
              </h1>
              <p className="mt-3 max-w-4xl text-lg text-slate-600">
                Interns submit their interests and only see the top project matches from the shared marketplace.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button
                  onClick={() => {
                    window.location.href = "/";
                  }}
                  variant="outline"
                  className="rounded-2xl bg-white"
                >
                  Back To Home
                </Button>
                <Button
                  onClick={() => {
                    window.location.href = "/employee/";
                  }}
                  variant="outline"
                  className="rounded-2xl bg-white"
                >
                  Go To Employee Website
                </Button>
                <Button onClick={() => exportMatch("intern")} variant="outline" className="rounded-2xl bg-white">
                  <Download className="mr-2" size={18} />
                  Export Match Summary
                </Button>
              </div>
            </div>
            <SharedSnapshot syncState={syncState} isSyncing={isSyncing} marketplaceStats={marketplaceStats} />
          </div>
        </motion.div>

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
                    Pick the teams, themes and strengths you want your Friday work to focus on.
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
                {departments.map((department) => (
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
                  {isSubmittingIntern ? "Submitting..." : "Add Intern To Pool"}
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
                      This intern website only shows the top two recommendations.
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
      </div>
    </div>
  );
}
