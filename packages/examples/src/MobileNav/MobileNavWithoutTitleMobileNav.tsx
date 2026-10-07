'use client';

import {useState} from 'react';
import {MobileNav} from '@solo/core/MobileNav';
import {SideNavSection, SideNavItem} from '@solo/core/SideNav';
import {Button} from '@solo/core/Button';
import {Icon} from '@solo/core/Icon';
import {HomeIcon, FolderIcon} from '@heroicons/react/24/outline';

export default function MobileNavWithoutTitleMobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        label="Open Navigation"
        icon={<Icon icon="menu" color="inherit" />}
        variant="ghost"
        onClick={() => setIsOpen(true)}
        isIconOnly
      />
      <MobileNav isOpen={isOpen} onOpenChange={open => setIsOpen(open)}>
        <SideNavSection title="Main">
          <SideNavItem
            label="Dashboard"
            icon={HomeIcon}
            isSelected
            href="/dashboard"
          />
          <SideNavItem label="Projects" icon={FolderIcon} href="/projects" />
        </SideNavSection>
      </MobileNav>
    </>
  );
}
