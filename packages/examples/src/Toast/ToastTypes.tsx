'use client';

// In production, use useToast() hook for proper positioning, stacking, and lifecycle.

import {Toast} from '@solo/core/Toast';
import {useToast} from '@solo/core/Toast';
import {Button} from '@solo/core/Button';
import {VStack} from '@solo/core/Layout';

export default function ToastTypes() {
  const toast = useToast();

  return (
    <VStack gap={3}>
      <Toast
        type="info"
        body="Changes saved successfully."
        endContent={
          <Button
            label="Show toast"
            variant="ghost"
            size="sm"
            onClick={() =>
              toast({body: 'Changes saved successfully.', type: 'info'})
            }
          />
        }
        isAutoHide={false}
        autoHideDuration={5000}
        isExiting={false}
        onDismiss={() => {}}
      />
      <Toast
        type="error"
        body="Failed to save changes."
        endContent={
          <Button
            label="Show toast"
            variant="ghost"
            size="sm"
            onClick={() =>
              toast({body: 'Failed to save changes.', type: 'error'})
            }
          />
        }
        isAutoHide={false}
        autoHideDuration={5000}
        isExiting={false}
        onDismiss={() => {}}
      />
    </VStack>
  );
}
