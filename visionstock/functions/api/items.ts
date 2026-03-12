export async function onRequestGet(context: any) {
  const { env } = context;
  try {
    const items = await env.DB.prepare('SELECT * FROM items ORDER BY name ASC').all();
    return Response.json(items.results);
  } catch (e: any) {
    return Response.json([]);
  }
}
