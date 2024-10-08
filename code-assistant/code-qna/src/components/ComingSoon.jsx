import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { TbReload } from "react-icons/tb";

export default function ComingSoon({ open, setOpen, quoteGeneratorPrompt, setQuoteGeneratorPrompt }) {
    const handleResetPrompt = () => {
        setQuoteGeneratorPrompt("Generate repost quote for a tweet and emoji in the same string, keep it short, simple, informal and no filler words, also sound like a human");
    }
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
                        className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                    >
                        <div className="mt-3 text-center sm:mt-5">
                            <DialogTitle as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                System Prompt
                            </DialogTitle>
                            <div className="mt-2">
                                <textarea
                                    rows={4}
                                    className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter your quote generator prompt here..."
                                    value={quoteGeneratorPrompt}
                                    onChange={(e) => setQuoteGeneratorPrompt(e.target.value)}
                                />
                                <div className="flex items-center justify-center gap-2 mt-2">
                                    <button onClick={handleResetPrompt} className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 h-[2.5rem]"><TbReload /></button>
                                    <button onClick={() => setOpen(false)} className="focus:outline-none text-white w-24 bg-purple-700 hover:bg-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 h-[2.5rem]">Save</button>
                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}