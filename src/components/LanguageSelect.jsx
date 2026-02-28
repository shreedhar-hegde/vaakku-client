import * as Select from '@radix-ui/react-select';
import { useId } from 'react';

function ChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/**
 * Language dropdown inspired by modern translation UIs: trigger with chevron,
 * popover with rounded corners and shadow, vertical scrollable list,
 * selected item with checkmark and light highlight.
 */
export function LanguageSelect({ value, onValueChange, options, placeholder = 'Select language', 'aria-label': ariaLabel }) {
  const id = useId();
  const selected = options.find((o) => o.value === value);
  const displayLabel = selected ? `${selected.label}${selected.native ? ` ${selected.native}` : ''}` : placeholder;

  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger
        id={id}
        aria-label={ariaLabel}
        className="language-select-trigger inline-flex h-10 min-w-0 max-w-full items-center justify-between gap-2 rounded-md border bg-white px-3 py-2 text-left text-sm outline-none transition-[border-color,box-shadow] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 data-[placeholder]:text-[var(--color-text-muted)]"
        style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
      >
        <Select.Value placeholder={placeholder}>{displayLabel}</Select.Value>
        <Select.Icon className="select-chevron shrink-0 opacity-70">
          <ChevronDown />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={4}
          className="max-h-[min(280px,70vh)] overflow-y-auto rounded-lg border bg-white py-1 shadow-lg"
          style={{
            borderColor: 'var(--color-border)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
          }}
        >
          {options.map((opt) => (
            <Select.Item
              key={opt.value}
              value={opt.value}
              className="relative flex cursor-default select-none items-center gap-2 py-2.5 pl-9 pr-4 text-sm outline-none data-[highlighted]:bg-[var(--color-accent)]/10 data-[state=checked]:bg-[var(--color-accent)]/12"
              style={{
                color: 'var(--color-text)',
              }}
            >
              <Select.ItemIndicator className="absolute left-3 flex items-center justify-center text-[var(--color-accent)]">
                <CheckIcon />
              </Select.ItemIndicator>
              <span>
                {opt.label}
                {opt.native ? ` ${opt.native}` : ''}
              </span>
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
