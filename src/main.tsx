import { createRoot } from "react-dom/client";
import { AppRoot } from "@/ui/shell/AppRoot";
import "./index.css";

// La app nueva (`src/ui/`). `src/App.tsx` es la interfaz anterior: sigue en disco, sin montar.
createRoot(document.getElementById("root")!).render(<AppRoot />);
