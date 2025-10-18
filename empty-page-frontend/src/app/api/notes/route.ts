import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import Note from "@/models/Note";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    // Get the initial content from the user's local editor
    const { content } = await request.json();

    const note = await Note.create({
      content: content || "<h2>Welcome!</h2><p>Start typing here...</p>", // Use user's content
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 24 hours
    });

    return NextResponse.json({ success: true, data: note }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Server Error" },
      { status: 500 }
    );
  }
}
