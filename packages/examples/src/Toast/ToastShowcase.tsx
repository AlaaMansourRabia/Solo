'use client';

// In production, use useToast() hook for proper positioning, stacking, and lifecycle.

import {Toast} from '@solo/core/Toast';
import {useToast} from '@solo/core/Toast';
import {Button} from '@solo/core/Button';

export default function ToastShowcase() {
  const toast = useToast();
  return (
    <Toast
      type="info"
      body="Document saved successfully"
      endContent={
        <Button
          label="Show toast"
          variant="ghost"
          size="sm"
          onClick={() => toast({body: 'Document saved successfully'})}
        />
      }
      isAutoHide={false}
      autoHideDuration={5000}
      isExiting={false}
      onDismiss={() => {}}
    />
  );
}
