"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AdminClientError } from "@/api/admin/adminClient";

export interface AdminListState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Fetch an admin resource from the BFF in a lightweight, state-driven way
 * (mirrors the mail inbox page pattern). Supports manual refetch via the
 * returned `refetch` and exposes the shared `adminClient` for mutations.
 */
export function useAdminList<T>(fetcher: () => Promise<T[]>): {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setTick] = useState(0);
  const active = useRef(true);

  const refetch = useCallback(() => {
    setTick((t) => t + 1);
  }, []);

  useEffect(() => {
    active.current = true;
    setLoading(true);
    setError(null);
    fetcher()
      .then((result) => {
        if (!active.current) return;
        setData(result);
      })
      .catch((err: unknown) => {
        if (!active.current) return;
        if (err instanceof AdminClientError && err.status === 401) {
          setError("sessionExpired");
        } else {
          setError("loadFailed");
        }
      })
      .finally(() => {
        if (active.current) setLoading(false);
      });
    return () => {
      active.current = false;
    };
  }, [fetcher]);

  return { data, loading, error, refetch };
}

/** Standard "mutate a resource id" handler reused by admin pages. */
export function useAdminMutate<T>(
  fetcher: () => Promise<T[]>,
): AdminListState<T> & { invalidate: () => void } {
  const state = useAdminList(fetcher);
  return { ...state, invalidate: state.refetch };
}
