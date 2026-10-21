/**
 * Host half of dsh-context-canvas.
 *
 * The canvas is a Client-only feature: it reads Sessions through the Client
 * Session Controller and creates new conversations through the same services,
 * so the Host half intentionally registers nothing. Keeping the Host half is
 * still required: a bundle's patch inserts this package as a Loader row, and
 * the Client module graph only discovers packages that are active rows.
 */
export function apply() {}
