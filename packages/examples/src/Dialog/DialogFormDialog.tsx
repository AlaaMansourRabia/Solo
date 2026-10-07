'use client';

import {useState} from 'react';
import {
  Dialog,
  DialogHeader,
  useImperativeDialog,
} from '@solo/core/Dialog';
import {
  Layout,
  LayoutContent,
  LayoutFooter,
  HStack,
  VStack,
} from '@solo/core/Layout';
import {Button} from '@solo/core/Button';
import {TextInput} from '@solo/core/TextInput';
import {TextArea} from '@solo/core/TextArea';

function Content({onClose}: {onClose: () => void}) {
  const [name, setName] = useState('Ruby Cheung');
  const [bio, setBio] = useState('Design systems engineer');

  return (
    <Layout
      header={
        <DialogHeader
          title="Edit profile"
          subtitle="Update your display name and bio"
          onOpenChange={() => onClose()}
        />
      }
      content={
        <LayoutContent>
          <VStack gap={4}>
            <TextInput
              label="Display name"
              value={name}
              onChange={setName}
              placeholder="Enter your name"
            />
            <TextArea
              label="Bio"
              value={bio}
              onChange={setBio}
              placeholder="Tell us about yourself"
            />
          </VStack>
        </LayoutContent>
      }
      footer={
        <LayoutFooter>
          <HStack gap={2} hAlign="end">
            <Button label="Cancel" variant="secondary" onClick={onClose} />
            <Button label="Save" variant="primary" onClick={onClose} />
          </HStack>
        </LayoutFooter>
      }
    />
  );
}

// Remove isInline for production — dialogs should be modal.
export default function DialogFormDialog() {
  const dialog = useImperativeDialog({purpose: 'form', width: 480});

  return (
    <>
      <Dialog
        isOpen
        isInline
        onOpenChange={() => {}}
        purpose="form"
        width={480}>
        <Content
          onClose={() => dialog.show(<Content onClose={() => dialog.hide()} />)}
        />
      </Dialog>
      {dialog.element}
    </>
  );
}
