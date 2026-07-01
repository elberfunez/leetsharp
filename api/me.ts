import { requireUser } from "./_lib/auth.js";
import { withErrors } from "./_lib/http.js";

/** GET /api/me — returns the caller's user row, lazily creating it on first call.
 *  Hitting this once after sign-in is what materializes the `users` record. */
export default withErrors(async (req, res) => {
  const user = await requireUser(req);
  res.status(200).json({ user });
});
