"use client";

import React, { ReactNode } from "react";
import { projectId } from "@/config";
import { State } from "wagmi";

if (!projectId) throw new Error("Project ID is not defined");

export default function AppKitProvider({
  children,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  return <>{children}</>;
}
