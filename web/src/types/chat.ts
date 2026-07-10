export interface Attachment {
  id: string;
  url: string;
  type: string;
  name: string;
}

export interface Message {
  id: string;
  sender: "user" | "angelica";
  content: string;
  timestamp: string;
  attachments?: Attachment[];
}

export interface Conversation {
  id: string;
  messages: Message[];
}
