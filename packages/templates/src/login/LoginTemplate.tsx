'use client';

import {useState, type CSSProperties} from 'react';
import {VStack} from '@solo/core/Layout';
import {Center} from '@solo/core/Center';
import {Text, Heading} from '@solo/core/Text';
import {TextInput} from '@solo/core/TextInput';
import {Button} from '@solo/core/Button';
import {Card} from '@solo/core/Card';
import {Icon} from '@solo/core/Icon';
import {Banner} from '@solo/core/Banner';
import {CubeIcon} from '@heroicons/react/24/outline';

// Standalone auth page paints its own body background (no host shell).
const pageStyle: CSSProperties = {
  minHeight: '100%',
  backgroundColor: 'var(--color-background-body)',
};
// Cap the column at 400px but let it shrink to fit narrow screens (Stack
// has no maxWidth prop, so it's set here).
const contentStyle: CSSProperties = {
  width: '100%',
  maxWidth: 400,
};

export default function LoginTemplate() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = () => {
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <Center axis="both" padding={6} style={pageStyle}>
      <VStack gap={4} hAlign="center" style={contentStyle}>
        {/* Logo */}
        <VStack gap={2} hAlign="center">
          <Icon icon={CubeIcon} size="lg" />
          <Text type="body" weight="bold" size="lg">
            Product Inc.
          </Text>
        </VStack>

        {/* Card */}
        <Card padding={8} width="100%">
          <VStack gap={4} hAlign="stretch">
            <VStack gap={1} hAlign="center">
              <Heading level={2}>Sign in</Heading>
              <Text type="body" color="secondary" size="sm">
                Enter your credentials to continue
              </Text>
            </VStack>

            {error && <Banner status="error" title={error} container="card" />}

            <TextInput
              label="Email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              type="email"
              size="lg"
            />

            <TextInput
              label="Password"
              value={password}
              onChange={setPassword}
              placeholder="Enter your password"
              type="password"
              size="lg"
            />

            <Button
              label="Sign in"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              onClick={handleSignIn}
            />
          </VStack>
        </Card>
      </VStack>
    </Center>
  );
}
