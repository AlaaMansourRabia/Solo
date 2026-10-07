'use client';

import {useState} from 'react';
import {Button} from '@solo/core/Button';
import {ScrollableArea} from '@solo/core/ScrollableArea';
import {
  Table,
  TableSelectionToolbar,
  useTableSelection,
  useTableSelectionState,
  proportional,
} from '@solo/core/Table';
import type {TableColumn} from '@solo/core/Table';
import {cn} from '@solo/core/utils/cn';

interface User extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  role: string;
}

const baseUsers: Array<Pick<User, 'name' | 'email' | 'role'>> = [
  {name: 'Alice', email: 'alice@example.com', role: 'Engineer'},
  {name: 'Bob', email: 'bob@example.com', role: 'Designer'},
  {name: 'Charlie', email: 'charlie@example.com', role: 'Manager'},
  {name: 'Diana', email: 'diana@example.com', role: 'Engineer'},
  {name: 'Eve', email: 'eve@example.com', role: 'Admin'},
];

const users: User[] = Array.from({length: 40}, (_, index) => {
  const user = baseUsers[index % baseUsers.length];
  return {...user, id: String(index + 1), name: `${user.name} ${index + 1}`};
});

const columns: TableColumn<User>[] = [
  {key: 'name', header: 'Name', width: proportional(1)},
  {key: 'email', header: 'Email', width: proportional(1)},
  {key: 'role', header: 'Role', width: proportional(1)},
];

const styles = {
  page: '[max-block-size:640px] isolate [scrollbar-gutter:stable]',
  metrics: cn(
    'grid [grid-template-columns:repeat(3,minmax(0,1fr))]',
    'gap-(--spacing-3) mbe-(--spacing-6)',
  ),
  metricCard:
    'p-(--spacing-4) rounded-(--radius-container) bg-(--color-background-muted)',
  metricLabel: 'block text-(--color-text-secondary)',
  metricValue: 'block mbs-(--spacing-1) text-(--color-text-primary)',
  tableRegion: cn(
    '[--table-bulk-actions-space:calc(var(--size-element-sm)+var(--spacing-2)+var(--spacing-2)+var(--spacing-4))]',
    'relative pbs-(--table-bulk-actions-space)',
  ),
  toolbar: cn(
    'sticky [inset-block-start:calc(var(--table-bulk-actions-space)+var(--spacing-4))]',
    '[transform:translateY(calc(0px-var(--table-bulk-actions-space)))]',
    '[margin-block-end:calc(var(--spacing-4)-var(--table-bulk-actions-space))]',
    'z-1 rounded-(--radius-element) [box-shadow:var(--shadow-med)]',
  ),
} as const;

export default function TableFloatingBulkActionsTable() {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const {selectionConfig, selectionState} = useTableSelectionState<User>({
    data: users,
    idKey: 'id',
    selectedKeys,
    setSelectedKeys,
  });
  const selectionPlugin = useTableSelection<User>(selectionConfig);

  return (
    <ScrollableArea
      axis="block"
      label="Bulk actions example"
      overscroll="contain"
      className={styles.page}>
      <div className={styles.metrics}>
        {[
          ['Active users', '12,840'],
          ['Selection rate', '18.4%'],
          ['Pending reviews', '247'],
        ].map(([label, value]) => (
          <div key={label} className={styles.metricCard}>
            <span className={styles.metricLabel}>{label}</span>
            <strong className={styles.metricValue}>{value}</strong>
          </div>
        ))}
      </div>
      <div className={styles.tableRegion}>
        <TableSelectionToolbar
          selection={selectionState}
          className={styles.toolbar}
          startContent={
            <Button label="Approve" variant="ghost" onClick={() => {}} />
          }
        />
        <Table
          data={users}
          columns={columns}
          idKey="id"
          plugins={{selection: selectionPlugin}}
        />
      </div>
    </ScrollableArea>
  );
}
