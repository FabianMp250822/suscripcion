
"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldAlert, MessageSquare as MessageSquareIcon, Loader2 } from "lucide-react"; // Renamed to avoid conflict
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase/config";
import { collection, query, where, onSnapshot, orderBy, doc, getDoc, addDoc, serverTimestamp, updateDoc, arrayUnion } from "firebase/firestore";
import type { Unsubscribe, Timestamp } from "firebase/firestore";


// Interface for a conversation (chat room)
interface Conversation {
  id: string; // e.g., uid1_uid2 (sorted alphabetically)
  participantIds: string[];
  participants: { [key: string]: { alias: string; photoURL: string; online?: boolean } }; // Store participant details for display
  lastMessage?: string; // Placeholder for actual ciphertext or snippet
  lastMessageTimestamp?: Timestamp; // For sorting conversations
  unreadCount?: number; // For UI indication
}

// Interface for a message within a conversation
interface Message {
  id: string; // Firestore auto-ID
  conversationId: string;
  senderId: string;
  timestamp: Timestamp;
  text: string; // Placeholder for actual ciphertext
  // In a real E2EE system, this would be `ciphertext: string;`
}

// Mock data - This will be replaced by Firestore data
const initialMockConversations: Conversation[] = [
  // Example data removed
];

const initialMockMessages: { [conversationId: string]: Message[] } = {
  // Example data removed
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
    
    // Simulating fetch, will be empty now
    setConversations(initialMockConversations); 
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
      
      // Simulating fetch, will be empty now
      setMessages(initialMockMessages[selectedConversationId] || []); 
      setLoadingMessages(false);
    } else {
      setMessages([]);
    }
  }, [selectedConversationId, user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversationId || !user || !userProfile) return;

    // In a real E2EE system:
    // 1. Get recipient's public key.
    // 2. Encrypt `newMessage` using recipient's public key.
    // 3. The encrypted text is what you'd save as `ciphertext`.
    
    // TODO: Replace with actual Firestore save logic
    const messageData = {
      conversationId: selectedConversationId,
      senderId: user.uid,
      text: newMessage, // This would be `ciphertext`
      timestamp: serverTimestamp(), // Use Firestore server timestamp
    };

    try {
        // Example: await addDoc(collection(db, `conversations/${selectedConversationId}/messages`), messageData);
        // Example: await updateDoc(doc(db, "conversations", selectedConversationId), {
        //   lastMessage: newMessage, // or ciphertext snippet
        //   lastMessageTimestamp: serverTimestamp(),
        // });
        console.log("Sending message (mock, to be replaced with Firestore):", messageData);

        // Optimistically update UI - remove when Firestore listener for messages is in place
        const optimisticMessage: Message = { 
            ...messageData, 
            id: `temp_${Date.now()}`,
            timestamp: new Date() as unknown as Timestamp // For optimistic UI
        };
        setMessages(prev => [...prev, optimisticMessage]);
        
        setConversations(prevConvos => prevConvos.map(c => 
          c.id === selectedConversationId 
          ? {...c, lastMessage: newMessage, lastMessageTimestamp: new Date() as unknown as Timestamp } // For optimistic UI
          : c
        ).sort((a,b) => (b.lastMessageTimestamp?.toDate().getTime() || 0) - (a.lastMessageTimestamp?.toDate().getTime() || 0)));

        setNewMessage("");
    } catch (error) {
        console.error("Error sending message: ", error);
        // Potentially show a toast to the user
    }
  };

  const getOtherParticipant = (conversation: Conversation) => {
    if (!user || !conversation.participantIds) return null;
    // Ensure user.uid is used if userProfile is not yet loaded.
    const currentUserId = userProfile?.uid || user.uid;
    const otherId = conversation.participantIds.find(id => id !== currentUserId);
    return otherId ? conversation.participants[otherId] : null;
  };
  
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);
  const otherParticipantDetails = selectedConversation ? getOtherParticipant(selectedConversation) : null;


  if (loadingConversations) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
        <p className="text-muted-foreground">Cargando conversaciones...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height,100px)-2rem)] md:h-[calc(100vh-var(--header-height,60px)-4rem)]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Mensajes</h1>
        <p className="text-muted-foreground">Comunícate directamente con otros usuarios y miembros de tus grupos. Pagos vía Stripe.</p>
      </div>

      <Alert variant="destructive" className="mb-6">
        <ShieldAlert className="h-5 w-5" />
        <AlertTitle className="font-semibold">Importante: Seguridad del Chat (Demostración)</AlertTitle>
        <AlertDescription>
          Esta interfaz de chat es una **demostración funcional básica** y **NO IMPLEMENTA CIFRADO DE EXTREMO A EXTREMO (E2EE)**.
          Los mensajes enviados aquí viajan y se almacenan en texto plano (simulado). 
          **NO COMPARTAS INFORMACIÓN SENSIBLE.** La implementación de E2EE robusto es un proceso complejo de criptografía del lado del cliente.
        </AlertDescription>
      </Alert>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0">
        {/* Conversations List */}
        <Card className="shadow-lg md:col-span-1 flex flex-col">
          <CardHeader>
            <CardTitle>Conversaciones</CardTitle>
            <CardDescription>Tus chats recientes</CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex-1 min-h-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-2">
                {conversations.length === 0 && !loadingConversations && (
                    <p className="text-center text-muted-foreground p-4">No tienes conversaciones todavía. Intenta iniciar una desde el perfil de un usuario o un grupo.</p>
                )}
                {conversations.map(conv => {
                  const otherP = getOtherParticipant(conv);
                  // If otherP is null (e.g., a chat with oneself or data issue), skip rendering
                  if (!otherP) return null; 
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
                        <CardDescription className="text-xs">{otherParticipantDetails.online ? "En línea" : "Desconectado"}</CardDescription>
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
                        <p className="text-center text-muted-foreground">No hay mensajes en esta conversación todavía. ¡Envía un saludo!</p>
                    </div>
                   ) :
                   messages.map(msg => {
                    const isOwn = msg.senderId === (userProfile?.uid || user?.uid);
                    // Determine sender details (could be current user or other participant)
                    // For mock purposes, assume if not own, it's otherParticipantDetails
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
                              {msg.timestamp instanceof Date ? msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date(msg.timestamp?.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                    placeholder="Escribe tu mensaje (no cifrado)..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    className="flex-1"
                    aria-label="Entrada de mensaje de chat"
                  />
                  <Button type="submit" size="icon" aria-label="Enviar mensaje" disabled={!newMessage.trim() || loadingMessages}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <CardContent className="flex flex-col items-center justify-center h-full">
              <MessageSquareIcon className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Selecciona una conversación para empezar a chatear.</p>
               <p className="text-xs text-muted-foreground mt-2">(O crea una nueva desde el perfil de un usuario).</p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
