'use client';

import {Stepper, Step} from '@solo/core/Stepper';
import {Text} from '@solo/core/Text';

export default function StepShowcase() {
  // One Step, and every part it renders: the indicator, the label with its
  // optional marker and trailing slot, and the description beneath. A Step is
  // always wrapped in a Stepper — that is where it reads its progress from —
  // so a single Step in a single Stepper is the smallest complete example.
  return (
    <div style={{width: 380}}>
      <Stepper activeStep={1} orientation="vertical">
        <Step
          step={1}
          label="Connect a repository"
          description="Solo reads your build settings from the default branch"
          endContent={<Text type="supporting">2 min</Text>}
          isOptional
        />
      </Stepper>
    </div>
  );
}
