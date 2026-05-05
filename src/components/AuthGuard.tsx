"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getToken } from "@/lib/api";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      // Not logged in — redirect to login, preserve intended destination
      router.replace(`/?redirect=${encodeURIComponent(pathname)}`);
    } else {
      setChecked(true);
    }
  }, [pathname, router]);

  // Show nothing while checking — prevents flash of protected content
  if (!checked)
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center w-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 rounded-full border-2 border-gold border-t-transparent animate-spin" />
          <p className="text-[.78rem] text-ink-soft">Checking session…</p>
        </div>
      </div>
    );

  return <>{children}</>;
}
