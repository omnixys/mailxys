class StalwartSessionManagerClass {
  async refresh(): Promise<boolean> {
    try {
      console.log("[Stalwart] Refreshing session");
      const res = await fetch("/api/auth/stalwart/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        console.log("[Stalwart] Refresh ✓");
        return true;
      }

      console.error("[Stalwart] Refresh failed", { status: res.status });
      return false;
    } catch (err) {
      console.error("[Stalwart] Refresh error", {
        error: err instanceof Error ? err.message : "unknown",
      });
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      console.log("[Stalwart] Logging out");
      await fetch("/api/auth/stalwart/session", {
        method: "DELETE",
        credentials: "include",
      });
      console.log("[Stalwart] Logout ✓");
    } catch (err) {
      console.error("[Stalwart] Logout error", {
        error: err instanceof Error ? err.message : "unknown",
      });
    }
  }
}

export const StalwartSessionManager = new StalwartSessionManagerClass();
