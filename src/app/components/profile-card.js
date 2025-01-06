import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

export default function () {
  return (
    <Menu>
      <MenuButton as="div" className="space-x-2 flex items-center text-sm pe-2 font-medium text-gray rounded-full hover:text-pink dark:hover:text-blue md:me-0 focus:ring-4 focus:ring-gray dark:focus:ring-gray dark:text-white">
        {/* Profile Pic */}
        <svg
            className="relative w-5 h-5 bg-purple-dark overflow-hidden rounded-full border-r-10 absolute w-7 h-7 -left-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            ></path>
          </svg>
        <span>New User</span>
        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </MenuButton>

      
      <MenuItems
        as="div"
        className="z-10 bg-purple rounded-lg shadow w-44 dark:divide-gray [--anchor-gap:4px] sm:[--anchor-gap:8px] text-green"
        anchor="bottom"
      >
        <MenuItem as="div" className="px-4 py-1">
          <a
            className="hover:text-pink block"
            href="/login"
          >
            Sign In
          </a>
        </MenuItem>
        <div className="my-1 h-px bg-white/5" />
        <MenuItem as="div" className="px-4 py-1">
          <a
            className="hover:text-pink block"
            href="/license"
          >
            Create new account
          </a>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}