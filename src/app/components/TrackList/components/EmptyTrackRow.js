import { Table } from "@heroui/react";

export default function EmptyTrackRow({ colSpan }) {
  return (
    <Table.Row key="empty">
      <Table.Cell
        colSpan={colSpan}
        className="py-5 text-center text-muted-foreground bg-transparent hover:bg-transparent border-0"
      >
        No tracks found
      </Table.Cell>
    </Table.Row>
  );
}