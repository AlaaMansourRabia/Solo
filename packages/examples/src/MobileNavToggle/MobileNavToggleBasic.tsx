'use client';

import {useState} from 'react';
import {MobileNav, MobileNavToggle} from '@solo/core/MobileNav';
import {AppShellMobileContext} from '@solo/core/AppShell';
import {SideNavItem, SideNavSection} from '@solo/core/SideNav';
import {Icon} from '@solo/core/Icon';
import {HStack} from '@solo/core/Layout';
import {Text} from '@solo/core/Text';

export default function MobileNavToggleBasic() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <AppShellMobileContext.Provider
      value={{
        isMobile: true,
        isMobileNavOpen: isOpen,
        toggleMobileNav: () => setIsOpen(v => !v),
        openMobileNav: () => setIsOpen(true),
        closeMobileNav: () => setIsOpen(false),
        isMobileNavEnabled: true,
        hasAutoToggle: false,
      }}>
      <HStack gap={3} vAlign="center">
        <MobileNavToggle label="Open menu">
          <Icon icon="viewColumns" />
        </MobileNavToggle>
        <Text type="body" weight="bold">
          Page title
        </Text>
      </HStack>
      <MobileNav isOpen={isOpen} onOpenChange={setIsOpen} header="Navigation">
        <SideNavSection title="Pages">
          <SideNavItem label="Home" isSelected href="#" />
          <SideNavItem label="Settings" href="#" />
        </SideNavSection>
      </MobileNav>
    </AppShellMobileContext.Provider>
  );
}
