import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  ClipboardList,
  Download,
  Heart,
  RotateCcw,
  Search,
} from "lucide-react";
import {
  Chip,
  MatchBar,
  MiniBadgeList,
  SharedSnapshot,
  departments,
  projectThemes,
  scoreMatch,
  skills,
  useMarketplaceData,
} from "@/marketplaceShared";

export default function EmployeeApp() {
  const {
    addNeedToPool,
    deptForm,
    employeeNeeds,
    exportMatch,
    favoriteInternIds,
    favoriteInterns,
    internPool,
    isSubmittingNeed,
    isSyncing,
    marketplaceStats,
    needNotice,
    needToInterns,
    noticeClass,
    resetNeed,
    setDeptForm,
    syncState,
    toggleFavoriteIntern,
    toggleListValue,
  } = useMarketplaceData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Badge className="mb-3 bg-sky-600">Employee Website</Badge>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 md:text-6xl">
                Match For Employees
              </h1>
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
                    window.location.href = "/intern/";
                  }}
                  variant="outline"
                  className="rounded-2xl bg-white"
                >
                  Go To Intern Website
                </Button>
                <Button onClick={() => exportMatch("employee")} variant="outline" className="rounded-2xl bg-white">
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
                <div className="rounded-2xl bg-sky-100 p-2 text-sky-700">
                  <Building2 />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Employee Department Need</h2>
                  <p className="text-slate-600">
                    Employees describe real business challenges and compare them against the intern pool.
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
                  {isSubmittingNeed ? "Submitting..." : "Add Need To Pool"}
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
                      Employees can compare their active need against the strongest intern matches.
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
                    <p className="text-sm text-slate-600">Favorites are stored locally in this site session.</p>
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
                  <p className="text-slate-600">Employees can browse the full shared intern pool from this site.</p>
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
      </div>
    </div>
  );
}
