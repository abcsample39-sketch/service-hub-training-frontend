'use client';

import { useEffect, useRef } from 'react';
import { useChatStore } from '@/store/chat-store';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ChatOverlay() {
    const { isOpen, closeChat, messages, sendMessage, currentUser, connectSocket, disconnectSocket } = useChatStore();
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        connectSocket();
        return () => disconnectSocket();
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    if (!isOpen) return null;

    const handleSend = () => {
        if (inputRef.current?.value) {
            sendMessage(inputRef.current.value);
            inputRef.current.value = '';
        }
    };

    return (
        <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-50 flex flex-col">
            {/* Header */}
            <div className="bg-black text-white p-4 flex justify-between items-center border-b-4 border-black">
                <div>
                    <h3 className="font-bold text-lg">Support Chat</h3>
                    <p className="text-xs text-gray-400">Booking Support</p>
                </div>
                <button onClick={closeChat} className="hover:bg-gray-800 p-1 rounded">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg, idx) => {
                    const isMe = msg.senderId === currentUser?.id;
                    return (
                        <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 border-2 border-black font-medium ${isMe ? 'bg-black text-white rounded-l-xl rounded-tr-xl' : 'bg-white text-black rounded-r-xl rounded-tl-xl'}`}>
                                {msg.message}
                                <div className={`text-[10px] mt-1 ${isMe ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input */}
            <div className="p-4 border-t-4 border-black bg-white flex gap-2">
                <Input
                    ref={inputRef}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    className="font-bold border-2 border-black rounded-none focus-visible:ring-0"
                />
                <Button onClick={handleSend} className="bg-black hover:bg-gray-800 text-white border-2 border-black rounded-none">
                    <Send className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
