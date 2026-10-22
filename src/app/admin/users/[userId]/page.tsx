import { notFound } from "next/navigation";
import { MemberDetailPage } from "../../components/users/MemberDetailPage";
import { getAdminUserDetail } from "../../data/userDetails";

interface Props {
  params: Promise<{ userId: string }>;
}

export default async function AdminUserDetailRoute({ params }: Props) {
  const { userId } = await params;
  const detail = getAdminUserDetail(Number(userId));

  if (!detail) notFound();

  return <MemberDetailPage detail={detail} />;
}
