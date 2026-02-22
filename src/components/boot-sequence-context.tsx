"use client";

import { createContext, useContext } from "react";

export const BootSequenceContext = createContext<boolean>(false);

export function useBootComplete() {
  return useContext(BootSequenceContext);
}
