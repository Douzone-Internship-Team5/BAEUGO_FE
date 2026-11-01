"use client";
import { useQuery } from "@tanstack/react-query";
import getToday from "./getToday";
export default function useToday() { return useQuery({ queryKey: ["learning", "today"], queryFn: ({ signal }) => getToday(signal) }); }
