export async function GET() {
  return Response.json({
    ok: true,
    service: "velorabeauty-frontend",
    /** Set at Docker build (GitHub Actions / Easypanel). Compare after deploy. */
    version: process.env.BUILD_SHA ?? "local",
  });
}
