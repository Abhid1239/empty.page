"use client";

import { useState } from 'react';
import { Share2, Link as LinkIcon, Check } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SidebarProps {
    isLive: boolean;
    shareableLink: string;
    onShare: () => void;
}

export function Sidebar({ isLive, shareableLink, onShare }: SidebarProps) {
    const [copiedType, setCopiedType] = useState<'view' | 'edit' | null>(null);

    // This function handles the logic for copying the link to the clipboard
    const handleCopy = (type: 'view' | 'edit') => {
        // Note: In a real app, you'd add "?mode=view" for a read-only version
        const linkToCopy = shareableLink;
        navigator.clipboard.writeText(linkToCopy);
        setCopiedType(type);
        // Reset the "Copied!" message after 2 seconds
        setTimeout(() => setCopiedType(null), 2000);
    };

    return (
        <aside className="fixed right-0 top-11  bottom-0  p-2 flex flex-col">

            {/* Live Status Indicator */}
            <span className={`h-3 w-3 rounded-full ml-auto ${isLive ? 'bg-green-500 animate-pulse' : ''}`}></span>


            <div className="mt-auto">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            className="w-full"
                            onClick={() => {
                                // If the note isn't live yet, the onShare function will create it.
                                if (!isLive) {
                                    onShare();
                                }
                            }}
                        >
                            <Share2 className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Share this note</DialogTitle>
                            <DialogDescription>
                                Anyone with the link can edit this note in real-time. The note will be deleted in 24 hours.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col space-y-2 mt-4">
                            <p className="text-sm font-medium">Copy link with access:</p>
                            <Button variant="outline" onClick={() => handleCopy('edit')}>
                                {copiedType === 'edit' ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <LinkIcon className="mr-2 h-4 w-4" />}
                                {copiedType === 'edit' ? 'Copied!' : 'Copy Edit Link'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </aside>
    );
}