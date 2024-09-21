import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
// import { ExclamationIcon } from '@heroicons/react/24/outline'

export default function ComingSoon({ open, setOpen }) {
    return (
        <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                    >
                        <div>
                            {/* <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                                <ExclamationIcon aria-hidden="true" className="h-6 w-6 text-yellow-600" />
                            </div> */}
                            <div className="mt-3 text-center sm:mt-5">
                                <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                    Feature coming soon!
                                </DialogTitle>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        We are working hard to bring this feature to you. Stay tuned for updates!
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 sm:mt-6">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="w-24 mx-auto block focus:outline-none text-white bg-purple-700 hover:bg-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 h-[2.5rem]"
                            >
                                Close
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}