import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { RouteFallback } from "@/components/layout/RouteFallback";

const CommandCentre = lazy(() => import("@/pages/CommandCentre"));
const Schedule = lazy(() => import("@/pages/Schedule"));
const Cost = lazy(() => import("@/pages/Cost"));
const Procurement = lazy(() => import("@/pages/Procurement"));
const Resources = lazy(() => import("@/pages/Resources"));
const Quality = lazy(() => import("@/pages/Quality"));
const Hse = lazy(() => import("@/pages/Hse"));
const Documents = lazy(() => import("@/pages/Documents"));
const Predictions = lazy(() => import("@/pages/Predictions"));
const Copilot = lazy(() => import("@/pages/Copilot"));
const Integration = lazy(() => import("@/pages/Integration"));
const DataQuality = lazy(() => import("@/pages/DataQuality"));
const Alerts = lazy(() => import("@/pages/Alerts"));
const Reports = lazy(() => import("@/pages/Reports"));
const Settings = lazy(() => import("@/pages/Settings"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/command-centre" replace />} />
        <Route
          path="/command-centre"
          element={
            <Suspense fallback={<RouteFallback />}>
              <CommandCentre />
            </Suspense>
          }
        />
        <Route path="/schedule" element={<Suspense fallback={<RouteFallback />}><Schedule /></Suspense>} />
        <Route path="/cost" element={<Suspense fallback={<RouteFallback />}><Cost /></Suspense>} />
        <Route path="/procurement" element={<Suspense fallback={<RouteFallback />}><Procurement /></Suspense>} />
        <Route path="/resources" element={<Suspense fallback={<RouteFallback />}><Resources /></Suspense>} />
        <Route path="/quality" element={<Suspense fallback={<RouteFallback />}><Quality /></Suspense>} />
        <Route path="/hse" element={<Suspense fallback={<RouteFallback />}><Hse /></Suspense>} />
        <Route path="/documents" element={<Suspense fallback={<RouteFallback />}><Documents /></Suspense>} />
        <Route path="/predictions" element={<Suspense fallback={<RouteFallback />}><Predictions /></Suspense>} />
        <Route path="/copilot" element={<Suspense fallback={<RouteFallback />}><Copilot /></Suspense>} />
        <Route path="/integration" element={<Suspense fallback={<RouteFallback />}><Integration /></Suspense>} />
        <Route path="/data-quality" element={<Suspense fallback={<RouteFallback />}><DataQuality /></Suspense>} />
        <Route path="/alerts" element={<Suspense fallback={<RouteFallback />}><Alerts /></Suspense>} />
        <Route path="/reports" element={<Suspense fallback={<RouteFallback />}><Reports /></Suspense>} />
        <Route path="/settings" element={<Suspense fallback={<RouteFallback />}><Settings /></Suspense>} />
        <Route path="*" element={<Suspense fallback={<RouteFallback />}><NotFound /></Suspense>} />
      </Route>
    </Routes>
  );
}
