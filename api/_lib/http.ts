import type { VercelRequest, VercelResponse } from "@vercel/node";
import { HttpError } from "./auth";

type Handler = (req: VercelRequest, res: VercelResponse) => Promise<void>;

/** Wraps a handler so thrown `HttpError`s become their status code and anything
 *  else becomes a 500 (logged), keeping each route free of boilerplate. */
export function withErrors(fn: Handler): Handler {
  return async (req, res) => {
    try {
      await fn(req, res);
    } catch (e) {
      if (e instanceof HttpError) {
        res.status(e.status).json({ error: e.message });
        return;
      }
      console.error("API error:", e);
      res.status(500).json({ error: "Internal error" });
    }
  };
}
