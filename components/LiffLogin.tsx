"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLiffProfile } from "@/context/LiffContext";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type LiffModule = typeof import("@line/liff");

export default function LiffLogin() {
  const { profile, setProfile } = useLiffProfile();
  const [liff, setLiff] = useState<LiffModule["default"] | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [tempName, setTempName] = useState("");

  const liffId = useMemo(() => process.env.NEXT_PUBLIC_LIFF_ID, []);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        if (!liffId) throw new Error("Missing NEXT_PUBLIC_LIFF_ID");

        const mod = (await import("@line/liff")) as LiffModule;
        const liffInstance = mod.default;

        await liffInstance.init({ liffId });
        if (cancelled) return;

        setLiff(liffInstance);
        setIsReady(true);

        const loggedIn = liffInstance.isLoggedIn();
        setIsLoggedIn(loggedIn);

        if (loggedIn) {
          try {
            const p = await liffInstance.getProfile();
            setProfile({
              userId: p.userId,
              displayName: p.displayName,
              pictureUrl: p.pictureUrl,
            });
            setTempName(p.displayName);
            const res = await fetch(`/api/${p.userId}/profile`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ profile: p }),
            });
            if (res.ok) {
              console.log("profile saved successfully");
            }
          } catch (e) {
            console.error("Error saving profile:", e);
            // ignore profile fetch error
          }
        }
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : "Failed to initialize LIFF";
        if (!cancelled) setError(message);
      }
    }
    init();
    return () => {
      cancelled = true;
    };
  }, [liffId, setProfile]);

  const handleLogin = useCallback(() => {
    if (!liff) return;
    if (!liff.isLoggedIn()) {
      liff.login();
    }
  }, [liff]);

  const handleLogout = useCallback(() => {
    if (!liff) return;
    if (liff.isLoggedIn()) {
      liff.logout();
      setIsLoggedIn(false);
      setProfile(null);
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    }
  }, [liff, setProfile]);

  const handleSaveName = async () => {
    if (profile) {
      setProfile({ ...profile, displayName: tempName });
    }

    setOpen(false);
  };

  return (
    <div className="flex items-center gap-3">
      {error ? (
        <div className="text-red-600 text-sm">{error}</div>
      ) : isLoggedIn && profile ? (
        <>
          {/* Profile Image */}
          <Image
            src={profile.pictureUrl || "/images/plant.webp"}
            alt="profile"
            width={40}
            height={40}
            priority
            className="rounded-full cursor-pointer"
            onClick={() => setOpen(true)}
          />

          {/* Drawer */}
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Profile Settings</DrawerTitle>
                <DrawerDescription>Manage your account</DrawerDescription>
              </DrawerHeader>
              <div className="flex flex-col items-center gap-4 p-4">
                <Image
                  src={profile.pictureUrl || "/images/plant.webp"}
                  alt="profile"
                  width={80}
                  height={80}
                  className="rounded-full"
                />
                <Input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <DrawerFooter>
                <Button onClick={handleSaveName}>Save</Button>
                <Button variant="destructive" onClick={handleLogout}>
                  Logout
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </>
      ) : (
        <Button disabled={!isReady} onClick={handleLogin}>
          Login with LINE
        </Button>
      )}
    </div>
  );
}
