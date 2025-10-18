"use client";

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { useEditorStore } from '@/stores/editorStore';
import { Sidebar } from '@/components/Sidebar';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;
// A utility function to prevent a function from being called too frequently
function useDebounce(callback: (...args: any[]) => void, delay: number) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    return (...args: any[]) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => callback(...args), delay);
    };
}

export function EditorPage() {
    const params = useParams();
    const router = useRouter();

    // Get noteId from URL if it exists, otherwise it's null
    const noteId = params.noteId as string | null;

    // The single source of truth for the editor's content
    const { content, setContent } = useEditorStore();

    // Local state for UI and connection management
    const [shareableLink, setShareableLink] = useState('');
    const [isLive, setIsLive] = useState(false);
    const socketRef = useRef<Socket | null>(null);
    const isContentLoadedRef = useRef(false); // Prevents saving initial fetched data

    // Main logic hub: Activates only for shared notes (when noteId exists)
    useEffect(() => {
        if (noteId) {
            setIsLive(true);
            setShareableLink(`${window.location.origin}/notes/${noteId}`);
            console.log(BACKEND_URI, "hello")
            // 1. Connect to the real-time server
            const socket = io(BACKEND_URI);
            socketRef.current = socket;
            socket.emit('join_note', noteId);

            // 2. Listen for updates from collaborators
            socket.on('receive_text_update', (newContent: string) => {
                if (newContent !== useEditorStore.getState().content) {
                    setContent(newContent);
                }
            });

            // 3. Fetch the initial note content from the database
            const fetchNote = async () => {
                const res = await fetch(`/api/notes/${noteId}`);
                if (res.ok) {
                    const { data } = await res.json();
                    setContent(data.content);
                    isContentLoadedRef.current = true;
                }
            };
            fetchNote();

            // Clean up the connection when the user leaves
            return () => {
                socket.disconnect();
            };
        }
    }, [noteId, setContent]);

    // Turns a local note into a live, shared note
    const handleShare = async () => {
        try {
            const res = await fetch('/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });
            const { data } = await res.json();
            // Navigate to the new shareable URL, which triggers the useEffect above
            router.push(`/notes/${data._id}`);
        } catch (error) {
            console.error("Error creating shareable link:", error);
        }
    };

    // Debounced function for auto-saving and broadcasting changes
    const debouncedSave = useDebounce(async (newContent: string) => {
        if (isLive && noteId && socketRef.current) {
            // Broadcast changes to other users
            socketRef.current.emit('text_update', { noteId, content: newContent });
            // Save changes to the database
            await fetch(`/api/notes/${noteId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newContent }),
            });
        }
    }, 1000); // Waits 1 second after user stops typing

    // This function is passed to the editor to handle user input
    const handleContentChange = (newContent: string) => {
        // 1. Update the central Zustand store
        setContent(newContent);

        // 2. Trigger the auto-save/broadcast function
        if (isContentLoadedRef.current || !noteId) {
            debouncedSave(newContent);
        }
    };

    return (
        <div className="flex">
            <main className="flex-grow">
                <div className="w-full">
                    {/* The editor is now a "controlled" component */}
                    <SimpleEditor
                        content={content}
                        onChange={handleContentChange}
                    />
                </div>
            </main>
            <Sidebar
                isLive={isLive}
                shareableLink={shareableLink}
                onShare={handleShare}
            />
        </div>
    );
}