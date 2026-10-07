'use client';

import {TopNav, TopNavHeading, TopNavItem} from '@solo/core/TopNav';
import {NavIcon} from '@solo/core/NavIcon';
import {Button} from '@solo/core/Button';
import {Icon} from '@solo/core/Icon';
import {
  CubeIcon,
  HomeIcon,
  DocumentTextIcon,
  BellIcon,
} from '@heroicons/react/24/outline';

export default function TopNavEnterpriseDashboard() {
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
          <TopNavItem
            label="Dashboard"
            href="#"
            isSelected
            icon={<Icon icon={HomeIcon} size="sm" />}
          />
          <TopNavItem
            label="Reports"
            href="#"
            icon={<Icon icon={DocumentTextIcon} size="sm" />}
          />
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
            icon={<Icon icon={BellIcon} />}
            isIconOnly
          />
          <Button label="Upgrade" variant="primary" />
        </>
      }
    />
  );
}
