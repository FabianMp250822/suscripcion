
"use client";

import { useState, useEffect, type FormEvent, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare as MessageSquareIcon, Loader2, Send } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase/config";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  addDoc,
  serverTimestamp,
  updateDoc,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import type { Unsubscribe } from "firebase/firestore";

// Interface for a conversation (chat room)
interface ConversationParticipant {
  alias: string;
  photoURL: string;
  online?: boolean; // Future enhancement
}
interface Conversation {
  id: string;
  participantIds: string[];
  participants: { [key: string]: ConversationParticipant }; // Map of participant UID to their details
  lastMessage?: string;
  lastMessageTimestamp?: Timestamp;
  unreadCount?: number; // Future enhancement
}

// Interface for a message within a conversation
interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  timestamp: Timestamp | Date; // Firestore timestamp or Date for optimistic updates
  text: string; // This would be ciphertext in a real E2EE system
}

export default function MessagesPage() {
  const { user, userProfile } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Fetch user's conversations
  useEffect(() => {
    if (!user) {
      setLoadingConversations(false);
      return;
    }
    setLoadingConversations(true);
    console.log("Fetching conversations for user:", user.uid);
    const conversationsRef = collection(db, "conversations");
    const q = query(
      conversationsRef,
      where("participantIds", "array-contains", user.uid),
      orderBy("lastMessageTimestamp", "desc")
    );

    const unsubscribe: Unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedConversations: Conversation[] = [];
      querySnapshot.forEach((doc) => {
        fetchedConversations.push({ id: doc.id, ...doc.data() } as Conversation);
      });
      console.log("Fetched conversations:", fetchedConversations);
      setConversations(fetchedConversations);
      if (fetchedConversations.length > 0 && !selectedConversationId) {
        // Optionally auto-select first convo, or handle no selection state
        // setSelectedConversationId(fetchedConversations[0].id); 
      }
      setLoadingConversations(false);
    }, (error) => {
      console.error("Error fetching conversations: ", error);
      setLoadingConversations(false);
    });

    return () => unsubscribe();
  }, [user, selectedConversationId]); // Removed selectedConversationId from deps, usually not needed for fetching conversation list

  // Fetch messages for the selected conversation
  useEffect(() => {
    if (!selectedConversationId || !user) {
      setMessages([]);
      return;
    }
    setLoadingMessages(true);
    console.log("Fetching messages for conversation:", selectedConversationId);
    const messagesRef = collection(db, `conversations/${selectedConversationId}/messages`);
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe: Unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedMessages: Message[] = [];
      querySnapshot.forEach((doc) => {
        fetchedMessages.push({ id: doc.id, conversationId: selectedConversationId, ...doc.data() } as Message);
      });
      console.log("Fetched messages:", fetchedMessages);
      setMessages(fetchedMessages);
      setLoadingMessages(false);
    }, (error) => {
      console.error(`Error fetching messages for ${selectedConversationId}: `, error);
      setLoadingMessages(false);
    });

    return () => unsubscribe();
  }, [selectedConversationId, user]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversationId || !user || !userProfile) return;

    const currentMessageText = newMessage;
    setNewMessage(""); // Clear input optimistically

    try {
      const messageData = {
        senderId: user.uid,
        text: currentMessageText, // This is plain text. E2EE would encrypt this.
        timestamp: serverTimestamp(),
      };
      await addDoc(collection(db, `conversations/${selectedConversationId}/messages`), messageData);

      await updateDoc(doc(db, "conversations", selectedConversationId), {
        lastMessage: currentMessageText.length > 50 ? currentMessageText.substring(0,47) + "..." : currentMessageText,
        lastMessageTimestamp: serverTimestamp(),
      });
      
    } catch (error) {
      console.error("Error sending message: ", error);
      setNewMessage(currentMessageText); // Restore message if send failed
    }
  };
  
  const getOtherParticipantDetails = (conversation: Conversation): ConversationParticipant | null => {
    if (!user || !conversation.participantIds || !conversation.participants) return null;
    const otherId = conversation.participantIds.find(id => id !== user.uid);
    return otherId ? conversation.participants[otherId] : null;
  };

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);
  const otherParticipantDetailsInSelectedConvo = selectedConversation ? getOtherParticipantDetails(selectedConversation) : null;

  if (loadingConversations && conversations.length === 0 && !user) { 
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <MessageSquareIcon className="h-10 w-10 text-muted-foreground mb-3" />
        <p className="text-muted-foreground">Please log in to view messages.</p>
      </div>
    );
  }


  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height,100px)-2rem)] md:h-[calc(100vh-var(--header-height,60px)-4rem)]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Mensajes</h1>
        <p className="text-muted-foreground">Comunícate directamente con otros usuarios y miembros de tus grupos. Pagos vía Stripe.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0">
        <Card className="shadow-lg md:col-span-1 flex flex-col">
          <CardHeader>
            <CardTitle>Conversaciones</CardTitle>
            <CardDescription>Tus chats recientes</CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex-1 min-h-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-2">
                {loadingConversations && conversations.length === 0 && (
                     <div className="flex justify-center items-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                     </div>
                )}
                {!loadingConversations && conversations.length === 0 && (
                  <p className="text-center text-muted-foreground p-4">No tienes conversaciones todavía.</p>
                )}
                {conversations.map(conv => {
                  const otherP = getOtherParticipantDetails(conv);
                  if (!otherP) return null; // Should not happen if data structure is correct
                  return (
                    <Button
                      key={conv.id}
                      variant={selectedConversationId === conv.id ? "secondary" : "ghost"}
                      className="w-full justify-start h-auto p-3"
                      onClick={() => setSelectedConversationId(conv.id)}
                    >
                      <Avatar className="mr-3 h-10 w-10 border relative">
                        <AvatarImage src={otherP.photoURL || `https://placehold.co/40x40.png?text=${otherP.alias?.substring(0,2).toUpperCase()}`} alt={otherP.alias} data-ai-hint="profile avatar" />
                        <AvatarFallback>{otherP.alias?.substring(0,2).toUpperCase() || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left overflow-hidden">
                        <p className="font-semibold text-sm truncate">{otherP.alias}</p>
                        <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="shadow-lg md:col-span-2 flex flex-col">
          {selectedConversationId && selectedConversation && otherParticipantDetailsInSelectedConvo ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border relative">
                    <AvatarImage src={otherParticipantDetailsInSelectedConvo.photoURL || `https://placehold.co/40x40.png?text=${otherParticipantDetailsInSelectedConvo.alias?.substring(0,2).toUpperCase()}`} alt={otherParticipantDetailsInSelectedConvo.alias} data-ai-hint="profile avatar"/>
                    <AvatarFallback>{otherParticipantDetailsInSelectedConvo.alias?.substring(0,2).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{otherParticipantDetailsInSelectedConvo.alias}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0 min-h-0">
                <ScrollArea className="h-full p-4 space-y-4">
                  {loadingMessages ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                      <p className="text-muted-foreground">Cargando mensajes...</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <MessageSquareIcon className="w-12 h-12 text-muted-foreground mb-3" />
                      <p className="text-center text-muted-foreground">No hay mensajes en esta conversación. ¡Envía un saludo!</p>
                    </div>
                  ) : (
                    <>
                    {messages.map(msg => {
                      const isOwn = msg.senderId === user?.uid;
                      const senderDetails = isOwn ? userProfile : (selectedConversation?.participants[msg.senderId] || { alias: "Usuario", photoURL: "" });
                      let messageTimestamp: Date | null = null;
                      if (msg.timestamp instanceof Timestamp) {
                        messageTimestamp = msg.timestamp.toDate();
                      } else if (msg.timestamp instanceof Date) {
                        messageTimestamp = msg.timestamp;
                      }

                      return (
                        <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                          <div className={`flex items-end gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
                            {!isOwn && (
                              <Avatar className="h-6 w-6 border self-start">
                                <AvatarImage src={senderDetails?.photoURL || undefined} alt={senderDetails?.alias || 'User'} data-ai-hint="profile avatar"/>
                                <AvatarFallback>{senderDetails?.alias?.substring(0,1).toUpperCase() || 'U'}</AvatarFallback>
                              </Avatar>
                            )}
                            <div className={`max-w-[70%] p-3 rounded-lg shadow-md ${isOwn ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                              {!isOwn && <p className="text-xs font-semibold mb-0.5">{senderDetails?.alias}</p>}
                              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                              <p className={`text-xs mt-1 ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground/70"} ${isOwn ? 'text-right' : 'text-left'}`}>
                                {messageTimestamp ? messageTimestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Enviando...'}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                    </>
                  )}
                </ScrollArea>
              </CardContent>
              <form onSubmit={handleSendMessage} className="border-t p-4">
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Escribe tu mensaje..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    className="flex-1"
                    aria-label="Entrada de mensaje de chat"
                    disabled={loadingMessages || !selectedConversationId}
                  />
                  <Button type="submit" size="icon" aria-label="Enviar mensaje" disabled={!newMessage.trim() || loadingMessages || !selectedConversationId}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <CardContent className="flex flex-col items-center justify-center h-full">
              <MessageSquareIcon className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Selecciona una conversación para empezar a chatear.</p>
              { loadingConversations && conversations.length === 0 && !user && (
                 <p className="text-xs text-muted-foreground mt-2">O inicia sesión para ver tus mensajes.</p>
              )}
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
