import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { PreferenceForm } from './PreferenceForm';
import { useChatStore } from '../../store/chatStore';
import type { Message, TravelPreferences } from '../../types';

export function TravelChatbot() {
  const {
    messages,
    isLoading,
    preferences,
    addMessage,
    setPreferences,
    setLoading
  } = useChatStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    addMessage(userMessage);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          preferences
        })
      });

      const data = await response.json();
      addMessage({
        id: Date.now().toString(),
        role: 'assistant',
        content: data.message
      });
    } catch (error) {
      console.error('Chat error:', error);
      addMessage({
        id: Date.now().toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later."
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesSubmit = (prefs: TravelPreferences) => {
    setPreferences(prefs);
    addMessage({
      id: Date.now().toString(),
      role: 'assistant',
      content: `Thanks for sharing your preferences! I'll help you discover the perfect places in Ontario based on your ${prefs.travelStyle} style and budget of $${prefs.budget} for ${prefs.lengthOfStay} days.`
    });
  };

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Ontario Travel Assistant</h2>
        <p className="text-sm text-gray-600">Ask me anything about traveling in Ontario!</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!preferences ? (
          <PreferenceForm onSubmit={handlePreferencesSubmit} />
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        {isLoading && (
          <div className="flex items-center space-x-2 text-gray-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about places to visit, accommodations, or activities..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={!preferences || isLoading}
          />
          <button
            type="submit"
            disabled={!preferences || isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
