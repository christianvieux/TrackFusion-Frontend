import { Table } from "@heroui/react";

export default function TrackTableHeader({ columns, className = "", ...props }) {
  return (
    <Table.Header className={`bg-transparent pb-3 ${className}`} {...props}>
      {columns.map(({ key, label, className: columnClass = "" }) => (
        <Table.Column
          key={key}
          isRowHeader={key === "name"}
          className={`bg-transparent px-3 py-2 text-xs font-bold border-0 after:hidden text-foreground ${columnClass}`}
        >
          {label}
        </Table.Column>
      ))}
    </Table.Header>
  );
}