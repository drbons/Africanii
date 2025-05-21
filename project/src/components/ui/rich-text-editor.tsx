import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, List, Hash, AtSign, MapPin, BarChart2, CalendarCheck } from 'lucide-react';
import { Button } from './button';
import { EmojiPicker } from './emoji-picker';

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onTypingChange?: (isTyping: boolean) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
}

// Utility to enforce LTR markers and strip RTL markers
function enforceLTRMarkers(html: string) {
  if (!html) return '';
  
  // Remove any existing directional markers first
  const cleaned = html.replace(/[\u202A-\u202E\u061C\u200E\u200F\u2066-\u2069]/g, '');
  
  // Add LTR marker at the beginning and end of each block element
  // This adds stronger LTR control characters that override browser/system settings
  return `\u202A${cleaned}\u202C`;
}

// Add global html element LTR enforcement
const createLTRStyle = () => {
  const style = document.createElement('style');
  style.id = 'force-ltr-global';
  style.innerHTML = `
    /* Global LTR styling */
    [contenteditable="true"] {
      direction: ltr !important;
      unicode-bidi: plaintext !important;
      text-align: left !important;
      writing-mode: horizontal-tb !important;
    }
    [contenteditable="true"] * {
      direction: ltr !important;
      unicode-bidi: plaintext !important;
      text-align: left !important;
      writing-mode: horizontal-tb !important;
    }
    .force-ltr {
      direction: ltr !important;
      text-align: left !important;
      unicode-bidi: plaintext !important;
      writing-mode: horizontal-tb !important;
    }
  `;
  return style;
};

export function RichTextEditor({
  value,
  onChange,
  onTypingChange,
  placeholder = "What's on your mind?",
  minHeight = "100px",
  className = "",
}: RichTextEditorProps) {
  const [isFormatMenuOpen, setIsFormatMenuOpen] = useState(false);
  const [isMentionMenuOpen, setIsMentionMenuOpen] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionResults, setMentionResults] = useState<string[]>([]);
  const [lastTypingEvent, setLastTypingEvent] = useState(0);
  const editorRef = useRef<HTMLDivElement>(null);
  const mentionMenuRef = useRef<HTMLDivElement>(null);

  // Add global LTR style on mount
  useEffect(() => {
    if (!document.getElementById('force-ltr-global')) {
      document.head.appendChild(createLTRStyle());
    }
    
    return () => {
      const existingStyle = document.getElementById('force-ltr-global');
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);

  // Handle typing events with debounce
  useEffect(() => {
    if (!onTypingChange) return;

    const typingTimeout = 2000; // 2 seconds
    
    if (Date.now() - lastTypingEvent > typingTimeout) {
      onTypingChange(true);
    }
    
    const timer = setTimeout(() => {
      onTypingChange(false);
    }, typingTimeout);
    
    return () => clearTimeout(timer);
  }, [lastTypingEvent, onTypingChange]);

  useEffect(() => {
    // Handle clicks outside the mention menu
    const handleClickOutside = (event: MouseEvent) => {
      if (mentionMenuRef.current && !mentionMenuRef.current.contains(event.target as Node)) {
        setIsMentionMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Force LTR direction on the document and html elements
  useEffect(() => {
    // Set document-level direction
    document.documentElement.setAttribute('dir', 'ltr');
    document.body.setAttribute('dir', 'ltr');
    document.body.style.direction = 'ltr';
    document.body.style.textAlign = 'left';
  }, []);

  // Ensure proper text direction on mount and when value changes
  useEffect(() => {
    if (editorRef.current) {
      // Apply all LTR styling forcefully
      editorRef.current.setAttribute('dir', 'ltr');
      editorRef.current.style.direction = 'ltr';
      editorRef.current.style.unicodeBidi = 'plaintext';
      editorRef.current.style.textAlign = 'left';
      
      // Additional force for LTR display
      editorRef.current.style.writingMode = 'horizontal-tb';
      editorRef.current.style.textOrientation = 'mixed';
      
      // Force LTR Unicode control characters
      const content = editorRef.current.innerHTML;
      if (content && !content.startsWith('\u202A')) {
        editorRef.current.innerHTML = enforceLTRMarkers(content);
      }
      
      // Apply to all child elements
      const childElements = editorRef.current.querySelectorAll('*');
      childElements.forEach(element => {
        (element as HTMLElement).setAttribute('dir', 'ltr');
        (element as HTMLElement).style.direction = 'ltr';
        (element as HTMLElement).style.unicodeBidi = 'plaintext';
        (element as HTMLElement).style.textAlign = 'left';
      });
    }
  }, [value]);

  // Set up proper input handling on mount
  useEffect(() => {
    if (editorRef.current) {
      // Remove any existing event listener to avoid duplication
      editorRef.current.removeEventListener('input', handleInput as any);
      
      // Add the input event listener directly
      editorRef.current.addEventListener('input', handleInput as any);
      
      // Apply all LTR styling
      editorRef.current.setAttribute('dir', 'ltr');
      editorRef.current.style.direction = 'ltr';
      editorRef.current.style.unicodeBidi = 'plaintext';
      editorRef.current.style.textAlign = 'left';
      
      // Force LTR Unicode control characters
      const content = editorRef.current.innerHTML;
      if (content && !content.startsWith('\u202A')) {
        editorRef.current.innerHTML = enforceLTRMarkers(content);
      }
    }
    
    // Clean up event listener on unmount
    return () => {
      editorRef.current?.removeEventListener('input', handleInput as any);
    };
  }, []);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    // Get the HTML content from the editor
    const content = e.currentTarget.innerHTML;
    
    // Enforce LTR at the HTML level with Unicode direction override
    const ltrContent = enforceLTRMarkers(content);
    
    // Force reset the content with LTR direction
    if (editorRef.current) {
      // Apply all LTR styling forcefully
      editorRef.current.setAttribute('dir', 'ltr');
      editorRef.current.style.direction = 'ltr';
      editorRef.current.style.unicodeBidi = 'plaintext';
      editorRef.current.style.textAlign = 'left';
      editorRef.current.style.writingMode = 'horizontal-tb';
      editorRef.current.style.textOrientation = 'mixed';
      
      // Set the current caret position
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      let cursorPosition = -1;
      if (range) {
        cursorPosition = range.startOffset;
      }
      
      editorRef.current.removeEventListener('input', handleInput as any);
      editorRef.current.innerHTML = ltrContent;
      
      // Apply to all child elements
      const childElements = editorRef.current.querySelectorAll('*');
      childElements.forEach(element => {
        (element as HTMLElement).setAttribute('dir', 'ltr');
        (element as HTMLElement).style.direction = 'ltr';
        (element as HTMLElement).style.unicodeBidi = 'plaintext';
        (element as HTMLElement).style.textAlign = 'left';
      });
      
      // Restore cursor position if possible
      if (cursorPosition >= 0 && selection) {
        try {
          const newRange = document.createRange();
          newRange.setStart(editorRef.current.childNodes[0] || editorRef.current, Math.min(cursorPosition, (editorRef.current.childNodes[0]?.textContent || '').length));
          newRange.setEnd(editorRef.current.childNodes[0] || editorRef.current, Math.min(cursorPosition, (editorRef.current.childNodes[0]?.textContent || '').length));
          selection.removeAllRanges();
          selection.addRange(newRange);
        } catch (err) {
          console.log('Error restoring cursor position:', err);
        }
      }
      
      // Reset the event listener
      setTimeout(() => {
        editorRef.current?.addEventListener('input', handleInput as any);
      }, 0);
    }
    
    // Set content and trigger typing event
    onChange(ltrContent);
    setLastTypingEvent(Date.now());
    
    // Check for @ symbol to trigger mention menu
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const text = ltrContent.slice(0, range.startOffset);
      const lastAtSymbol = text.lastIndexOf('@');
      if (lastAtSymbol !== -1 && lastAtSymbol > text.lastIndexOf(' ')) {
        const query = text.slice(lastAtSymbol + 1);
        setMentionQuery(query);
        setMentionResults(['John Doe', 'Jane Smith', 'James Brown'].filter(
          name => name.toLowerCase().includes(query.toLowerCase())
        ));
        setIsMentionMenuOpen(true);
      } else {
        setIsMentionMenuOpen(false);
      }
    }
  };

  const applyFormatting = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      // Make sure text direction is maintained after applying formatting
      editorRef.current.setAttribute('dir', 'ltr');
      editorRef.current.style.direction = 'ltr';
      editorRef.current.style.unicodeBidi = 'plaintext';
      editorRef.current.style.textAlign = 'left';
      
      // Force LTR again with Unicode control characters
      const content = editorRef.current.innerHTML;
      if (!content.includes('\u202A')) {
        // Temporarily remove event handler to avoid infinite loop
        editorRef.current.removeEventListener('input', handleInput as any);
        editorRef.current.innerHTML = enforceLTRMarkers(content);
        // Re-add the event handler
        setTimeout(() => {
          editorRef.current?.addEventListener('input', handleInput as any);
        }, 0);
      }
      
      // Apply to all child elements
      const childElements = editorRef.current.querySelectorAll('*');
      childElements.forEach(element => {
        (element as HTMLElement).setAttribute('dir', 'ltr');
        (element as HTMLElement).style.direction = 'ltr';
        (element as HTMLElement).style.unicodeBidi = 'plaintext';
        (element as HTMLElement).style.textAlign = 'left';
      });
      
      onChange(editorRef.current.innerHTML);
    }
    // Focus back on the editor after applying formatting
    editorRef.current?.focus();
  };

  const insertEmoji = (emoji: string) => {
    document.execCommand('insertText', false, emoji);
    if (editorRef.current) {
      // Force LTR after emoji insertion
      editorRef.current.setAttribute('dir', 'ltr');
      editorRef.current.style.direction = 'ltr';
      editorRef.current.style.unicodeBidi = 'plaintext';
      editorRef.current.style.textAlign = 'left';
      
      // Ensure content has LTR markers
      const content = editorRef.current.innerHTML;
      if (!content.includes('\u202A')) {
        // Apply LTR markers
        editorRef.current.innerHTML = enforceLTRMarkers(content);
      }
      
      // Apply to all child elements
      const childElements = editorRef.current.querySelectorAll('*');
      childElements.forEach(element => {
        (element as HTMLElement).setAttribute('dir', 'ltr');
        (element as HTMLElement).style.direction = 'ltr';
        (element as HTMLElement).style.unicodeBidi = 'plaintext';
        (element as HTMLElement).style.textAlign = 'left';
      });
      
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertMention = (username: string) => {
    // Replace the @query with the selected username
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const text = editorRef.current?.innerText || '';
      const lastAtSymbol = text.lastIndexOf('@');
      
      if (lastAtSymbol !== -1) {
        const newRange = document.createRange();
        const startNode = selection.anchorNode;
        
        if (startNode) {
          newRange.setStart(startNode, lastAtSymbol);
          newRange.setEnd(selection.anchorNode as Node, range.startOffset);
          selection.removeAllRanges();
          selection.addRange(newRange);
          
          // Insert the formatted mention
          document.execCommand('insertHTML', false, `<span class="bg-gray-100 rounded px-1" dir="ltr" style="direction: ltr;">@${username}</span>&nbsp;`);
          
          if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
          }
          
          setIsMentionMenuOpen(false);
        }
      }
    }
  };

  return (
    <div className={`border rounded-md overflow-hidden ${className} force-ltr`} dir="ltr" style={{ direction: 'ltr' }}>
      {/* Inline style to enforce LTR */}
      <style>
        {`
          /* Strengthen the LTR styling */
          [contenteditable="true"] {
            direction: ltr !important;
            unicode-bidi: plaintext !important;
            text-align: left !important;
            writing-mode: horizontal-tb !important;
          }
          [contenteditable="true"] * {
            direction: ltr !important;
            unicode-bidi: plaintext !important;
            text-align: left !important;
            writing-mode: horizontal-tb !important;
          }
          .force-ltr {
            direction: ltr !important;
            text-align: left !important;
            unicode-bidi: plaintext !important;
            writing-mode: horizontal-tb !important;
          }
          /* Target specific elements that might cause RTL override */
          p, div, span, h1, h2, h3, h4, h5, h6, li, ul, ol {
            direction: ltr !important;
            unicode-bidi: plaintext !important;
            text-align: left !important;
          }
        `}
      </style>
      <div 
        className="p-2 border-b flex flex-wrap items-center gap-1 force-ltr"
        dir="ltr"
        style={{ direction: 'ltr', textAlign: 'left' }}
      >
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => applyFormatting('bold')}
          className="text-gray-500 hover:text-gray-700"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => applyFormatting('italic')}
          className="text-gray-500 hover:text-gray-700"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => applyFormatting('insertUnorderedList')}
          className="text-gray-500 hover:text-gray-700"
        >
          <List className="w-4 h-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          className="text-gray-500 hover:text-gray-700"
          onClick={() => {
            const tag = prompt('Enter hashtag:');
            if (tag) {
              applyFormatting('insertHTML', `<span class="text-blue-500" dir="ltr" style="direction: ltr;">#${tag}</span>&nbsp;`);
            }
          }}
        >
          <Hash className="w-4 h-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          className="text-gray-500 hover:text-gray-700"
          onClick={() => {
            const selection = window.getSelection();
            if (selection && selection.toString().trim() !== '') {
              // If text is selected, wrap it with @
              applyFormatting('insertHTML', `<span class="bg-gray-100 rounded px-1" dir="ltr" style="direction: ltr;">@${selection.toString()}</span>&nbsp;`);
            } else {
              // Otherwise just insert the @ symbol
              applyFormatting('insertText', '@');
            }
          }}
        >
          <AtSign className="w-4 h-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          className="text-gray-500 hover:text-gray-700"
          onClick={() => {
            const location = prompt('Enter location:');
            if (location) {
              applyFormatting('insertHTML', `<span class="flex items-center text-gray-500" dir="ltr" style="direction: ltr;"><MapPin className="w-3 h-3 mr-1" />${location}</span>&nbsp;`);
            }
          }}
        >
          <MapPin className="w-4 h-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          className="text-gray-500 hover:text-gray-700"
          onClick={() => {
            alert('Poll creation feature coming soon!');
          }}
        >
          <BarChart2 className="w-4 h-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          className="text-gray-500 hover:text-gray-700"
          onClick={() => {
            alert('Schedule post feature coming soon!');
          }}
        >
          <CalendarCheck className="w-4 h-4" />
        </Button>
        <EmojiPicker onEmojiSelect={insertEmoji} />
      </div>
      
      <div
        ref={editorRef}
        contentEditable
        dir="ltr"
        spellCheck="false" 
        lang="en"
        translate="no"
        style={{ 
          direction: 'ltr', 
          unicodeBidi: 'plaintext',
          textAlign: 'left',
          writingMode: 'horizontal-tb',
          textOrientation: 'mixed'
        }}
        className="p-3 outline-none min-h-[100px] empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 text-left force-ltr"
        onInput={(e) => {
          const elem = e.currentTarget;
          elem.setAttribute('dir', 'ltr');
          elem.style.direction = 'ltr';
          elem.style.textAlign = 'left';
          elem.style.unicodeBidi = 'plaintext';
          elem.style.writingMode = 'horizontal-tb';
          handleInput(e);
        }}
        dangerouslySetInnerHTML={{ __html: enforceLTRMarkers(value) }}
        data-placeholder={placeholder}
      />
      
      {isMentionMenuOpen && mentionResults.length > 0 && (
        <div 
          ref={mentionMenuRef}
          className="absolute bg-white border rounded-md shadow-lg z-50 w-48 mt-1 force-ltr"
          dir="ltr"
          style={{ direction: 'ltr', textAlign: 'left' }}
        >
          {mentionResults.map((username, index) => (
            <button
              key={index}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 force-ltr"
              dir="ltr"
              style={{ direction: 'ltr', textAlign: 'left' }}
              onClick={() => insertMention(username)}
            >
              {username}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default RichTextEditor; 