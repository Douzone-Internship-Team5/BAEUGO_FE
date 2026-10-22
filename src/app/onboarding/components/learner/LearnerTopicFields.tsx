import { useState } from "react";
import { TOPIC_GROUPS } from "../../data/options";
import { SelectionChipGroup } from "../shared/SelectionChipGroup";

interface Props {
  selectedTopics: string[];
  onToggleTopic: (topic: string) => void;
}

export const LearnerTopicFields = ({ selectedTopics, onToggleTopic }: Props) => {
  const [showMore, setShowMore] = useState(false);
  const visibleGroups = showMore ? TOPIC_GROUPS : TOPIC_GROUPS.slice(0, 2);

  return (
    <div className="flex flex-col gap-6">
      {visibleGroups.map((group) => (
        <SelectionChipGroup
          key={group.name}
          label={group.name}
          hint={group.tag}
          options={group.topics}
          mode="checkbox"
          selected={selectedTopics}
          onChange={(topic) => onToggleTopic(topic)}
        />
      ))}
      <button
        type="button"
        onClick={() => setShowMore((shown) => !shown)}
        aria-expanded={showMore}
        className="self-start border-b border-line-focus py-1 text-[13px] text-muted"
      >
        {showMore ? "다른 직무 주제 접기" : "다른 직무 주제 더 보기"}
      </button>
    </div>
  );
};
