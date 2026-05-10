import { Card } from "@heroui/react";

export default function StateCard({ title, message }) {
  return (
    <Card className="w-full bg-secondary p-8 text-foreground shadow-card">
      <div className="flex flex-col items-center gap-4">
        <div className="text-xl font-bold text-danger">{title}</div>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </Card>
  );
}