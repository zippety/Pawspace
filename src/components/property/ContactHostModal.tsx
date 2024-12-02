import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Send, AlertCircle } from 'lucide-react';
import { UserProfile } from '../../types/user';
import { useUserStore } from '../../store/userStore';
import { cn } from '../../utils/cn';
import { withErrorBoundary } from '../../utils/errorTracking';
import ErrorTracker from '../../utils/errorTracking';

interface ContactHostModalProps {
  isOpen: boolean;
  onClose: () => void;
  host: UserProfile;
  className?: string;
}

function ContactHostModalContent({
  isOpen,
  onClose,
  host,
  className,
}: ContactHostModalProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const contactHost = useUserStore((state) => state.contactHost);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      setError('Please enter a message');
      return;
    }

    try {
      setIsSending(true);
      setError(null);
      await contactHost(host.id, trimmedMessage);
      onClose();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error.message);
      ErrorTracker.logError(error, 'ContactHostModal.handleSubmit', {
        hostId: host.id,
        messageLength: trimmedMessage.length,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className={cn(
          "w-full max-w-md rounded-lg bg-white p-6 shadow-xl",
          className
        )}>
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold">
              Contact {host.fullName}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Your Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                disabled={isSending}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSending}
                className={cn(
                  "inline-flex items-center px-4 py-2 rounded-md text-white",
                  "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "transition-colors duration-200"
                )}
              >
                <Send className="h-4 w-4 mr-2" />
                {isSending ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export const ContactHostModal = withErrorBoundary('ContactHostModal')(ContactHostModalContent);
