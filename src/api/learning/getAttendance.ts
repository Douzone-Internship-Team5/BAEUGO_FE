import api from "@/_lib/fetcher";
import type { AttendanceDto } from "@/types/learning";
export default async function getAttendance(year: number, month: number, signal?: AbortSignal) {
  const response = await api.get<AttendanceDto>({ endpoint: `/me/attendance?year=${year}&month=${month}`, signal });
  if (!response) throw new Error("출석 정보 응답이 비어 있습니다.");
  return response.data;
}
