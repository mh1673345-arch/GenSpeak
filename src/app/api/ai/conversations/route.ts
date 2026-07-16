import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Auto-create user record in DB if not exists so relations resolve
    let user = await db.user.findUnique({
      where: { email }
    });
    if (!user) {
      user = await db.user.create({
        data: {
          email,
          name: email.split("@")[0]
        }
      });
    }

    const conversations = await db.aiConversation.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" }
    });

    const parsed = conversations.map(c => ({
      id: c.id,
      title: c.title,
      messages: JSON.parse(c.messages),
      createdAt: c.createdAt,
      updatedAt: c.updatedAt
    }));

    return NextResponse.json(parsed);
  } catch (err: unknown) {
    console.error(err);
    const errorObj = err as Error;
    return NextResponse.json({ error: errorObj.message || "Internal error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, email, title, messages } = body;
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    let user = await db.user.findUnique({
      where: { email }
    });
    if (!user) {
      user = await db.user.create({
        data: {
          email,
          name: email.split("@")[0]
        }
      });
    }

    const saved = await db.aiConversation.upsert({
      where: { id: id || "temp-id-to-fail" },
      update: {
        title: title || "AI Chat Session",
        messages: JSON.stringify(messages)
      },
      create: {
        id: id || undefined,
        userId: user.id,
        title: title || "AI Chat Session",
        messages: JSON.stringify(messages)
      }
    });

    return NextResponse.json({
      id: saved.id,
      title: saved.title,
      messages: JSON.parse(saved.messages),
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt
    });
  } catch (err: unknown) {
    console.error(err);
    const errorObj = err as Error;
    return NextResponse.json({ error: errorObj.message || "Internal error" }, { status: 500 });
  }
}
