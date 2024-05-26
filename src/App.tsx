import { useEffect, useState } from "react";
import InputForm from "./components/InputForm";
import Output from "./components/Output";
import useMudConnection from "./useMudConnection";


import HelpMenu from "./components/HelpMenu";
import SettingsMenu from "./components/SettingsMenu";
import { Settings } from "./types";

export default function Home() {
  const {sendMessage, lines, connected, reconnect} = useMudConnection();
  const [settings, setSettings] = useState<Settings>(() => {
    const theme = localStorage.getItem("theme") ?? "dark";
    const color = localStorage.getItem("color") ? Boolean(localStorage.getItem("color")) : true;
    const font = localStorage.getItem("font") ?? "DejaVu Mono";

    return ({fontSize: 1, theme: theme, colorChannels: color, font})
  })

  console.log(settings)

  // Try to keep alive the connection
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Sending qidle")
      sendMessage("qidle\n");      
    }, 60000);

    return () => clearInterval(interval);
  })
  
  return (
    <div className={`${settings.theme}`} style={{fontFamily: `${settings.font}`}}>
      <div className={`flex flex-col h-[100vh] overflow-y-hidden bg-background dark:bg-darkBackground text-text dark:text-darkText`}>
        <header className="border-b border-text dark:border-darkText p-2 flex justify-between">          
          <div>
            <span><SettingsMenu settings={settings} setSettings={setSettings}/></span> | <span><HelpMenu/></span>
          </div>
          <div>
            { !connected && 
              <>
                <span onClick={reconnect} className="underline dark:text-yellow-500 text-yellow-500 cursor-pointer">Reconnect</span>
                <span> | </span>
              </>
            }
            { connected ? <span className="dark:text-green-500 text-green-700">Connected</span> : <span className="text-red-500">Disconnected</span>}
          </div>
        </header>
        <Output settings={settings} lines={lines}/>
        <InputForm onSubmit={(message: string) => {sendMessage(message)}}/>
      </div>
    </div>
  )
}