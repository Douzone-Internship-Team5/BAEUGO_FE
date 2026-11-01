"use client";
import { useQuery } from "@tanstack/react-query";
import getCodes from "./getCodes";
export default function useCodes() { return useQuery({ queryKey: ["learning", "codes"], queryFn: ({ signal }) => getCodes(signal) }); }
