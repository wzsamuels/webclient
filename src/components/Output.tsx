import DOMPurify from "dompurify";
import React, { useLayoutEffect, useRef} from "react";
import { Line, Settings } from "../types";

const escapeAngleBrackets = (text: string): string => {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

const convertUrlsToLinks = (text: string): string => {
  const urlRegex = /(\b(https?):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig;
  return text.replace(urlRegex, (url) => `<a href="${url}" class="text-link dark:text-darkLink" target="_blank" rel="noopener noreferrer">${url}</a>`);
};

const TextWithLinks: React.FC<{ line: Line, settings: Settings }> = ({ line, settings }) => {

  // First, escape angle brackets in the original text
  const escapedText = escapeAngleBrackets(line.text);
  
  // Then, convert URLs to clickable links in the escaped text
  const htmlContentWithLinks = convertUrlsToLinks(escapedText);

  // Sanitize the final HTML content to ensure safety
  const sanitizedHtml = DOMPurify.sanitize(htmlContentWithLinks, {
    ADD_ATTR: ['target', 'rel', 'className', 'class'], // Adding 'class' to the list of allowed attributes
    ADD_TAGS: ['a']
  });

  return (
    <div className='my-1'>
      { settings.colorChannels ?
        (line.channelName && line.color) ? (
          <>
            <span style={{color: line.color}} dangerouslySetInnerHTML={{ __html: line.channelName }} />
            <span dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
          </>
        ) : (
          <span style={{ whiteSpace: "pre-wrap", }} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
        )
      :
      line.channelName ? (
        <>
          <span dangerouslySetInnerHTML={{ __html: line.channelName }} />
          <span dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
        </>
      ) : (
        <span style={{ whiteSpace: "pre-wrap", }} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
      )
      }      
    </div>
  );
};

function Output({ lines, settings } : {lines: Line[], settings: Settings}) {
  const containerRef = useRef<HTMLDivElement>(null); // Reference to the scrollable container

  const scrollToBottom = () => {
    const container = containerRef.current;
    if (container) {
      // Directly set scrollTop to scrollHeight to scroll to the bottom
      container.scrollTop = container.scrollHeight;
    }
  };

  useLayoutEffect(() => {
   // if(isScrolledToBottom()) scrollToBottom();
   scrollToBottom();
  }, [lines]); // Depend on 'lines' to run this effect when lines change

  return (
    <div ref={containerRef} className='grow overflow-y-auto'>
      {lines.map((line, index) => (
        <TextWithLinks settings={settings} key={index} line={line}/>
      ))}
    </div>
  );
}

export default Output