"use client";

import { findJobCategoryByLabel, getTopicsOfCategory } from "@/_lib/codes";
import useCodes from "@/api/codes/useCodes";
import { SelectionChipGroup } from "../shared/SelectionChipGroup";

interface Props {
  job: string;
  topics: string[];
  onJobChange: (job: string) => void;
  onToggleTopic: (topic: string) => void;
}

export const InstructorExpertiseFields = ({
  job,
  topics,
  onJobChange,
  onToggleTopic,
}: Props) => {
  const { data: codes } = useCodes();
  const category = findJobCategoryByLabel(codes, job);

  return (
    <div className="flex flex-col gap-7">
    <SelectionChipGroup
      label="전문 직무"
      hint="하나만"
      options={codes?.jobCategories.map(({ label }) => label) ?? []}
      mode="radio"
      selected={[job]}
      onChange={(value) => onJobChange(value)}
    />
    <SelectionChipGroup
      label="강의 주제"
      hint="1개 이상"
      options={category ? getTopicsOfCategory(codes, category.id).map(({ label }) => label) : []}
      mode="checkbox"
      selected={topics}
      onChange={(topic) => onToggleTopic(topic)}
    />
    </div>
  );
};
