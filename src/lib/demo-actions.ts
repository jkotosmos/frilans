import { toast } from "sonner";

/**
 * Static export build (see DEPLOYMENT.md): there's no server, so nothing
 * that used to be a Server Action can actually run. Every one of those call
 * sites was swapped for this instead — it shows the same kind of toast the
 * real actions used, with the same {ok:false, error} shape most of them
 * returned, so the calling component's existing `if (!result.ok)` branch
 * still fires without needing its own logic touched.
 */
export function demoAction(message = "Демо-версия на GitHub Pages: без сервера это не сохраняется. В полной версии — см. README — это по-настоящему работает.") {
  toast.info(message);
  return { ok: false as const, error: message };
}
