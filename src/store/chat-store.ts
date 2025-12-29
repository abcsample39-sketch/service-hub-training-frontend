import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { API_URL, authFetch } from '@/lib/api';

interface Message {
    id: string;
    senderId: string;
    message: string;
    createdAt: string;
}

interface ChatState {
    isOpen: boolean;
    activeBookingId: string | null;
    messages: Message[];
    socket: Socket | null;
    currentUser: any; // In real app, typed User

    openChat: (bookingId: string, user: any) => void;
    closeChat: () => void;
    sendMessage: (msg: string) => void;
    setMessages: (msgs: Message[]) => void;
    addMessage: (msg: Message) => void;
    connectSocket: () => void;
    disconnectSocket: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    isOpen: false,
    activeBookingId: null,
    messages: [],
    socket: null,
    currentUser: null,

    connectSocket: () => {
        const socket = io(API_URL); // Backend URL
        set({ socket });

        socket.on('newMessage', (msg: Message) => {
            const { activeBookingId, messages } = get();
            // Only append if it belongs to current room (or handled by specific room events)
            set({ messages: [...messages, msg] });
        });
    },

    disconnectSocket: () => {
        get().socket?.disconnect();
        set({ socket: null });
    },

    openChat: async (bookingId, user) => {
        set({ isOpen: true, activeBookingId: bookingId, currentUser: user });
        const { socket } = get();

        if (socket) {
            socket.emit('joinRoom', bookingId);
        }

        // Fetch History
        try {
            const msgs = await authFetch<Message[]>(`chat/${bookingId}`);
            set({ messages: msgs });
        } catch (e) {
            console.error(e);
        }
    },

    closeChat: () => {
        set({ isOpen: false, activeBookingId: null, messages: [] });
    },

    sendMessage: (text: string) => {
        const { socket, activeBookingId, currentUser } = get();
        if (socket && activeBookingId) {
            const payload = {
                bookingId: activeBookingId,
                senderId: currentUser.id,
                message: text
            };
            socket.emit('sendMessage', payload);
        }
    },

    setMessages: (messages) => set({ messages }),
    addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
}));
