import api from "@/_lib/fetcher";
import type { ProfileImageDto, UpdateProfileImageRequest } from "@/types/user";

export default async function updateProfileImage(body: UpdateProfileImageRequest) {
  const payload = "file" in body ? (() => { const form = new FormData(); form.set("file", body.file); return form; })() : { presetId: body.presetId };
  const response = await api.put<ProfileImageDto>({ endpoint: "/users/me/profile-image", body: payload });
  if (!response) throw new Error("프로필 이미지 변경 응답이 비어 있습니다.");
  return response.data;
}
