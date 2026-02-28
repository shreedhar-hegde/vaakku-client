import * as Select from '@radix-ui/react-select';
import { useLocale } from '../context/LocaleContext';

const LANDING_LOCALE_OPTIONS = [
  { value: 'en', label: 'English', native: '' },
  { value: 'kn-IN', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { value: 'hi-IN', label: 'Hindi', native: 'हिन्दी' },
];

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

const VALID_VALUES = LANDING_LOCALE_OPTIONS.map((o) => o.value);

export function LandingLocaleSelect() {
  const { locale, setLocale } = useLocale();
  const value = VALID_VALUES.includes(locale) ? locale : 'en';
  const selected = LANDING_LOCALE_OPTIONS.find((o) => o.value === value);
  const displayLabel = selected ? `${selected.label}${selected.native ? ` ${selected.native}` : ''}` : 'English';

  return (
    <Select.Root value={value} onValueChange={setLocale}>
      <Select.Trigger
        type="button"
        aria-label="Language"
        className="landing-locale-trigger w-full inline-flex items-center justify-between gap-2 bg-white text-left outline-none transition-[border-color,box-shadow] duration-150 focus:ring-2 focus:ring-[var(--color-accent)]/20 cursor-pointer touch-manipulation"
        style={{
          border: '1.5px solid #E8E6E1',
          borderRadius: 999,
          padding: '8px 16px',
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          color: 'var(--color-text)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <span aria-hidden>🌐</span>
        <Select.Value>{displayLabel}</Select.Value>
        <Select.Icon className="shrink-0 opacity-70">
          <ChevronDown />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={8}
          className="landing-locale-content min-w-[160px] overflow-y-auto bg-white py-1"
          style={{
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08)',
          }}
        >
          {LANDING_LOCALE_OPTIONS.map((opt) => (
            <Select.Item
              key={opt.value}
              value={opt.value}
              className="landing-locale-item relative flex cursor-default select-none items-center pr-9 pl-4 outline-none data-[highlighted]:bg-[var(--color-accent)]/10 data-[state=checked]:text-[var(--color-accent)]"
              style={{
                fontSize: 14,
                minHeight: 40,
                fontFamily: 'var(--font-body)',
              }}
            >
              <Select.ItemText>
                {opt.label}
                {opt.native ? ` ${opt.native}` : ''}
              </Select.ItemText>
              <Select.ItemIndicator className="absolute right-4 flex items-center justify-center text-[var(--color-accent)]">
                <CheckIcon />
              </Select.ItemIndicator>
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
