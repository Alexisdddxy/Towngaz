import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, GraduationCap } from "lucide-react";

export default function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-4 md:p-8">
      <div className="mx-auto w-full max-w-6xl">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <Badge className="mb-3 bg-emerald-600">Towngas Open Talent Marketplace</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 md:text-6xl">
            Choose A Website
          </h1>
          <p className="mx-auto mt-3 max-w-3xl text-lg text-slate-600">
            The intern and employee experiences now live as separate websites, while still sharing the same data source.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
          <Card className="rounded-3xl border-0 bg-white shadow-xl">
            <CardContent className="p-8">
              <div className="mb-4 flex items-center gap-3">
                <GraduationCap className="text-emerald-600" />
                <h2 className="text-2xl font-bold text-slate-900">Intern Website</h2>
              </div>
              <p className="mb-6 text-slate-600">
                Interns fill in their profile and only see their best-fit projects.
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

        </div>
      </div>
    </div>
  );
}
