"use client";

import React, { ReactNode } from "react";
import { State } from "wagmi";

export default function AppKitProvider({
  children,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  return <>{children}</>;
}
