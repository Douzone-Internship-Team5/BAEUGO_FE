import { getJobCategory } from "../../data/options";
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
  const category = getJobCategory(job);

  return (
    <div className="flex flex-col gap-6">
      {category && (
        <SelectionChipGroup
          label={category.name}
          hint="관심 주제"
          options={category.topics.map(({ name }) => name)}
          mode="checkbox"
          selected={selectedTopics}
          onChange={(topic) => onToggleTopic(topic)}
        />
      )}
    </div>
  );
};
