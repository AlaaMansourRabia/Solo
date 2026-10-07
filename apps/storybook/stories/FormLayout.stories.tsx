import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react';
import {FormLayout} from '@solo/core/FormLayout';
import {TextInput} from '@solo/core/TextInput';
import {Selector} from '@solo/core/Selector';
import {Field} from '@solo/core/Field';
import {Text} from '@solo/core/Text';

const meta: Meta<typeof FormLayout> = {
  title: 'Core/FormLayout',
  component: FormLayout,
  tags: ['autodocs'],
  args: {
    direction: 'vertical',
  },
  argTypes: {
    direction: {
      control: 'select',
      options: ['vertical', 'horizontal', 'horizontal-labels'],
      description: 'Direction of field arrangement',
    },
    defaultOptionality: {
      control: 'select',
      options: [undefined, 'optional', 'required'],
      description:
        'Form-wide default so only the exception shows an optional/required indicator',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormLayout>;

// Helper component that uses args so Storybook controls work
function FormLayoutDemo({
  direction,
}: {
  direction?: 'vertical' | 'horizontal' | 'horizontal-labels';
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  return (
    <FormLayout direction={direction}>
      <TextInput label="Name" value={name} onChange={setName} />
      <TextInput label="Email" value={email} onChange={setEmail} />
      <TextInput label="Bio" value={bio} onChange={setBio} />
    </FormLayout>
  );
}

// ─── Vertical (default) ───────────────────────────────────────────────────

export const Vertical: Story = {
  name: 'Vertical (Default)',
  render: args => <FormLayoutDemo direction={args.direction} />,
};

// ─── Horizontal ───────────────────────────────────────────────────────────

export const Horizontal: Story = {
  name: 'Horizontal',
  args: {
    direction: 'horizontal',
  },
  render: args => {
    const [first, setFirst] = useState('');
    const [last, setLast] = useState('');
    return (
      <FormLayout direction={args.direction}>
        <TextInput label="First Name" value={first} onChange={setFirst} />
        <TextInput label="Last Name" value={last} onChange={setLast} />
      </FormLayout>
    );
  },
};

// ─── Horizontal Labels ────────────────────────────────────────────────────

export const HorizontalLabels: Story = {
  name: 'Horizontal Labels (Settings)',
  args: {
    direction: 'horizontal-labels',
  },
  render: args => {
    const [displayName, setDisplayName] = useState('Jane Doe');
    const [email, setEmail] = useState('jane@example.com');
    const [timezone, setTimezone] = useState('America/Los_Angeles');
    return (
      <FormLayout direction={args.direction}>
        <TextInput
          label="Display Name"
          value={displayName}
          onChange={setDisplayName}
        />
        <TextInput label="Email" value={email} onChange={setEmail} />
        <Selector
          label="Timezone"
          value={timezone}
          onChange={v => setTimezone(v as string)}
          options={[
            {label: 'Pacific Time', value: 'America/Los_Angeles'},
            {label: 'Eastern Time', value: 'America/New_York'},
            {label: 'UTC', value: 'UTC'},
          ]}
        />
      </FormLayout>
    );
  },
};

// ─── Mixed: Solo inputs + Field-wrapped custom controls ─────────────────

const checkboxStyles = {
  group: 'flex flex-col gap-[4px]',
  label: 'flex items-center gap-[8px]',
} as const;

export const MixedControls: Story = {
  name: 'Mixed Controls',
  render: () => {
    const [name, setName] = useState('');
    const [role, setRole] = useState('viewer');
    return (
      <FormLayout>
        <TextInput label="Name" value={name} onChange={setName} />
        <Selector
          label="Role"
          value={role}
          onChange={v => setRole(v as string)}
          options={[
            {label: 'Viewer', value: 'viewer'},
            {label: 'Editor', value: 'editor'},
            {label: 'Admin', value: 'admin'},
          ]}
        />
        <Field label="Notifications" inputID="notif-group">
          <div className={checkboxStyles.group} id="notif-group">
            <label className={checkboxStyles.label}>
              <input type="checkbox" defaultChecked /> Email
            </label>
            <label className={checkboxStyles.label}>
              <input type="checkbox" /> SMS
            </label>
            <label className={checkboxStyles.label}>
              <input type="checkbox" defaultChecked /> Push
            </label>
          </div>
        </Field>
      </FormLayout>
    );
  },
};

// ─── Nested Layouts ───────────────────────────────────────────────────────

export const Nested: Story = {
  name: 'Nested Layouts',
  render: () => {
    const [first, setFirst] = useState('');
    const [last, setLast] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    return (
      <FormLayout>
        <FormLayout direction="horizontal">
          <TextInput label="First Name" value={first} onChange={setFirst} />
          <TextInput label="Last Name" value={last} onChange={setLast} />
        </FormLayout>
        <TextInput label="Email" value={email} onChange={setEmail} />
        <FormLayout direction="horizontal">
          <TextInput label="City" value={city} onChange={setCity} />
          <TextInput label="State" value={state} onChange={setState} />
          <TextInput label="ZIP" value={zip} onChange={setZip} />
        </FormLayout>
      </FormLayout>
    );
  },
};

// ─── In a Dialog (form attribute pattern) ─────────────────────────────────

const dialogStyles = {
  container:
    '[border:1px_solid_#ddd] rounded-[8px] max-w-[480px] overflow-hidden',
  header: 'p-[16px] [border-bottom:1px_solid_#eee]',
  body: 'p-[16px]',
  footer: 'flex justify-end gap-[8px] p-[16px] [border-top:1px_solid_#eee]',
  button:
    '[padding:8px_16px] rounded-[6px] [border:none] cursor-pointer text-[length:14px]',
  primary: 'bg-[#0064E0] text-[#fff]',
  secondary: 'bg-[#F1F4F7] text-[#0A1317]',
} as const;

export const InDialog: Story = {
  name: 'In a Dialog',
  render: () => {
    const [name, setName] = useState('Jane Doe');
    const [email, setEmail] = useState('jane@example.com');
    return (
      <div className={dialogStyles.container}>
        <div className={dialogStyles.header}>
          <Text type="label">Edit Profile</Text>
        </div>
        <div className={dialogStyles.body}>
          <form
            id="edit-profile"
            onSubmit={e => {
              e.preventDefault();
              alert(`Saved: ${name}, ${email}`);
            }}>
            <FormLayout>
              <TextInput label="Name" value={name} onChange={setName} />
              <TextInput label="Email" value={email} onChange={setEmail} />
            </FormLayout>
          </form>
        </div>
        <div className={dialogStyles.footer}>
          <button
            className={`${dialogStyles.button} ${dialogStyles.secondary}`}
            type="button">
            Cancel
          </button>
          <button
            className={`${dialogStyles.button} ${dialogStyles.primary}`}
            type="submit"
            form="edit-profile">
            Save
          </button>
        </div>
      </div>
    );
  },
};

// ─── Default optionality: mark only the exception ─────────────────────────

export const DefaultOptionalityOptional: Story = {
  name: 'Default Optionality — Optional',
  render: () => {
    const [bio, setBio] = useState('');
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    // Everything reads as optional; only the required field is marked.
    return (
      <FormLayout defaultOptionality="optional">
        <TextInput label="Bio" value={bio} onChange={setBio} />
        <TextInput
          label="Nickname"
          value={nickname}
          onChange={setNickname}
          isOptional
        />
        <TextInput label="Email" value={email} onChange={setEmail} isRequired />
      </FormLayout>
    );
  },
};

export const DefaultOptionalityRequired: Story = {
  name: 'Default Optionality — Required',
  render: () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    // Everything reads as required; only the optional field is marked.
    return (
      <FormLayout defaultOptionality="required">
        <TextInput label="Name" value={name} onChange={setName} />
        <TextInput label="Email" value={email} onChange={setEmail} isRequired />
        <TextInput
          label="Nickname"
          value={nickname}
          onChange={setNickname}
          isOptional
        />
      </FormLayout>
    );
  },
};
