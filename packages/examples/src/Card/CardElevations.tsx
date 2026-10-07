'use client';

import {Card} from '@solo/core/Card';
import {Stack} from '@solo/core/Layout';
import {Grid} from '@solo/core/Grid';
import {Text, Heading} from '@solo/core/Text';

const LEVELS = [
  {elevation: 'none' as const, caption: 'Flat — sits on the page (default)'},
  {elevation: 'low' as const, caption: 'Low — lifts off slightly'},
  {elevation: 'med' as const, caption: 'Med — clearly raised'},
  {elevation: 'high' as const, caption: 'High — floats well above'},
];

export default function CardElevations() {
  return (
    <Grid columns={2} gap={4} width={520}>
      {LEVELS.map(({elevation, caption}) => (
        <Card key={elevation} elevation={elevation}>
          <Stack direction="vertical" gap={1}>
            <Heading level={4}>elevation=&quot;{elevation}&quot;</Heading>
            <Text type="supporting" color="secondary">
              {caption}
            </Text>
          </Stack>
        </Card>
      ))}
    </Grid>
  );
}
