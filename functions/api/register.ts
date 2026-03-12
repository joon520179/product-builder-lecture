export async function onRequestPost(context: any) {
  const { request, env } = context;
  const formData = await request.formData();
  const image = formData.get('image') as File;
  const name = formData.get('name');

  if (!image || !name) return Response.json({ success: false, message: "데이터 부족" });

  try {
    // 1. CLIP 모델을 사용하여 이미지 임베딩 생성 (무료 티어 모델)
    const blob = await image.arrayBuffer();
    const embedding = await env.AI.run('@cf/openai/clip-vit-base-patch32', {
      image: [...new Uint8Array(blob)]
    });

    const vector = embedding.image_embedding;
    const id = crypto.randomUUID();

    // 2. Vectorize에 벡터 저장
    await env.VECTOR_INDEX.insert([{ id, values: vector }]);

    // 3. D1에 메타데이터 저장
    await env.DB.prepare('INSERT INTO items (id, name, stock) VALUES (?, ?, ?)')
      .bind(id, name, 1)
      .run();

    return Response.json({ success: true, message: "등록 성공!" });
  } catch (e: any) {
    return Response.json({ success: false, message: e.message });
  }
}
