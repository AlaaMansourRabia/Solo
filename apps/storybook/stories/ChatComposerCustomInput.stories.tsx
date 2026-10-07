import type {Meta, StoryObj} from '@storybook/react';
import {useEffect, useRef, useState} from 'react';
import {ChatComposer, useChatComposerContext} from '@solo/core/Chat';

const meta: Meta<typeof ChatComposer> = {
  title: 'Core/ChatComposer',
  component: ChatComposer,
  parameters: {
    docs: {
      description: {
        component:
          'The composer body is a shell of slots; the input is just one of them. ' +
          'Any input can be a first-class citizen by wiring to the public ' +
          'composition contract: read `value`/`onChange`/`onSubmit`/`placeholder`/' +
          '`isDisabled` from `useChatComposerContext()`, and register a focus ' +
          'control on `inputControlRef` so clicking empty space in the body focuses ' +
          'it — no matter the input’s DOM shape. `ChatSendButton` reads the same ' +
          'context, so the shell’s send button “just works”.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ChatComposer>;

// =============================================================================
// Example 1 — a plain <textarea> as a first-class composer input
// =============================================================================

/**
 * A bare controlled `<textarea>` in the input slot. It reads state from
 * `useChatComposerContext()`, submits on Enter, and registers a focus control
 * so body-click-to-focus works. No `ChatComposerInput`, no contentEditable.
 */
function TextareaInput() {
  const ctx = useChatComposerContext();
  const ref = useRef<HTMLTextAreaElement>(null);

  // Register how the shell should focus us (body-click-to-focus).
  const controlRef = ctx?.inputControlRef;
  useEffect(() => {
    if (!controlRef) {
      return;
    }
    controlRef.current = {focus: () => ref.current?.focus()};
    return () => {
      controlRef.current = null;
    };
  }, [controlRef]);

  if (!ctx) {
    return null;
  }
  return (
    <textarea
      ref={ref}
      rows={1}
      value={ctx.value}
      placeholder={ctx.placeholder}
      disabled={ctx.isDisabled}
      onChange={e => ctx.onChange(e.target.value)}
      onKeyDown={e => {
        // Enter submits; Shift+Enter inserts a newline. IME-safe.
        if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
          e.preventDefault();
          if (ctx.canSend) {
            ctx.onSubmit(ctx.value);
          }
        }
      }}
      style={{
        all: 'unset',
        width: '100%',
        resize: 'none',
        fontFamily: 'var(--font-family-body)',
        fontSize: 'var(--text-body-size)',
        lineHeight: 'var(--text-body-leading)',
        color: 'var(--color-text-primary)',
        caretColor: 'var(--color-accent)',
      }}
    />
  );
}

export const PlainTextarea: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <ChatComposer
        value={value}
        onChange={setValue}
        onSubmit={submitted => {
          console.log('Submit:', submitted);
          setValue('');
        }}
        placeholder="Plain textarea input…"
        input={<TextareaInput />}
      />
    );
  },
};
