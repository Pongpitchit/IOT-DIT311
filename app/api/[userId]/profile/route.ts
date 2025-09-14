// app/api/profile/[userId]/route.ts
import { db } from "@/lib/firebase";
import { ref, get, set } from "firebase/database";
import { NextResponse } from "next/server";

interface Params {
  params: { userId: string };
}

// GET profile
export async function GET(_req: Request, { params }: Params) {
  try {
    if (!params.userId)
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    const snapshot = await get(ref(db, `/${params.userId}/profile`));
    if (!snapshot.exists())
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ profile: snapshot.val() }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT profile
export async function PUT(req: Request, { params }: Params) {
  try {
    const { userId } = params;
    if (!userId)
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    const data = await req.json(); // expect JSON body
    await set(ref(db, `${params.userId}`), data);

    return NextResponse.json(
      { message: "Profile updated", profile: data },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
