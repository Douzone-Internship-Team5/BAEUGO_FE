"use client";
import { useQuery } from "@tanstack/react-query";
import getFeed from "./getFeed";
export default function useFeed() { return useQuery({ queryKey: ["learning", "feed"], queryFn: ({ signal }) => getFeed(undefined, signal) }); }
