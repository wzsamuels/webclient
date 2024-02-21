import { Menu } from "@headlessui/react"

const HelpMenu = () => {
  return (
    <Menu>
      <Menu.Button className="hover:underline">Help</Menu.Button>
      <Menu.Items className="border border-text dark:border-darkText fixed bg-background dark:bg-darkBackground shadow-xlflex flex-col p-3 w-80 max-w-full">
        <div>
          <p className="mb-3">Press Enter or click the Send button to send a message to the MUD.</p>
          <p>Use the up and down arrow keys to navigate through your message history.</p>
        </div>
        <Menu.Item>
          <div className="my-4 flex justify-center">
            <button className="px-4 py-1 border border-text rounded hover:bg-darkBackground hover:text-darkText dark:hover:bg-background hover:dark:text-text">OK</button>
          </div>
        </Menu.Item>
      </Menu.Items>
    </Menu>
  )
}

export default HelpMenu