'use client';

// In production, use useToast() hook for proper positioning, stacking, and lifecycle.

import {useRef} from 'react';
import {Toast} from '@solo/core/Toast';
import {useToast} from '@solo/core/Toast';
import {Button} from '@solo/core/Button';
import {VStack} from '@solo/core/Layout';

const MESSAGES = [
  {body: 'Changes saved.', type: 'info' as const},
  {body: 'Failed to upload file.', type: 'error' as const},
  {body: 'Message sent to Sarah Chen.', type: 'info' as const},
];

export default function ToastStacking() {
  const toast = useToast();
  const countRef = useRef(0);

  return (
    <VStack gap={3}>
      {MESSAGES.map(msg => (
        <Toast
          key={msg.body}
          type={msg.type}
          body={msg.body}
          isAutoHide={false}
          autoHideDuration={5000}
          isExiting={false}
          onDismiss={() => {}}
        />
      ))}
      <Button
        label="Show toast"
        variant="secondary"
        size="sm"
        onClick={() => {
          const msg = MESSAGES[countRef.current % MESSAGES.length];
          countRef.current++;
          toast(msg);
        }}
      />
    </VStack>
  );
}
