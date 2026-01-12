import React from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

const ChatButton: React.FC<ChatButtonProps> = ({ onClick, isOpen }) => {
  if (isOpen) return null;

  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-40",
        "w-16 h-16 rounded-full gradient-primary shadow-glow",
        "flex items-center justify-center",
        "hover:scale-110 active:scale-95 transition-transform duration-200",
        "group"
      )}
    >
      <div className="relative">
        <MessageCircle className="w-7 h-7 text-primary-foreground" />
        <Sparkles className="w-4 h-4 text-primary-foreground absolute -top-1 -right-1 animate-pulse-soft" />
      </div>
      
      {/* Pulse animation */}
      <span className="absolute inset-0 rounded-full gradient-primary opacity-50 animate-ping" />
    </button>
  );
};

export default ChatButton;
