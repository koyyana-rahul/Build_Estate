import { useEffect, useRef } from "react";

const useAutoRefresh = (refresh, intervalMs) => {
  const refreshRef = useRef(refresh);

  useEffect(() => {
    refreshRef.current = refresh;
  }, [refresh]);

  useEffect(() => {
    let timerId;

    const schedule = () => {
      window.clearTimeout(timerId);
      if (document.visibilityState === "visible") {
        timerId = window.setTimeout(async () => {
          await refreshRef.current();
          schedule();
        }, intervalMs);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshRef.current();
      }
      schedule();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleVisibilityChange);
    schedule();

    return () => {
      window.clearTimeout(timerId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
    };
  }, [intervalMs]);
};

export default useAutoRefresh;
