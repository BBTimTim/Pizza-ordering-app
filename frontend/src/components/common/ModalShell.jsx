import { useEffect, useId, useRef } from "react";

// Közös keret a modalokhoz: sötétített háttér, Esc-re és háttérre kattintva bezár, akadálymentes jelölésekkel
export default function ModalShell({ onClose, children }) {
  const titleId = useId();
  const dialogRef = useRef(null);
  // A legfrissebb onClose-t ref-ben tartjuk, hogy a billentyűfigyelő csak egyszer iratkozzon fel
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", handleKeyDown);
    dialogRef.current?.focus();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="z-[9999] flex flex-col items-center justify-center bg-white shadow-md rounded-xl py-5 px-4 w-[300px] min-h-[180px] sm:w-[370px] sm:min-h-[200px] md:w-[460px] md:min-h-[250px] border border-gray-200 outline-none"
      >
        {children(titleId)}
      </div>
    </div>
  );
}
