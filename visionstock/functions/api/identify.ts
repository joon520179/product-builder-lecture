export async function onRequestPost(context: any) {
  const { request, env } = context;
  const formData = await request.formData();
  const image = formData.get('image') as File;

  if (!image) return Response.json({ success: false, message: "이미지 없음" });

  try {
    const blob = await image.arrayBuffer();
    // 현재 이미지 벡터화
    const embedding = await env.AI.run('@cf/openai/clip-vit-base-patch32', {
      image: [...new Uint8Array(blob)]
    });

    const vector = embedding.image_embedding;

    // 유사도 검색 (Top 1)
    const matches = await env.VECTOR_INDEX.query(vector, { topK: 1 });

    if (matches.matches.length > 0 && matches.matches[0].score > 0.8) {
      const matchId = matches.matches[0].id;

      // 재고 업데이트 및 정보 조회
      await env.DB.prepare('UPDATE items SET stock = stock + 1 WHERE id = ?').bind(matchId).run();
      const item = await env.DB.prepare('SELECT * FROM items WHERE id = ?').bind(matchId).first();

      return Response.json({ success: true, item });
    }

    return Response.json({ success: false, message: "인식 실패 (유사한 물건 없음)" });
  } catch (e: any) {
    return Response.json({ success: false, message: e.message });
  }
}
