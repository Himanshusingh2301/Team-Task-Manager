import { useCallback, useEffect, useState } from "react";

export function useAsyncData(fetcher, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const run = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const result = await fetcher();
      setData(result);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Request failed.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    run().catch(() => {});
  }, [run]);

  return { data, loading, error, refresh: run, setData };
}
