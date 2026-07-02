import { useEffect, useState } from "react";

/** Simulates an async data fetch so the demo can show polished loading states. */
export function useSimulatedLoad(ms = 600): boolean {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return loading;
}

/** Tracks a transient "refreshing" state for refresh buttons. */
export function useRefresh(ms = 900): [boolean, () => void] {
  const [refreshing, setRefreshing] = useState(false);
  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), ms);
  };
  return [refreshing, refresh];
}
