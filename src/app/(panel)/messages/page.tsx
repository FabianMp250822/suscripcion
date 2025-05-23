
"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Send, ShieldAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const mockConversations = [
  { id: "c1", name: "Alice Wonderland", lastMessage: "Hey, about the Netflix spot...", avatar: "https://placehold.co/40x40.png?text=AW", unread: 2, online: true },
  { id: "c2", name: "Bob The Builder", lastMessage: "Payment sent for Spotify!", avatar: "https://placehold.co/40x40.png?text=BB", unread: 0, online: false },
  { id: "c3", name: "Charlie Chaplin", lastMessage: "Can I join your HBO group?", avatar: "https://placehold.co/40x40.png?text=CC", unread: 0, online: true },
  { id: "c4", name: "Support Team", lastMessage: "Your query #123 has been updated.", avatar: "https://placehold.co/40x40.png?text=ST", unread: 1, online: true },
];

const mockMessages: { [key: string]: { id: string, sender: string, text: string, time: string, isOwn: boolean }[] } = {
  c1: [
    { id: "m1", sender: "Alice Wonderland", text: "Hey, is the Netflix spot still available?", time: "10:00 AM", isOwn: false },
    { id: "m2", sender: "You", text: "Yes, it is! Are you interested?", time: "10:01 AM", isOwn: true },
    { id: "m3", sender: "Alice Wonderland", text: "Great! How do I proceed?", time: "10:02 AM", isOwn: false },
    { id: "m4", sender: "You", text: "I'll send you the details.", time: "10:03 AM", isOwn: true },
  ],
  c2: [
    { id: "m5", sender: "Bob The Builder", text: "Just sent the payment for the Spotify group. Please confirm.", time: "Yesterday", isOwn: false },
    { id: "m6", sender: "You", text: "Received! Thanks Bob.", time: "Yesterday", isOwn: true },
  ],
  c3: [
     { id: "m7", sender: "Charlie Chaplin", text: "Hi, I'm interested in your HBO Max shared group. Are there any spots left?", time: "Mon", isOwn: false },
  ],
  c4: [
    { id: "m8", sender: "Support Team", text: "Hello, regarding your query #123 about payment failure: We've identified the issue and it should now be resolved. Please try again.", time: "09:30 AM", isOwn: false },
    { id: "m9", sender: "You", text: "Okay, thank you for the update!", time: "09:32 AM", isOwn: true },
  ]
};


export default function MessagesPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(mockConversations[0]?.id || null);
  const [newMessage, setNewMessage] = useState("");

  const selectedConversation = mockConversations.find(c => c.id === selectedConversationId);
  const messages = selectedConversationId ? mockMessages[selectedConversationId] || [] : [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversationId) return;
    // In a real app, this would send the message to a backend
    console.log("Sending message:", newMessage, "to conversation:", selectedConversationId);
    // Add to mock messages for UI update (not persistent)
    mockMessages[selectedConversationId]?.push({
        id: `m${Math.random()}`,
        sender: "You",
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true
    });
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height,100px)-2rem)] md:h-[calc(100vh-var(--header-height,60px)-4rem)]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Communicate with other users and group members.</p>
      </div>

      <Alert variant="default" className="mb-6 bg-yellow-50 border-yellow-300 text-yellow-700">
        <ShieldAlert className="h-5 w-5 !text-yellow-600" />
        <AlertTitle className="font-semibold !text-yellow-800">End-to-End Encryption Placeholder</AlertTitle>
        <AlertDescription className="!text-yellow-700">
          This chat interface is a functional demonstration. True end-to-end encryption for secure P2P communication is a complex feature that would require significant backend and cryptographic implementation. User messages are not currently encrypted in this mock-up.
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
                {mockConversations.map(conv => (
                  <Button
                    key={conv.id}
                    variant={selectedConversationId === conv.id ? "secondary" : "ghost"}
                    className="w-full justify-start h-auto p-3"
                    onClick={() => setSelectedConversationId(conv.id)}
                  >
                    <Avatar className="mr-3 h-10 w-10 border">
                      <AvatarImage src={conv.avatar} alt={conv.name} data-ai-hint="profile avatar" />
                      <AvatarFallback>{conv.name.substring(0,2).toUpperCase()}</AvatarFallback>
                       {conv.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>}
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-sm">{conv.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                    </div>
                    {conv.unread > 0 && (
                      <span className="ml-auto text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                        {conv.unread}
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="shadow-lg md:col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border">
                        <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} data-ai-hint="profile avatar"/>
                        <AvatarFallback>{selectedConversation.name.substring(0,2).toUpperCase()}</AvatarFallback>
                         {selectedConversation.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>}
                    </Avatar>
                    <div>
                        <CardTitle className="text-lg">{selectedConversation.name}</CardTitle>
                        <CardDescription className="text-xs">{selectedConversation.online ? "Online" : "Offline"}</CardDescription>
                    </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0 min-h-0">
                <ScrollArea className="h-full p-4 space-y-4">
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] p-3 rounded-lg ${msg.isOwn ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                        {!msg.isOwn && <p className="text-xs font-semibold mb-0.5">{msg.sender}</p>}
                        <p className="text-sm">{msg.text}</p>
                        <p className={`text-xs mt-1 ${msg.isOwn ? "text-primary-foreground/70" : "text-muted-foreground/70"} ${msg.isOwn ? 'text-right' : 'text-left'}`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
              <form onSubmit={handleSendMessage} className="border-t p-4">
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Type your message..."
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
              <MessageSquare className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Select a conversation to start chatting.</p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
