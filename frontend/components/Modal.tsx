import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

export default function Modal({
  title,
  text,
  button,
  className = "",
  onClose,
  isOpen,
}: {
  title: string;
  text: string;
  button: ReactNode[];
  className?: string;
  onClose: () => void;
  isOpen: boolean;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Centered container */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Modal */}
            <motion.div
              className={`w-[600px] max-w-[90%] rounded-md overflow-y-hidden ${className}`}
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className=" flex flex-col gap-3 md:gap-5 bg-white p-5 rounded-md h-full">
                <h2 className="font-title text-sky-900 text-lg 2xl:text-xl">
                  {title}
                </h2>

                <p className="font-common text-base 2xl:text-lg text-justify py-1 md:py-2 pr-2 whitespace-pre-line overflow-auto max-h-[60vh]">
                  {text}
                </p>

                <div className="mt-3 md:mt-6 flex flex-row gap-3">
                  {button.map((item, i) => {
                    return <div key={i}>{item}</div>;
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
