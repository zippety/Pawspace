import React from 'react';
import { User, Bot } from 'lucide-react';
import type { Message } from '../../types';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`flex space-x-2 max-w-[80%] ${
          isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'
        }`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? 'bg-indigo-100' : 'bg-gray-100'
          }`}
        >
          {isUser ? (
            <User className="h-5 w-5 text-indigo-600" />
          ) : (
            <Bot className="h-5 w-5 text-gray-600" />
          )}
        </div>
        <div
          className={`p-3 rounded-lg ${
            isUser
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}
