import {
    Combobox,
    ComboboxInput,
    Dialog,
    DialogPanel,
    DialogBackdrop,
} from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'

export default function AddNewUserSearchBar({ open, setOpen, newUser, setNewUser, handleNewAddUser }) {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleNewAddUser(newUser)
            setOpen(false)
            setNewUser('')
        }
    }

    return (
        <Dialog
            className="relative z-30"
            open={open}
            onClose={() => {
                setOpen(false)
                setNewUser('')
            }}
        >
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity backdrop-blur-sm"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto p-44">
                <DialogPanel
                    transition
                    className="mx-auto max-w-xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
                >
                    <Combobox>
                        <div className="relative">
                            <MagnifyingGlassIcon
                                className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                            <ComboboxInput
                                autoFocus
                                className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0"
                                placeholder="Search..."
                                onChange={(event) => setNewUser(event.target.value)}
                                value={newUser}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                    </Combobox>
                </DialogPanel>
            </div>
        </Dialog>
    )
}