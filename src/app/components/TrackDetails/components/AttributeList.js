import TrackAttributeChip from "../../TrackAttribute_Chip";
import { parseAttributeValues } from "../utils";

export default function AttributeList({ attribute = "", values = [] }) {
  const parsedValues = parseAttributeValues(values);

  if (!parsedValues.length) return null;

  const label = attribute.charAt(0).toUpperCase() + attribute.slice(1);

  return (
    <div className="flex w-full gap-4">
      <p className="w-16 shrink-0 font-bold text-muted-foreground">
        {label}:
      </p>

      <div className="flex w-3/4 gap-2 overflow-x-auto pb-3">
        {parsedValues.map((value) => (
          <TrackAttributeChip variant="dot" key={value} attribute={value} />
        ))}
      </div>
    </div>
  );
}