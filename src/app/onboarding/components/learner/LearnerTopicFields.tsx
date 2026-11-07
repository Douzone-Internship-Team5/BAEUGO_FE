"use client";

import { findJobCategoryByLabel, getTopicsOfCategory } from "@/_lib/codes";
import useCodes from "@/api/codes/useCodes";
import { SelectionChipGroup } from "../shared/SelectionChipGroup";

interface Props {
  job: string;
  selectedTopics: string[];
  onToggleTopic: (topic: string) => void;
}

export const LearnerTopicFields = ({
  job,
  selectedTopics,
  onToggleTopic,
}: Props) => {
  const { data: codes } = useCodes();
  const category = findJobCategoryByLabel(codes, job);

  return (
    <div className="flex flex-col gap-6">
      {category && (
        <SelectionChipGroup
          label={category.label}
          hint="관심 주제"
          options={getTopicsOfCategory(codes, category.id).map(({ label }) => label)}
          mode="checkbox"
          selected={selectedTopics}
          onChange={(topic) => onToggleTopic(topic)}
        />
      )}
    </div>
  );
};
