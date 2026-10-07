'use client';

import {TopNav, TopNavHeading, TopNavItem} from '@solo/core/TopNav';
import {NavIcon} from '@solo/core/NavIcon';
import {Button} from '@solo/core/Button';
import {Icon} from '@solo/core/Icon';
import {CubeIcon, UserCircleIcon} from '@heroicons/react/24/outline';

export default function TopNavWithLogo() {
  return (
    <TopNav
      label="Main navigation"
      heading={
        <TopNavHeading
          heading="My App"
          logo={<NavIcon icon={<Icon icon={CubeIcon} size="sm" />} />}
          headingHref="#"
        />
      }
      startContent={
        <>
          <TopNavItem label="Overview" href="#" isSelected />
          <TopNavItem label="Analytics" href="#" />
          <TopNavItem label="Reports" href="#" />
        </>
      }
      endContent={
        <Button
          label="Profile"
          variant="ghost"
          icon={<UserCircleIcon />}
          isIconOnly
        />
      }
    />
  );
}
