import { Tables } from "@/types/database.types";
import { getContrastText } from "../tag-utils";

interface TagsListProps {
  submissionTags: { tag_id: number }[];
  allTags: Tables<"tags">[];
}

export function TagsList({ submissionTags, allTags }: TagsListProps) {
  if (!submissionTags?.length)
    return <span className="text-gray-500">No tags</span>;

  return (
    <div className="flex flex-wrap gap-1">
      {submissionTags.map((st) => {
        const tag = allTags.find((t) => t.id === st.tag_id);
        if (!tag) return null;
        return (
          <span
            key={tag.id}
            className="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium"
            style={{
              backgroundColor: tag.hex,
              color: getContrastText(tag.hex),
            }}
          >
            {tag.name}
          </span>
        );
      })}
    </div>
  );
}
