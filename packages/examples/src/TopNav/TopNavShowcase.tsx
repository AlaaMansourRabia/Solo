'use client';

import {TopNav, TopNavHeading, TopNavItem} from '@solo/core/TopNav';
import {NavIcon} from '@solo/core/NavIcon';
import {Button} from '@solo/core/Button';
import {Icon} from '@solo/core/Icon';
import {BellIcon, CubeIcon, UserCircleIcon} from '@heroicons/react/24/outline';

export default function TopNavShowcase() {
  return (
    <TopNav
      style={{width: 600}}
      label="Main navigation"
      heading={
        <TopNavHeading
          heading="My App"
          logo={<NavIcon icon={<Icon icon={CubeIcon} size="sm" />} />}
        />
      }
      startContent={
        <>
          <TopNavItem label="Home" href="#" isSelected />
          <TopNavItem label="Products" href="#" />
          <TopNavItem label="About" href="#" />
        </>
      }
      endContent={
        <>
          <Button
            label="Search"
            variant="ghost"
            icon={<Icon icon="search" color="inherit" />}
            isIconOnly
          />
          <Button
            label="Notifications"
            variant="ghost"
            icon={<BellIcon />}
            isIconOnly
          />
          <Button
            label="Profile"
            variant="ghost"
            icon={<UserCircleIcon />}
            isIconOnly
          />
        </>
      }
    />
  );
}
