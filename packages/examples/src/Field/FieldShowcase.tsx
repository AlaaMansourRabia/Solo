'use client';

import {useState} from 'react';
import {Field} from '@solo/core/Field';
import {TextInput} from '@solo/core/TextInput';
import {Stack} from '@solo/core/Layout';

export default function FieldShowcase() {
  const [email, setEmail] = useState('');

  const status =
    email.length > 0 && !email.includes('@')
      ? {type: 'error' as const, message: 'Enter a valid email address.'}
      : undefined;

  return (
    <Stack direction="vertical" gap={3} style={{width: 320}}>
      <Field
        label="Email"
        inputID="field-email"
        description="We will never share your email."
        isRequired
        status={status}>
        <TextInput
          label="Email"
          isLabelHidden
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
        />
      </Field>
    </Stack>
  );
}
