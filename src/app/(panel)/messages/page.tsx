
"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Send, ShieldAlert, MessageSquare as MessageSquareIcon } from "lucide-react"; // Renamed to avoid conflict
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth"; // To get current user for sending messages
// TODO: Import Firestore functions for actual chat implementation

// Interface for a conversation (chat room)
interface Conversation {
  id: string; // e.g., uid1_uid2 (sorted alphabetically)
  participantIds: string[];
  participants: { [key: string]: { alias: string; photoURL: string; online?: boolean } }; // Store participant details for display
  lastMessage?: string; // Placeholder for actual ciphertext or snippet
  lastMessageTimestamp?: Date; // For sorting conversations
  unreadCount?: number; // For UI indication
}

// Interface for a message within a conversation
interface Message {
  id: string; // Firestore auto-ID
  conversationId: string;
  senderId: string;
  timestamp: Date;
  text: string; // Placeholder for actual ciphertext
  // In a real E2EE system, this would be `ciphertext: string;`
}

// Mock data - This will be replaced by Firestore data
const initialMockConversations: Conversation[] = [
  {
    id: "user1_user2",
    participantIds: ["user1", "user2"],
    participants: {
      user1: { alias: "Alice W.", photoURL: "https://placehold.co/40x40.png?text=AW", online: true },
      user2: { alias: "You", photoURL: "https://placehold.co/40x40.png?text=U" }, // 'You' would be dynamically determined
    },
    lastMessage: "Hey, about the Netflix spot...",
    lastMessageTimestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    unreadCount: 2,
  },
  {
    id: "user2_user3",
    participantIds: ["user2", "user3"],
    participants: {
      user2: { alias: "You", photoURL: "https://placehold.co/40x40.png?text=U" },
      user3: { alias: "Bob B.", photoURL: "https://placehold.co/40x40.png?text=BB", online: false },
    },
    lastMessage: "Payment sent for Spotify!",
    lastMessageTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // Yesterday
  },
  {
    id: "support_user2",
    participantIds: ["support", "user2"],
    participants: {
      support: { alias: "Support Team", photoURL: "https://placehold.co/40x40.png?text=ST", online: true },
      user2: { alias: "You", photoURL: "https://placehold.co/40x40.png?text=U" },
    },
    lastMessage: "Your query #123 has been updated.",
    lastMessageTimestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    unreadCount: 1,
  },
];

const initialMockMessages: { [conversationId: string]: Message[] } = {
  "user1_user2": [
    { id: "m1", conversationId: "user1_user2", senderId: "user1", text: "Hey, is the Netflix spot still available?", timestamp: new Date(Date.now() - 1000 * 60 * 7) },
    { id: "m2", conversationId: "user1_user2", senderId: "user2", text: "Yes, it is! Are you interested?", timestamp: new Date(Date.now() - 1000 * 60 * 6) },
    { id: "m3", conversationId: "user1_user2", senderId: "user1", text: "Great! How do I proceed?", timestamp: new Date(Date.now() - 1000 * 60 * 5) },
  ],
  "user2_user3": [
    { id: "m5", conversationId: "user2_user3", senderId: "user3", text: "Just sent the payment for the Spotify group. Please confirm.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25) },
    { id: "m6", conversationId: "user2_user3", senderId: "user2", text: "Received! Thanks Bob.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  ],
   "support_user2": [
    { id: "m8", conversationId: "support_user2", senderId: "support", text: "Hello, regarding your query #123 about payment failure: We've identified the issue and it should now be resolved. Please try again.", timestamp: new Date(Date.now() - 1000 * 60 * 32) },
    { id: "m9", conversationId: "support_user2", senderId: "user2", text: "Okay, thank you for the update!", timestamp: new Date(Date.now() - 1000 * 60 * 30) },
  ]
};


export default function MessagesPage() {
  const { user, userProfile } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    // TODO: Fetch user's conversations from Firestore's 'chats' collection
    // Query where participantIds array contains user.uid
    // For each conversation, fetch participant details (alias, photoURL) from 'users' collection if not already denormalized.
    // Order conversations by lastMessageTimestamp.
    setConversations(initialMockConversations); // Using mock data for now
    if (initialMockConversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(initialMockConversations[0].id);
    }
    setLoadingConversations(false);
  }, [user]);

  useEffect(() => {
    if (selectedConversationId && user) {
      setLoadingMessages(true);
      // TODO: Fetch messages for the selectedConversationId from its 'messages' subcollection in Firestore
      // Order messages by timestamp.
      // Mark messages as read.
      setMessages(initialMockMessages[selectedConversationId] || []); // Using mock data
      setLoadingMessages(false);
    } else {
      setMessages([]);
    }
  }, [selectedConversationId, user]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversationId || !user) return;

    // In a real E2EE system:
    // 1. Get recipient's public key.
    // 2. Encrypt `newMessage` using recipient's public key.
    // 3. The encrypted text is what you'd save as `ciphertext`.
    const messageData = {
      conversationId: selectedConversationId,
      senderId: user.uid,
      text: newMessage, // This would be `ciphertext`
      timestamp: new Date(),
    };

    // TODO: Save `messageData` to the 'messages' subcollection of the selectedConversationId in Firestore.
    // TODO: Update `lastMessage` and `lastMessageTimestamp` in the parent conversation document.
    console.log("Sending message (mock):", messageData);

    // Optimistically update UI (remove when Firestore listener is in place)
    const optimisticMessage: Message = { ...messageData, id: `temp_${Date.now()}` };
    setMessages(prev => [...prev, optimisticMessage]);
    
    // Update mock conversation's last message (remove when Firestore listener is in place)
    setConversations(prevConvos => prevConvos.map(c => 
      c.id === selectedConversationId 
      ? {...c, lastMessage: newMessage, lastMessageTimestamp: new Date()}
      : c
    ).sort((a,b) => (b.lastMessageTimestamp?.getTime() || 0) - (a.lastMessageTimestamp?.getTime() || 0)));

    setNewMessage("");
  };

  const getOtherParticipant = (conversation: Conversation) => {
    if (!user || !conversation.participantIds) return null;
    const otherId = conversation.participantIds.find(id => id !== user.uid);
    return otherId ? conversation.participants[otherId] : null;
  };
  
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);
  const otherParticipantDetails = selectedConversation ? getOtherParticipant(selectedConversation) : null;


  if (loadingConversations) {
    return <div className="flex justify-center items-center h-full"><p>Loading conversations...</p></div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height,100px)-2rem)] md:h-[calc(100vh-var(--header-height,60px)-4rem)]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Communicate with other users and group members.</p>
      </div>

      <Alert variant="destructive" className="mb-6">
        <ShieldAlert className="h-5 w-5" />
        <AlertTitle className="font-semibold">Important: Chat Security Placeholder</AlertTitle>
        <AlertDescription>
          This chat interface is a **demonstration only**. True End-to-End Encryption (E2EE) requires complex client-side cryptographic implementations (like key generation, secure private key storage, encryption/decryption).
          **Messages sent here are NOT currently encrypted and are visible in plain text in this mock setup.** Do not share sensitive information.
        </AlertDescription>
      </Alert>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0">
        {/* Conversations List */}
        <Card className="shadow-lg md:col-span-1 flex flex-col">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
            <CardDescription>Your recent chats</CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex-1 min-h-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-2">
                {conversations.map(conv => {
                  const otherP = getOtherParticipant(conv);
                  if (!otherP) return null; // Should not happen if data is correct
                  return (
                    <Button
                      key={conv.id}
                      variant={selectedConversationId === conv.id ? "secondary" : "ghost"}
                      className="w-full justify-start h-auto p-3"
                      onClick={() => setSelectedConversationId(conv.id)}
                    >
                      <Avatar className="mr-3 h-10 w-10 border relative">
                        <AvatarImage src={otherP.photoURL} alt={otherP.alias} data-ai-hint="profile avatar" />
                        <AvatarFallback>{otherP.alias?.substring(0,2).toUpperCase()}</AvatarFallback>
                        {otherP.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>}
                      </Avatar>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-sm">{otherP.alias}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[150px]">{conv.lastMessage}</p>
                      </div>
                      {conv.unreadCount && conv.unreadCount > 0 && (
                        <span className="ml-auto text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                          {conv.unreadCount}
                        </span>
                      )}
                    </Button>
                  );
                })}
                 {conversations.length === 0 && <p className="text-center text-muted-foreground p-4">No conversations yet.</p>}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="shadow-lg md:col-span-2 flex flex-col">
          {selectedConversation && otherParticipantDetails ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border relative">
                        <AvatarImage src={otherParticipantDetails.photoURL} alt={otherParticipantDetails.alias} data-ai-hint="profile avatar"/>
                        <AvatarFallback>{otherParticipantDetails.alias?.substring(0,2).toUpperCase()}</AvatarFallback>
                         {otherParticipantDetails.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>}
                    </Avatar>
                    <div>
                        <CardTitle className="text-lg">{otherParticipantDetails.alias}</CardTitle>
                        <CardDescription className="text-xs">{otherParticipantDetails.online ? "Online" : "Offline"}</CardDescription>
                    </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0 min-h-0">
                <ScrollArea className="h-full p-4 space-y-4">
                  {loadingMessages ? <p className="text-center text-muted-foreground">Loading messages...</p> :
                   messages.length === 0 ? <p className="text-center text-muted-foreground">No messages in this conversation yet. Say hi!</p> :
                   messages.map(msg => {
                    const isOwn = msg.senderId === user?.uid;
                    const senderDetails = isOwn ? userProfile : otherParticipantDetails;
                    return (
                      <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                        <div className={`flex items-end gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
                           {!isOwn && (
                             <Avatar className="h-6 w-6 border self-start">
                                <AvatarImage src={senderDetails?.photoURL || undefined} alt={senderDetails?.alias || 'User'} data-ai-hint="profile avatar"/>
                                <AvatarFallback>{senderDetails?.alias?.substring(0,1).toUpperCase() || 'U'}</AvatarFallback>
                             </Avatar>
                           )}
                          <div className={`max-w-[70%] p-3 rounded-lg ${isOwn ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                            {!isOwn && <p className="text-xs font-semibold mb-0.5">{senderDetails?.alias}</p>}
                            <p className="text-sm whitespace-pre-wrap">{msg.text /* This would be decrypted text */}</p>
                            <p className={`text-xs mt-1 ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground/70"} ${isOwn ? 'text-right' : 'text-left'}`}>
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </ScrollArea>
              </CardContent>
              <form onSubmit={handleSendMessage} className="border-t p-4">
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Type your message (not encrypted)..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    className="flex-1"
                    aria-label="Chat message input"
                  />
                  <Button type="submit" size="icon" aria-label="Send message" disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <CardContent className="flex flex-col items-center justify-center h-full">
              <MessageSquareIcon className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Select a conversation to start chatting.</p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
