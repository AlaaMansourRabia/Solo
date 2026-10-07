'use client';

import {RadioIndicator} from '@solo/core/Indicator';
import {Grid} from '@solo/core/Grid';
import {Text} from '@solo/core/Text';

const STATES = ['unchecked', 'checked'] as const;

export default function RadioIndicatorStates() {
  return (
    <Grid columns={3} gap={4}>
      <span />
      {STATES.map(state => (
        <Text key={state} type="supporting" color="secondary">
          {state}
        </Text>
      ))}
      <Text type="supporting" color="secondary">
        enabled
      </Text>
      {STATES.map(state => (
        <RadioIndicator key={state} state={state} />
      ))}
      <Text type="supporting" color="secondary">
        disabled
      </Text>
      {STATES.map(state => (
        <RadioIndicator key={state} state={state} isDisabled />
      ))}
      <Text type="supporting" color="secondary">
        small
      </Text>
      {STATES.map(state => (
        <RadioIndicator key={state} state={state} size="sm" />
      ))}
    </Grid>
  );
}
