"use client";

import React, { useCallback, useEffect, useRef } from "react";
import * as jose from "jose";

const Refresher = ({ children }: { children: React.ReactNode }) => {
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const getAccessToken = async () => {
    const res = await fetch("/api/auth/accessToken");

    if (!res.ok) {
      return;
    }

    const accessToken = await res.json();
    return accessToken.token;
  };

  const startRefresh = useCallback(async () => {
    if (timeoutId.current !== null) {
      clearTimeout(timeoutId.current);
    }

    try {
      const accessToken = await getAccessToken();

      if (!accessToken) {
        return;
      }

      const token = await jose.decodeJwt(accessToken);
      const exp = token.exp! * 1000; // Convert to Milliseconds

      const currentTime = Date.now();
      const refreshTime = exp - currentTime - 5000;

      timeoutId.current = setTimeout(() => {
        refreshAccessToken();
        console.log("Access token is refreshing...");
      }, refreshTime);
    } catch {}
  }, []);

  const refreshAccessToken = async () => {
    try {
      const res = await fetch("/api/auth/refresh", { method: "POST" });

      if (!res.ok) {
        console.log("Failed to refresh access token");
        return;
      }
    } catch (err: unknown) {
      console.error(`Error while refreshing the token`, err);
    }

    startRefresh();
  };
  useEffect(() => {
    startRefresh();

    return () => {
      if (timeoutId.current !== null) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [timeoutId, startRefresh]);
  return <div>{children}</div>;
};

export default Refresher;
