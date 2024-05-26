import DOMPurify from "dompurify";
import React, { useEffect, useRef, useCallback } from "react";
import { Line, Settings } from "../types";

const escapeAngleBrackets = (text: string): string => {
  return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

const convertUrlsToLinks = (text: string): string => {
  const urlRegex = /(\b(https?):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig;
  return text.replace(urlRegex, (url) => `<a href="${url}" class="text-link dark:text-darkLink" target="_blank" rel="noopener noreferrer">${url}</a>`);
};

const TextWithLinks: React.FC<{ line: Line, settings: Settings }> = ({ line, settings }) => {
  const escapedText = escapeAngleBrackets(line.text);
  const htmlContentWithLinks = convertUrlsToLinks(escapedText);
  const sanitizedHtml = DOMPurify.sanitize(htmlContentWithLinks, {
    ADD_ATTR: ['target', 'rel', 'className', 'class'],
    ADD_TAGS: ['a']
  });

  return (
    <div className='my-1'>
      {settings.colorChannels ?
        (line.channelName && line.color) ? (
          <>
            <span style={{color: line.color}} dangerouslySetInnerHTML={{ __html: line.channelName }} />
            <span dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
          </>
        ) : (
          <span style={{ whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
        )
        :
        line.channelName ? (
          <>
            <span dangerouslySetInnerHTML={{ __html: line.channelName }} />
            <span dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
          </>
        ) : (
          <span style={{ whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
        )
      }      
    </div>
  );
};

function Output({ lines, settings } : { lines: Line[], settings: Settings }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (container) {
      const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 1;
      isAtBottomRef.current = isAtBottom;
    }
  }, []);

  const scrollToBottom = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  useEffect(() => {
    if (isAtBottomRef.current) {
      scrollToBottom();
    }
  }, [lines]);

  return (
    <div ref={containerRef} className='grow overflow-y-auto'>
      {lines.map((line, index) => (
        <TextWithLinks settings={settings} key={index} line={line}/>
      ))}
    </div>
  );
}

export default Output;
