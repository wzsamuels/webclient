import { useState, KeyboardEvent} from "react";

const InputForm = ({onSubmit}: {onSubmit: (text:string) => void}) => {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const sendInput = () => {
    // Add the message to the history and reset the history index
    setHistory(prev => [...prev, message]);
    setHistoryIndex(-1);
    onSubmit(message);
    setMessage('')   
  }

  // Function to handle key down events for navigating history
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      // Navigate up the history
      const newIndex = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(newIndex);
      setMessage(history[history.length - 1 - newIndex] || '');
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      // Navigate down the history
      const newIndex = Math.max(historyIndex - 1, -1);
      setHistoryIndex(newIndex);
      setMessage(history[history.length - 1 - newIndex] || '');
    } else if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      // Send message on Enter key
      sendInput();
    }
  };

  return (
    <div className='w-full h-[2rem] border-t border-text dark:border-darkText text-text dark:text-darkText flex'>
      <input 
        className='w-full py-2 px-1 h-full focus:outline-none bg-background dark:bg-darkBackground'
        value={message}
        onChange={e => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      ></input>
      <button className="px-2 border-l border-text dark:border-darkText hover:bg-text hover:text-background  dark:hover:bg-background dark:hover:text-text" onClick={() => sendInput()}>Send</button>
    </div>
  );
}

export default InputForm