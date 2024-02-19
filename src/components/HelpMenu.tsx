import { Menu } from "@headlessui/react"

const HelpMenu = () => {
  return (
    <Menu>
      <Menu.Button className="hover:underline">Help</Menu.Button>
      <Menu.Items className="border fixed bg-background dark:bg-darkBackground shadow-xl	flex flex-col p-3 max-w-100">
        <div>
          <p className="mb-3">Press Enter or click the Send button to send a message to the MUD.</p>
          <p>Use the up and down arrow keys to navigate through your message history.</p>
        </div>
        <Menu.Item>
          <div className="my-2">
            <button className="px-4 py-1 border rounded hover:bg-darkBackground hover:text-darkText">OK</button>
          </div>
        </Menu.Item>
      </Menu.Items>
    </Menu>
  )
}

export default HelpMenu