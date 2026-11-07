"use client";

import useCodes from "@/api/codes/useCodes";
import { RadioCardGroup } from "../shared/RadioCardGroup";
import { SelectionChipGroup } from "../shared/SelectionChipGroup";

interface Props {
  situation: string;
  job: string;
  onSituationChange: (value: string) => void;
  onJobChange: (value: string) => void;
}

export const LearnerSituationFields = ({
  situation,
  job,
  onSituationChange,
  onJobChange,
}: Props) => {
  const { data: codes } = useCodes();
  return (
  <div className="flex flex-col gap-7">
    <section className="flex flex-col gap-3" aria-labelledby="situation-heading">
      <h2 id="situation-heading" className="text-[15px] font-medium">현재 상황</h2>
      <RadioCardGroup
        label="현재 상황"
        options={codes?.currentStatuses.map(({ label }) => label) ?? []}
        value={situation}
        onChange={onSituationChange}
      />
    </section>
    <SelectionChipGroup
      label="희망 직무"
      hint="필수 · 하나만 골라 주세요"
      options={codes?.jobCategories.map(({ label }) => label) ?? []}
      mode="radio"
      selected={[job]}
      onChange={(value) => onJobChange(value)}
    />
  </div>
  );
};
