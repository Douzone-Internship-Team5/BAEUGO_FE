"use client";
import { useQuery } from "@tanstack/react-query";
import getAttendance from "./getAttendance";
export default function useAttendance(year: number, month: number) { return useQuery({ queryKey: ["learning", "attendance", year, month], queryFn: ({ signal }) => getAttendance(year, month, signal) }); }
