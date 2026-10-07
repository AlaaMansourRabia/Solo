'use client';

import {useState} from 'react';
import {TextArea} from '@solo/core/TextArea';
import {Stack} from '@solo/core/Layout';

export default function TextAreaStates() {
  const [requiredValue, setRequiredValue] = useState('');

  return (
    <Stack direction="vertical" gap={4} style={{width: 400}}>
      <TextArea
        label="Required field"
        value={requiredValue}
        onChange={setRequiredValue}
        placeholder="Describe the issue..."
        isRequired
      />
      <TextArea
        label="Disabled field"
        value="This field is disabled and cannot be edited."
        onChange={() => {}}
        isDisabled
      />
      <TextArea
        label="Loading field"
        value=""
        onChange={() => {}}
        placeholder="Generating summary..."
        isLoading
      />
    </Stack>
  );
}
