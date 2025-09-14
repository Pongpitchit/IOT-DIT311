import { db } from "@/lib/firebase";
import { get, ref } from "firebase/database";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const snapshot = await get(ref(db, `/devices`));
    if (!snapshot.exists())
      return NextResponse.json({ error: "devices not found" }, { status: 404 });

    return NextResponse.json({ devices: snapshot.val() }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
