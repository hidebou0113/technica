import {
  BookMarked,
  BookOpenText,
  LayoutDashboard,
  RefreshCw,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const authenticatedNavigation: NavigationItem[] = [
  { label: "ダッシュボード", href: "/dashboard", icon: LayoutDashboard },
  { label: "単語", href: "/words", icon: BookOpenText },
  { label: "単語帳", href: "/notebooks", icon: BookMarked },
  { label: "復習", href: "/reviews", icon: RefreshCw },
  { label: "マイページ", href: "/mypage", icon: UserRound },
];

export function isNavigationItemActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
