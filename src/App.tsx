import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, CheckCircle2, GraduationCap } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Badge className="mb-3 bg-emerald-600">Towngas Open Talent Marketplace</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 md:text-6xl">
            Choose A Website
          </h1>
          <p className="mt-3 max-w-3xl text-lg text-slate-600">
            The intern and employee experiences now live as separate websites, while still sharing the same data source.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="rounded-3xl border-0 bg-white shadow-xl">
            <CardContent className="p-8">
              <div className="mb-4 flex items-center gap-3">
                <GraduationCap className="text-emerald-600" />
                <h2 className="text-2xl font-bold text-slate-900">Intern Website</h2>
              </div>
              <p className="mb-6 text-slate-600">
                Interns fill in their profile and only see their best-fit Friday projects.
              </p>
              <Button
                onClick={() => {
                  window.location.href = "/intern/";
                }}
                className="rounded-2xl bg-emerald-600 hover:bg-emerald-700"
              >
                Open Intern Website
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 bg-white shadow-xl">
            <CardContent className="p-8">
              <div className="mb-4 flex items-center gap-3">
                <Building2 className="text-sky-600" />
                <h2 className="text-2xl font-bold text-slate-900">Employee Website</h2>
              </div>
              <p className="mb-6 text-slate-600">
                Employees submit project needs, browse interns, and keep a shortlist of favorites.
              </p>
              <Button
                onClick={() => {
                  window.location.href = "/employee/";
                }}
                className="rounded-2xl bg-sky-600 hover:bg-sky-700"
              >
                Open Employee Website
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 bg-slate-950 text-white shadow-xl lg:col-span-2">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <CheckCircle2 className="text-emerald-300" />
                <h3 className="text-xl font-bold">Shared Backend</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-200">
                <li><b>Separate sites:</b> intern and employee are now different entry points.</li>
                <li><b>Shared data:</b> both still read and write the same Supabase tables.</li>
                <li><b>Cleaner access model:</b> UI is separated now, and authentication can be layered on later.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
