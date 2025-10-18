import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Note from "@/models/Note";

// --- GET: Fetch a single note by its ID ---
export async function GET(
  request: Request,
  { params }: { params: { noteId: string } }
) {
  await dbConnect();
  const { noteId } = params;

  try {
    const note = await Note.findById(noteId);
    if (!note) {
      return NextResponse.json(
        { success: false, error: "Note not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: note }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Server Error" },
      { status: 500 }
    );
  }
}

// --- PUT: Update a note's content by its ID ---
export async function PUT(
  request: Request,
  { params }: { params: { noteId: string } }
) {
  await dbConnect();
  const { noteId } = params;

  try {
    const { content } = await request.json(); // Get the new content from the request body.

    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { content },
      { new: true, runValidators: true } // Return the updated document.
    );

    if (!updatedNote) {
      return NextResponse.json(
        { success: false, error: "Note not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedNote },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Server Error" },
      { status: 500 }
    );
  }
}
