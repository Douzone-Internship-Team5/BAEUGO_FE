import api from "@/_lib/fetcher";
import type { TodayDto } from "@/types/learning";
export default async function getToday(signal?: AbortSignal) {
  const response = await api.get<TodayDto>({ endpoint: "/me/today", signal });
  if (!response) throw new Error("오늘 학습 정보 응답이 비어 있습니다.");
  return response.data;
}
