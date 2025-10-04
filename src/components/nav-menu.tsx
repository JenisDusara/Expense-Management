'use client'

import type { User } from '@/lib/definitions';
import { BarChart2, Home, Settings, Users, Wallet } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MOCK_USERS } from '@/lib/data';
import { cn } from '@/lib/utils';

export function NavMenu() {
  const pathname = usePathname();
  const user = MOCK_USERS[0];
  const userRole = user.role;

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard', roles: ['Admin', 'Manager', 'Employee'] },
    { href: '/expenses', icon: Wallet, label: 'Expenses', roles: ['Admin', 'Manager', 'Employee'] },
    { href: '/team', icon: Users, label: 'Team', roles: ['Admin', 'Manager'] },
    { href: '/reports', icon: BarChart2, label: 'Reports', roles: ['Admin', 'Manager'] },
    { href: '/settings', icon: Settings, label: 'Settings', roles: ['Admin'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));
  
  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {filteredNavItems.map((item) => (
         <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              (pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))) && "bg-muted text-primary"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
      ))}
    </nav>
  );
}
