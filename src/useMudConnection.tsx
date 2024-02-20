import { useEffect, useState, useRef } from 'react';
import { Line } from './types';

let colorPalette: string[];

if(localStorage.getItem("theme") === 'dark') {
  colorPalette = [
    '#FF6B6B', // Lighter red
    '#51D88A', // Bright green
    '#54A0FF', // Bright blue
    '#F368E0', // Bright pink
    '#FF9F43', // Bright orange
    '#0ABDE3', // Cyan
    '#FFEAA7', // Light yellow
    '#1DD1A1', // Teal
    '#5E60CE', // Lavender
    '#28B463', // Emerald
    '#FA8231', // Dark orange
    '#45AAF2', // Light blue
    '#20BF6B', // Bright green
    '#D980FA', // Purple
    '#EB3B5A', // Dark pink
    '#2D98DA', // Dodger blue
  ];
} else {
  colorPalette = [
    '#C0392B', // Dark red
    '#27AE60', // Forest green
    '#2980B9', // Strong blue
    '#8E44AD', // Deep purple
    '#D35400', // Pumpkin orange
    '#16A085', // Sea green
    '#2C3E50', // Dark slate
    '#F39C12', // Vibrant yellow
    '#A569BD', // Soft purple
    '#D98880', // Pastel red
    '#76D7C4', // Light sea green
    '#5DADE2', // Light blue
    '#F7DC6F', // Light yellow
    '#7DCEA0', // Light green
    '#85929E', // Greyish blue
    '#F1948A', // Soft pink
  ];
  
}

// Define constants for reconnection
const RECONNECT_INTERVAL = 3000; // Reconnect attempt interval in milliseconds

let channelColorAssignments: { [channel: string]: string } = {};
let colorUsage: string[] = [];

// Define a type for the hook's return value
interface UseMudConnectionReturn {
  sendMessage: (message: string) => void;
  lines: Line[];
  connected: boolean;
}


const useMudConnection = (): UseMudConnectionReturn => {
  const ws = useRef<WebSocket | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [connected, setConnected] = useState(false);
  const reconnectAttempts = useRef(0);

  const assignColorToChannel = (channel: string): string => {
    if (!channelColorAssignments[channel]) {
      const availableColor = colorPalette.find(color => !Object.values(channelColorAssignments).includes(color)) || colorUsage.shift()!;
      channelColorAssignments[channel] = availableColor;
      colorUsage.push(availableColor); // Track usage for recycling colors
    }
    return channelColorAssignments[channel];
  };
  
  const connect = () => {
    ws.current = new WebSocket(`wss://${import.meta.env.VITE_WEBSOCKET}/`);

    ws.current.onopen = () => {
      console.log('Connected to WebSocket proxy');
      setConnected(true);
      reconnectAttempts.current = 0; // Reset reconnect attempts on successful connection
    };

    ws.current.onmessage = (event: MessageEvent) => {
      const data: string = event.data;
      console.log('Message from MUD:', event.data);
      const newLines = data.split(/(?<=\n)/).map((line): Line => {
        const channelMatch = line.match(/^\[([\w.-]+)\]/);
        let channelName: string | undefined = undefined;
        let color = "#ccc"; // Default color for lines without a channel
        if (channelMatch) {
          channelName = channelMatch[0];
          color = assignColorToChannel(channelName); // Assign color based on channel name
          line = line.substring(channelMatch[0].length); // Remove the channel name from the line
        }
        return { text: line, channelName, color };
      });
      setLines(state => [...state, ...newLines]);
    };

    ws.current.onclose = (event) => {
      console.log('Disconnected from WebSocket proxy');
      setConnected(false);
      // Attempt to reconnect with a delay
      if (!event.wasClean && reconnectAttempts.current < 5) { // Limit reconnect attempts to avoid infinite loops
        setTimeout(() => {
          console.log('Attempting to reconnect...');
          connect(); // Attempt to reconnect
          reconnectAttempts.current++;
        }, RECONNECT_INTERVAL);
      }
    };

    ws.current.onerror = (error) => {
      console.error(`Error: ${error}`)
    }

    return () => {
      ws.current?.close();
    };
  }
  
  useEffect(() => {
    connect(); // Call connect function to establish connection

    return () => {
      ws.current?.close();
    };
  }, []); // Empty dependency array to run only once on mount

  const sendMessage = (message: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      console.log("Sending message: ", message)
      ws.current.send(message + '\n');
    } else {
      console.log('WebSocket is not open');
    }
  };

  return { sendMessage, lines, connected };
};

export default useMudConnection