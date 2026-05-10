import { Card } from "@heroui/react";

export default function StateCard({ title, message, tone = "danger" }) {
  const toneClass = tone === "danger" ? "text-danger" : "text-primary";

  return (
    <Card className="w-auto bg-secondary p-8 text-foreground shadow-card">
      <div className="flex flex-col items-center gap-4">
        <div className={`text-xl font-bold ${toneClass}`}>{title}</div>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </Card>
  );
}