export type MemberRole = "LEARNER" | "INSTRUCTOR";

export interface AdminUser {
  userId: number;
  email: string;
  name: string;
  accountType: "MEMBER";
  role: MemberRole;
  activeMode: MemberRole;
  isActive: boolean;
}

export const ADMIN_USERS: AdminUser[] = [
  {
    userId: 2,
    email: "learner2@baeugo.test",
    name: "김배우",
    accountType: "MEMBER",
    role: "LEARNER",
    activeMode: "LEARNER",
    isActive: true,
  },
  {
    userId: 3,
    email: "learner3@baeugo.test",
    name: "박수강",
    accountType: "MEMBER",
    role: "LEARNER",
    activeMode: "LEARNER",
    isActive: true,
  },
  {
    userId: 4,
    email: "learner4@baeugo.test",
    name: "이성장",
    accountType: "MEMBER",
    role: "LEARNER",
    activeMode: "LEARNER",
    isActive: false,
  },
  {
    userId: 6,
    email: "instructor1@baeugo.test",
    name: "이하늘",
    accountType: "MEMBER",
    role: "INSTRUCTOR",
    activeMode: "INSTRUCTOR",
    isActive: true,
  },
  {
    userId: 8,
    email: "instructor2@baeugo.test",
    name: "정민재",
    accountType: "MEMBER",
    role: "INSTRUCTOR",
    activeMode: "INSTRUCTOR",
    isActive: true,
  },
  {
    userId: 9,
    email: "instructor3@baeugo.test",
    name: "한지우",
    accountType: "MEMBER",
    role: "INSTRUCTOR",
    activeMode: "INSTRUCTOR",
    isActive: false,
  },
];
