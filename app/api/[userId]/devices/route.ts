import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { get, ref } from "firebase/database";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } } // ✅ ไม่ต้อง await
) {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const deviceRef = ref(db, `/${userId}/devices/`);
    const snapshot = await get(deviceRef);

    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    return NextResponse.json({ device: snapshot.val() }, { status: 200 });
  } catch (error) {
    console.error("Error fetching device:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
