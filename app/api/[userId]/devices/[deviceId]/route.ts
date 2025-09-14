import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { ref, get, set } from "firebase/database";

// PUT /api/[userId]/devices/[deviceId]
export async function PUT(
  req: NextRequest,
  { params }: { params: { userId: string; deviceId: string } } // ✅ ไม่ต้อง await
) {
  const { userId, deviceId } = params;

  if (!userId || !deviceId) {
    return NextResponse.json(
      { error: "Missing userId or deviceId" },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    const deviceRef = ref(db, `/${userId}/devices/${deviceId}`);
    await set(deviceRef, body);

    return NextResponse.json(
      { message: "Device updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating device:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/[userId]/devices/[deviceId]
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string; deviceId: string } } // ✅ ไม่ต้อง await
) {
  const { userId, deviceId } = params;

  if (!userId || !deviceId) {
    return NextResponse.json(
      { error: "Missing userId or deviceId" },
      { status: 400 }
    );
  }

  try {
    const deviceRef = ref(db, `/${userId}/devices/${deviceId}`);
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
