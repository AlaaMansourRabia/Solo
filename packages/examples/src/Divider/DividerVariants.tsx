'use client';

import {Divider} from '@solo/core/Divider';
import {Card} from '@solo/core/Card';
import {Section} from '@solo/core/Section';
import {VStack} from '@solo/core/Layout';
import {Text} from '@solo/core/Text';

export default function DividerVariants() {
  return (
    <Section variant="transparent" width="100%">
      <Card width={400}>
        <VStack gap={3}>
          <VStack gap={1}>
            <Text type="label">Sign in with email</Text>
            <Text type="body">
              Enter your email and password to access your account.
            </Text>
          </VStack>
          <Divider label="or" />
          <VStack gap={1}>
            <Text type="label">Sign in with SSO</Text>
            <Text type="body">
              Use your company credentials to sign in automatically.
            </Text>
          </VStack>
          <Divider variant="strong" />
          <Text type="supporting" color="secondary">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </VStack>
      </Card>
    </Section>
  );
}
