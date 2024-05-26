import { Listbox, Menu, Transition } from '@headlessui/react'
import { Settings } from "../types";
import { Dispatch, Fragment, useState } from 'react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

const fonts = [
  "Anonymous Pro",
  "Azeret Mono Variable",
  "DejaVu Mono",
  "Red Hat Mono Variable",  
  "Roboto Mono Variable",  
  "Sixtyfour",
  "VT323"
]

export default function SettingsMenu({settings, setSettings} : {settings: Settings, setSettings: Dispatch<Settings>}) {
  const [theme, setTheme] = useState<string>(settings.theme)
  const [colorChannels, setColorChannels] = useState(settings.colorChannels)
  const [font, setFont] = useState(fonts[fonts.findIndex(font => font === settings.font)])

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => { 
    setTheme(event.target.value);
  }

  const handleColorChannelsChange = (event: React.ChangeEvent<HTMLInputElement>) => { 
    setColorChannels(event.target.checked);
  }

  const handleApply = () => {
    setSettings({...settings, theme, colorChannels, font});
    localStorage.setItem("theme", theme);
    localStorage.setItem("color", String(colorChannels))
    localStorage.setItem("font", font)
  }

  return (
    <>
      <Menu>
        <Menu.Button className="hover:underline">Settings</Menu.Button>
        <Menu.Items className="border border-text dark:border-darkText fixed bg-background dark:bg-darkBackground shadow-xl	flex flex-col w-80 max-w-full">
          <div className="p-3 grid gap-3">
            <div className="flex grid-cols-2 justify-between">
              <div>Theme:</div>
              <div>
              <label className="mx-2">Light</label>
              <input type="radio" value="light" name="theme" checked={theme === "light"} onChange={handleThemeChange}/>              
              <label className="mx-2">Dark</label>
              <input type="radio" value="dark" name="theme" checked={theme === "dark"} onChange={handleThemeChange}/>            
              </div>
            </div>
            <div className="flex justify-between grid-cols-2">
              <div>Color Channels:</div>            
              <input className="h-[90%]" type="checkbox" checked={colorChannels} onChange={handleColorChannelsChange}/>
            </div>
            <Listbox value={font} onChange={setFont}>
            <div className="relative mt-1 flex justify-between">
              <span className='mr-2'>Font:</span>
              <Listbox.Button
                className="relative w-full cursor-default rounded-lg bg-background dark:bg-darkBackground pl-3  text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 ">
                <span className="block truncate">{font}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-background dark:bg-darkBackground py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                  {fonts.map((person, personIdx) => (
                    <Listbox.Option
                      key={personIdx}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? 'text-amber-600' : 'text-text dark:text-darkText'
                        }`
                      }
                      value={person}
                      style={{fontFamily: `${person}`}}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? 'font-medium' : 'font-normal'
                            }`}
                          >
                            {person}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
          </div>

          
          <Menu.Item>
            <div className="my-4 flex justify-center">
              <button className="px-4 py-1 border border-text rounded hover:bg-darkBackground hover:text-darkText dark:hover:bg-background hover:dark:text-text" onClick={() => handleApply()}>Apply</button>            
            </div>
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </>
  )
}<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
  <path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
</svg>
