import Link from "next/link";
import { OnboardingFrame } from "./OnboardingFrame";

interface Props {
  title: string;
  description: string;
}

export const OnboardingComplete = ({ title, description }: Props) => (
  <OnboardingFrame className="justify-center px-6 py-10">
    <div className="flex flex-col gap-4">
      <div className="flex size-12 items-center justify-center rounded-full bg-success-bg text-xl text-accent" aria-hidden="true">
        ✓
      </div>
      <h1 className="text-[26px] leading-[1.35] font-semibold">{title}</h1>
      <p className="text-sm leading-[1.7] text-muted">{description}</p>
      <Link
        href="/"
        className="mt-4 flex h-[52px] items-center justify-center rounded-full bg-text text-[15px] font-semibold text-bg"
      >
        시작 화면으로
      </Link>
    </div>
  </OnboardingFrame>
);
