import { getJobCategory, JOB_OPTIONS } from "../../data/options";
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
  const category = getJobCategory(job);

  return (
    <div className="flex flex-col gap-7">
    <SelectionChipGroup
      label="전문 직무"
      hint="하나만"
      options={JOB_OPTIONS}
      mode="radio"
      selected={[job]}
      onChange={(value) => onJobChange(value)}
    />
    <SelectionChipGroup
      label="강의 주제"
      hint="1개 이상"
      options={category?.topics.map(({ name }) => name) ?? []}
      mode="checkbox"
      selected={topics}
      onChange={(topic) => onToggleTopic(topic)}
    />
    </div>
  );
};
