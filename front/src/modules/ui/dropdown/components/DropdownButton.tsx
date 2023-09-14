import { useRef } from 'react';
import { Keys } from 'react-hotkeys-hook';
import { flip, offset, Placement, useFloating } from '@floating-ui/react';

import { HotkeyScope } from '@/ui/utilities/hotkey/types/HotkeyScope';
import { useListenClickOutside } from '@/ui/utilities/pointer-event/hooks/useListenClickOutside';

import { HotkeyEffect } from '../../utilities/hotkey/components/HotkeyEffect';
import { useDropdownButton } from '../hooks/useDropdownButton';
import { useInternalHotkeyScopeManagement } from '../hooks/useInternalHotkeyScopeManagement';

type OwnProps = {
  buttonComponents: JSX.Element | JSX.Element[];
  dropdownComponents: JSX.Element | JSX.Element[];
  dropdownId: string;
  hotkey?: {
    key: Keys;
    scope: string;
  };
  dropdownHotkeyScope?: HotkeyScope;
  dropdownPlacement?: Placement;
};

export function DropdownButton({
  buttonComponents,
  dropdownComponents,
  dropdownId,
  hotkey,
  dropdownHotkeyScope,
  dropdownPlacement = 'bottom-end',
}: OwnProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { isDropdownButtonOpen, toggleDropdownButton, closeDropdownButton } =
    useDropdownButton({
      dropdownId,
    });

  const { refs, floatingStyles } = useFloating({
    placement: dropdownPlacement,
    middleware: [flip(), offset()],
  });

  function handleHotkeyTriggered() {
    toggleDropdownButton();
  }

  useListenClickOutside({
    refs: [containerRef],
    callback: () => {
      if (isDropdownButtonOpen) {
        closeDropdownButton();
      }
    },
  });

  useInternalHotkeyScopeManagement({
    dropdownId,
    dropdownHotkeyScope,
  });

  return (
    <div ref={containerRef}>
      {hotkey && (
        <HotkeyEffect
          hotkey={hotkey}
          onHotkeyTriggered={handleHotkeyTriggered}
        />
      )}
      <div ref={refs.setReference}>{buttonComponents}</div>
      {isDropdownButtonOpen && (
        <div ref={refs.setFloating} style={floatingStyles}>
          {dropdownComponents}
        </div>
      )}
    </div>
  );
}
