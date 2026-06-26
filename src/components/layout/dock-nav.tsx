
"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Dock from "../ui/dock";
import { VscHome, VscChecklist, VscPerson, VscOrganization, VscRocket, VscBook, VscGraph, VscVmActive } from "react-icons/vsc";

export default function DockNav() {
  const { user } = useAuth();
  const router = useRouter();

  const navItems = [
    { href: "/", label: "Dashboard", icon: <VscHome size={25} /> },
    { href: "/leaderboard", label: "Leaderboard", icon: <VscGraph size={25} /> },
    { href: "/attendance", label: "Attendance", icon: <VscChecklist size={25} /> },
    { href: "/potd", label: "POTD", icon: <VscVmActive size={25} /> },
    { href: "/upcoming-contests", label: "Contests", icon: <VscRocket size={25} /> },
    { href: "/resources", label: "Resources", icon: <VscBook size={25} /> },
    user?.role === "admin"
      ? { href: "/students", label: "Students", icon: <VscOrganization size={25} /> }
      : { href: "/profile", label: "Profile", icon: <VscPerson size={25} /> },
  ];

  const items = navItems.map((item) => ({
    icon: item.icon,
    label: item.label,
    onClick: () => router.push(item.href),
  }));

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <Dock items={items} className="bg-black/100" />
    </div>
  );
}
