import { useEffect } from "react";

// A böngészőfül címe az adott oldalon, pl. „Kosár | One more slice”
export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | One more slice` : "One more slice – pizzarendelés";
  }, [title]);
}
