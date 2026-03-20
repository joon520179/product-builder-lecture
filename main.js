const URL = "https://teachablemachine.withgoogle.com/models/otKuKorme/";

let model, webcam, maxPredictions;
let isCaptured = false;
let currentLang = 'ko';

const i18n = {
    ko: {
        "main-title": "AI 동물상 테스트",
        "main-subtitle": "나는 어떤 멍냥이와 닮았을까? 🐶🐱",
        "security-msg": "🛡️ 사진은 서버에 저장되지 않으니 안심하세요!",
        "btn-start": "두근두근 분석 시작! ✨",
        "btn-retry": "한 번 더 해볼래! 🐾",
        "loading-msg": "AI 친구들이 열심히 분석 중이에요!",
        "result-title": "분석 결과",
        "animal-dog": "강아지상",
        "animal-cat": "고양이상",
        "how-to-title": "🐾 이용 방법 및 가이드",
        "feature-analysis-title": "✨ 왜 그렇게 생겼을까? (관상 분석)",
        "footer-privacy": "개인정보처리방침",
        "desc-dog": "정말 사랑스러운 강아지상이시네요! 보는 사람을 행복하게 만드는 선한 에너지가 넘쳐나요. 🐶",
        "desc-cat": "치명적인 매력의 고양이상이시네요! 시크하면서도 신비로운 분위기가 정말 멋져요. 🐱",
        "result-text": "당신은 {percent}% {animal}!",
        "feat-dog-1": "둥글둥글하고 선한 눈매를 가지셨네요!",
        "feat-dog-2": "부드러운 턱선이 친근한 인상을 줘요.",
        "feat-dog-3": "미소가 밝고 귀여운 분위기가 뿜뿜!",
        "feat-cat-1": "눈꼬리가 살짝 올라간 매력적인 눈매!",
        "feat-cat-2": "날렵하고 샤프한 얼굴 라인이 돋보여요.",
        "feat-cat-3": "도도하면서도 세련된 분위기를 풍기네요!",
        "result-badge": "Perfect Match! 💖",
        "viral-badge": "실시간 인기 테스트! 🔥",
        "share-cta": "친구들은 어떤 동물일까요? 지금 바로 공유해보세요!",
        "btn-copy": "링크 복사하기",
        "share-note": "* 인스타그램은 링크 복사 후 스토리/프로필에 공유해 주세요!",
        "guide-step-1": "조명이 밝은 곳에서 카메라를 정면으로 응시해 주세요.",
        "guide-step-2": "분석 시작 버튼을 누르고 3초 동안 대기합니다.",
        "guide-step-3": "AI가 분석한 나의 동물상과 특징을 확인하세요!",
        "rich-intro-title": "✨ AI 동물상 테스트: 당신의 얼굴에 숨겨진 비밀",
        "rich-intro-desc": "'AnimalFace AI'는 단순한 재미를 넘어선 최첨단 인공지능 기술의 결정체입니다. 구글의 TensorFlow.js 라이브러리를 활용하여 사용자의 얼굴 특징점을 정밀하게 추출하고, 수만 건의 빅데이터와 비교 분석합니다. 여러분이 가진 독특한 분위기와 인상이 어떤 동물과 가장 닮았는지 확인해보세요.",
        "rich-why-ai-title": "🔍 왜 인공지능(AI)인가요?",
        "rich-why-ai-desc": "기존의 간단한 퀴즈 방식과 달리, 본 서비스는 실시간 이미지 인식 기술인 CNN(Convolutional Neural Networks)을 사용합니다. 눈의 각도, 코의 너비, 턱선의 흐름 등 미세한 차이를 AI가 학습된 데이터를 바탕으로 정량화하여 결과를 도출합니다. 이는 현대 관상학의 데이터를 디지털화하여 분석하는 것과 유사한 경험을 제공합니다.",
        "rich-guide-title": "🐱 대표적인 동물상 분석 가이드",
        "face-dog-title": "🐕 강아지상 (Doggy Face)",
        "face-dog-desc": "전체적으로 둥근 얼굴형과 선한 눈매가 특징입니다. 상대방에게 신뢰감과 친근함을 주는 인상으로, 웃을 때 입꼬리가 살짝 올라가는 모습이 매력적입니다.",
        "face-cat-title": "🐈 고양이상 (Cat Face)",
        "face-cat-desc": "세련되고 도도한 분위기가 느껴지는 얼굴형입니다. 눈꼬리가 살짝 올라가 있으며, 뚜렷한 이목구비가 시크한 매력을 완성합니다.",
        "face-rabbit-title": "🐰 토끼상 (Rabbit Face)",
        "face-rabbit-desc": "맑고 큰 눈망울과 귀여운 앞니가 돋보이는 스타일입니다. 동안 인상의 대표주자로, 밝고 긍정적인 에너지를 풍깁니다.",
        "face-fox-title": "🦊 여우상 (Fox Face)",
        "face-fox-desc": "턱선이 갸름하고 눈매가 가로로 긴 신비로운 스타일입니다. 지적이면서도 매혹적인 분위기를 동시에 가지고 있습니다.",
        "rich-story-title": "📚 인공지능과 관상 이야기",
        "story-1-title": "AI가 사람의 얼굴을 인식하는 방법",
        "story-1-desc": "AI는 수백 개의 랜드마크를 통해 얼굴의 구조를 파악합니다. 이는 머신러닝의 핵심인 패턴 인식 기술 덕분입니다.",
        "story-2-title": "동물상으로 보는 성격 테스트의 유래",
        "story-2-desc": "인상을 동물에 비유하는 것은 오래전부터 동서양을 막론하고 인간의 특징을 직관적으로 이해하는 방법 중 하나였습니다.",
        "faq-title": "❓ 자주 묻는 질문 (FAQ)",
        "faq-1-q": "제 개인정보(사진)는 안전한가요?",
        "faq-1-a": "본 서비스는 개인정보 보호를 최우선으로 합니다. 촬영된 영상은 사용자의 브라우저 내에서만 처리되며, 분석 즉시 삭제됩니다. 서버로는 단 1바이트의 이미지 데이터도 전송되지 않습니다.",
        "faq-2-q": "결과의 정확도는 어느 정도인가요?",
        "faq-2-a": "수만 장의 학습 데이터를 기반으로 하지만, 조명이나 각도에 따라 차이가 있을 수 있습니다. 가장 자연스러운 정면 사진으로 테스트하는 것을 권장합니다.",
        "faq-3-q": "서비스 이용료가 있나요?",
        "faq-3-a": "아니요, 본 서비스는 모든 이용자에게 100% 무료로 제공됩니다. 광고 수익을 통해 지속적인 서비스 업데이트와 인공지능 모델 개선을 진행하고 있습니다.",
        "footer-about": "소개 (About)",
        "footer-technic": "기술 및 교육 가치 (Technic)",
        "footer-terms": "이용약관",
        "footer-contact": "문의 (Contact)",
        "footer-copyright": "© 2024 AnimalFace AI. All rights reserved. 💖",
        "footer-note": "우리는 인공지능 기술이 세상에 즐거움을 줄 수 있다고 믿습니다."
    },
    en: {
        "main-title": "AI Animal Face Test",
        "main-subtitle": "Which pup or kitty are you? 🐶🐱",
        "security-msg": "🛡️ Photos are never stored on our server!",
        "btn-start": "Start Analysis! ✨",
        "btn-retry": "Try Again! 🐾",
        "loading-msg": "AI is sniffing out your results!",
        "result-title": "Results",
        "animal-dog": "Puppy Face",
        "animal-cat": "Kitty Face",
        "how-to-title": "🐾 How to use?",
        "feature-analysis-title": "✨ Why do you look like this?",
        "footer-privacy": "Privacy Policy",
        "desc-dog": "You have a lovely puppy face! You radiate kind energy that makes everyone happy. 🐶",
        "desc-cat": "You have a charming cat face! You have a chic and mysterious vibe. 🐱",
        "result-text": "You are {percent}% {animal}!",
        "feat-dog-1": "You have round and kind-looking eyes!",
        "feat-dog-2": "Your soft jawline gives a friendly impression.",
        "feat-dog-3": "You have a bright and cute aura!",
        "feat-cat-1": "Your eye corners are charmingly upturned!",
        "feat-cat-2": "Your sharp face line stands out.",
        "feat-cat-3": "You give off a chic and sophisticated vibe!",
        "result-badge": "Perfect Match! 💖",
        "viral-badge": "Trending Now! 🔥",
        "share-cta": "What animal are your friends? Share now and find out!",
        "btn-copy": "Copy Link",
        "share-note": "* For Instagram, copy the link and share it to your Story or Profile!",
        "guide-step-1": "Please face the camera directly in a brightly lit area.",
        "guide-step-2": "Press the start button and wait for 3 seconds.",
        "guide-step-3": "Check your animal face result and features analyzed by AI!",
        "rich-intro-title": "✨ AI Animal Face Test: Secrets Hidden in Your Face",
        "rich-intro-desc": "'AnimalFace AI' is the culmination of state-of-the-art AI technology beyond simple fun. It uses Google's TensorFlow.js library to precisely extract facial features and compare them with tens of thousands of big data points. See which animal best matches your unique vibe and impression.",
        "rich-why-ai-title": "🔍 Why Artificial Intelligence (AI)?",
        "rich-why-ai-desc": "Unlike simple quizzes, this service uses CNN (Convolutional Neural Networks), a real-time image recognition technology. AI quantifies subtle differences such as eye angle, nose width, and jawline flow based on learned data. This provides an experience similar to digitizing and analyzing modern physiognomy data.",
        "rich-guide-title": "🐱 Guide to Major Animal Face Types",
        "face-dog-title": "🐕 Doggy Face",
        "face-dog-desc": "Characterized by an overall round face and kind eyes. It gives an impression of trust and friendliness.",
        "face-cat-title": "🐈 Cat Face",
        "face-cat-desc": "A face type that feels sophisticated and haughty. The corners of the eyes are slightly raised, and distinct features complete the chic charm.",
        "face-rabbit-title": "🐰 Rabbit Face",
        "face-rabbit-desc": "A style with clear, large eyes and cute front teeth. A representative of a youthful look, radiating bright energy.",
        "face-fox-title": "🦊 Fox Face",
        "face-fox-desc": "A mysterious style with a slim jawline and horizontally long eyes. It has both intellectual and enchanting vibes.",
        "rich-story-title": "📚 AI and Physiognomy",
        "story-1-title": "How AI recognizes human faces",
        "story-1-desc": "AI understands facial structure through hundreds of landmarks. This is thanks to pattern recognition technology, the core of machine learning.",
        "story-2-title": "Origin of Personality Tests by Animal Faces",
        "story-2-desc": "Comparing impressions to animals has long been an intuitive way to understand human characteristics across cultures.",
        "faq-title": "❓ Frequently Asked Questions (FAQ)",
        "faq-1-q": "Is my personal information (photo) safe?",
        "faq-1-a": "Our service prioritizes privacy. Images are processed only within your browser and deleted immediately after analysis. No image data is sent to the server.",
        "faq-2-q": "How accurate are the results?",
        "faq-2-a": "While based on thousands of data points, results may vary by lighting or angle. We recommend testing with a natural front-facing photo.",
        "faq-3-q": "Is there a service fee?",
        "faq-3-a": "No, this service is 100% free for everyone. We maintain updates through ad revenue.",
        "footer-about": "About",
        "footer-technic": "Technic",
        "footer-terms": "Terms of Use",
        "footer-contact": "Contact",
        "footer-copyright": "© 2024 AnimalFace AI. All rights reserved. 💖",
        "footer-note": "We believe AI technology can bring joy to the world."
    },
    ja: {
        "main-title": "AI動物顔診断",
        "main-subtitle": "あなたはどの動物に似ていますか？ 🐶🐱",
        "security-msg": "🛡️ 写真はサーバーに保存されませんのでご安心ください！",
        "btn-start": "ドキドキ分析開始！ ✨",
        "btn-retry": "もう一度やってみる！ 🐾",
        "loading-msg": "AIの友達が一生懸命分析中です！",
        "result-title": "分析結果",
        "animal-dog": "イヌ顔",
        "animal-cat": "ネコ顔",
        "how-to-title": "🐾 使い方ガイド",
        "feature-analysis-title": "✨ なぜその結果に？ (観相分析)",
        "footer-privacy": "プライバシーポリシー",
        "desc-dog": "とても愛らしいイヌ顔ですね！見る人を幸せにする優しいエネルギーに満ち溢れています。 🐶",
        "desc-cat": "致命的な魅力のネコ顔ですね！クールで神秘的な雰囲気が本当に素敵です。 🐱",
        "result-text": "あなたは {percent}% {animal} です！",
        "feat-dog-1": "丸くて優しい目元をしていますね！",
        "feat-dog-2": "柔らかな輪郭が親しみやすい印象を与えます。",
        "feat-dog-3": "明るい笑顔と可愛い雰囲気が溢れています！",
        "feat-cat-1": "目尻が少し上がった魅力的な目元！",
        "feat-cat-2": "シャープで洗練された顔立ちが際立っています。",
        "feat-cat-3": "クールで都会的な雰囲気を醸し出しています！",
        "result-badge": "Perfect Match! 💖",
        "viral-badge": "今話題のテスト！ 🔥",
        "share-cta": "友達はどの動物？今すぐ共有してみよう！",
        "btn-copy": "リンクをコピー",
        "share-note": "* Instagramはリンクをコピーしてストーリー/プロフィールに共有してください！",
        "guide-step-1": "明るい場所でカメラを正面から見つめてください。",
        "guide-step-2": "開始ボタンを押して3秒間待機します。",
        "guide-step-3": "AIが分析したあなたの動物顔と特徴を確認しましょう！",
        "rich-intro-title": "✨ AI動物顔診断：顔に隠された秘密",
        "rich-intro-desc": "「AnimalFace AI」は単なる楽しみを超えた最先端の人工知能技術の結晶です。GoogleのTensorFlow.jsライブラリを活用し、顔の特徴点を精密に抽出して数万件のビッグデータと比較分析します。あなたの独特な雰囲気や印象が、どの動物に一番似ているか確認してみましょう。",
        "rich-why-ai-title": "🔍 なぜ人工知能(AI)なのですか？",
        "rich-why-ai-desc": "従来のクイズ形式とは異なり、本サービスはリアルタイム画像認識技術であるCNN（畳み込みニューラルネットワーク）を使用しています。目の角度、鼻の幅、顎のラインなど、AIが学習したデータに基づき細かな違いを数値化して結果を導き出します。これは現代の観相学をデジタル化したような体験を提供します。",
        "rich-guide-title": "🐱 代表的な動物顔分析ガイド",
        "face-dog-title": "🐕 イヌ顔 (Doggy Face)",
        "face-dog-desc": "全体的に丸い顔立ちと優しい目元が特徴です。相手に信頼感と親しみやすさを与える印象で、笑った時に口角が上がる姿が魅力的です。",
        "face-cat-title": "🐈 ネコ顔 (Cat Face)",
        "face-cat-desc": "洗練されたクールな雰囲気の顔立ちです。目尻が少し上がっており、はっきりした目鼻立ちがシックな魅力を完成させます。",
        "face-rabbit-title": "🐰 ウサギ顔 (Rabbit Face)",
        "face-rabbit-desc": "澄んだ大きな瞳と可愛い前歯が目立つスタイルです。若々しい印象の代表格で、明るくポジティブなエネルギーを放ちます。",
        "face-fox-title": "🦊 キツネ顔 (Fox Face)",
        "face-fox-desc": "顎のラインが細く、目元が横に長い神秘的なスタイルです。知的で魅力的な雰囲気を同時に持っています。",
        "rich-story-title": "📚 AIと観相学の話",
        "story-1-title": "AIが人の顔を認識する方法",
        "story-1-desc": "AIは数百のランドマークを通じて顔の構造を把握します。これは機械学習の核心であるパターン認識技術のおかげです。",
        "story-2-title": "動物顔による性格診断の由来",
        "story-2-desc": "印象を動物に例えることは、古くから東洋西洋を問わず人間の特徴を直感的に理解する方法の一つでした。",
        "faq-title": "❓ よくある質問 (FAQ)",
        "faq-1-q": "個人情報（写真）は安全ですか？",
        "faq-1-a": "当サービスはプライバシー保護を最優先します。画像はブラウザ内でのみ処理され、分析後すぐに削除されます。サーバーには1バイトの画像データも送信されません。",
        "faq-2-q": "結果の正確度はどのくらいですか？",
        "faq-2-a": "数万の学習データに基づきますが、照明や角度により差が生じることがあります。正面からの自然な写真でのテストをお勧めします。",
        "faq-3-q": "利用料金はかかりますか？",
        "faq-3-a": "いいえ、すべてのユーザーに100%無料で提供されます。広告収益により、継続的なアップデートとモデル改善を行っています。",
        "footer-about": "紹介 (About)",
        "footer-technic": "技術 (Technic)",
        "footer-terms": "利用規約",
        "footer-contact": "お問い合わせ (Contact)",
        "footer-copyright": "© 2024 AnimalFace AI. All rights reserved. 💖",
        "footer-note": "AI技術が世界に楽しさを提供できると信じています。"
    },
    zh: {
        "main-title": "AI 动物脸测试",
        "main-subtitle": "你长得像哪种小可爱？ 🐶🐱",
        "security-msg": "🛡️ 照片不会发送到服务器，请放心！",
        "btn-start": "开始分析! ✨",
        "btn-retry": "重新测试! 🐾",
        "loading-msg": "AI 正在努力为您分析中...",
        "result-title": "分析结果",
        "animal-dog": "犬系脸",
        "animal-cat": "猫系脸",
        "how-to-title": "🐾 使用指南",
        "feature-analysis-title": "✨ 为什么长得像它？ (面部分析)",
        "footer-privacy": "隐私政策",
        "desc-dog": "你拥有一张超级可爱的犬系脸！散发着让人感到幸福的温和能量。 🐶",
        "desc-cat": "你拥有一张充满魅力的猫系脸！高冷又神秘的气质真的太酷了。 🐱",
        "result-text": "你是 {percent}% {animal}!",
        "feat-dog-1": "你拥有圆润且温和的眼神！",
        "feat-dog-2": "柔和的下颌线给人一种亲切感。",
        "feat-dog-3": "散发着明亮又可爱的气息！",
        "feat-cat-1": "眼角微扬，拥有一双迷人的眼睛！",
        "feat-cat-2": "干练的面部轮廓非常出众。",
        "feat-cat-3": "流露出高冷又时髦的气质！",
        "result-badge": "Perfect Match! 💖",
        "viral-badge": "实时热门测试！ 🔥",
        "share-cta": "你的朋友长得像什么动物？立即分享！",
        "btn-copy": "复制链接",
        "share-note": "* Instagram请复制链接后分享到快拍/个人主页！",
        "guide-step-1": "请在光线充足的地方正对摄像头。",
        "guide-step-2": "点击开始分析按钮并等待3秒。",
        "guide-step-3": "查看AI分析的动物脸结果及其特征！",
        "rich-intro-title": "✨ AI 动物脸测试：隐藏在脸上的秘密",
        "rich-intro-desc": "'AnimalFace AI' 不仅仅是娱乐，它是最前沿人工智能技术的结晶。利用 Google 的 TensorFlow.js 库，精确提取脸部特征点，并与数万条大数据进行对比分析。看看你独特的气质和印象最像哪种动物吧。",
        "rich-why-ai-title": "🔍 为什么选择人工智能(AI)？",
        "rich-why-ai-desc": "与简单的问答方式不同，本服务使用实时图像识别技术 CNN（卷积神经网络）。AI 根据学习到的数据，对眼角角度、鼻宽、下颌线流向等细微差别进行量化，从而得出结果。这为您提供了类似于将现代面相学数据数字化并进行分析的体验。",
        "rich-guide-title": "🐱 代表性动物脸分析指南",
        "face-dog-title": "🐕 犬系脸 (Doggy Face)",
        "face-dog-desc": "整体脸型圆润，眼神温柔。给人一种信任感和亲切感，笑起来时嘴角上扬的样子很有魅力。",
        "face-cat-title": "🐈 猫系脸 (Cat Face)",
        "face-cat-desc": "给人一种干练、高冷的感觉。眼角微微上扬，精致的五官展现出独特的魅力。",
        "face-rabbit-title": "🐰 兔系脸 (Rabbit Face)",
        "face-rabbit-desc": "清澈的大眼睛和可爱的门牙是其特点。是童颜的代表，散发积极向上的能量。",
        "face-fox-title": "🦊 狐系脸 (Fox Face)",
        "face-fox-desc": "下颌线纤细，眼神修长且富有神秘感。同时具备理智与迷人的气质。",
        "rich-story-title": "📚 AI 与面相学的故事",
        "story-1-title": "AI 如何识别人的面部",
        "story-1-desc": "AI 通过数百个关键点来掌握脸部结构。这得益于机器学习的核心——模式识别技术。",
        "story-2-title": "动物脸性格测试的起源",
        "story-2-desc": "将人的印象比作动物，自古以来就是跨越文化直观理解人类特征的一种方式。",
        "faq-title": "❓ 常见问题 (FAQ)",
        "faq-1-q": "我的个人信息（照片）安全吗？",
        "faq-1-a": "本服务优先保护隐私。拍摄的图像仅在用户浏览器内处理，分析后立即删除。服务器不会接收任何图像数据。",
        "faq-2-q": "结果的准确度如何？",
        "faq-2-a": "虽然基于海量学习数据，但可能受光线或角度影响。建议使用自然的正面照片进行测试。",
        "faq-3-q": "是否收取服务费？",
        "faq-3-a": "不，本服务对所有用户 100% 免费。我们通过广告收益维持运营并持续改进 AI 模型。",
        "footer-about": "关于 (About)",
        "footer-technic": "技术 (Technic)",
        "footer-terms": "使用条款",
        "footer-contact": "联系我们 (Contact)",
        "footer-copyright": "© 2024 AnimalFace AI. All rights reserved. 💖",
        "footer-note": "我们相信人工智能技术能给世界带来快乐。"
    },
    es: {
        "main-title": "Test de Cara de Animal IA",
        "main-subtitle": "¿A qué animal te pareces? 🐶🐱",
        "security-msg": "🛡️ ¡Las fotos no se guardan en el servidor!",
        "btn-start": "¡Empezar Análisis! ✨",
        "btn-retry": "¡Intentar de Nuevo! 🐾",
        "loading-msg": "¡IA está analizando tus rasgos!",
        "result-title": "Resultados",
        "animal-dog": "Cara de Perro",
        "animal-cat": "Cara de Gato",
        "how-to-title": "🐾 Guía de Uso",
        "feature-analysis-title": "✨ ¿Por qué este resultado? (Análisis)",
        "footer-privacy": "Privacidad",
        "desc-dog": "¡Tienes una cara de perro adorable! Irradias una energía amable que hace feliz a todos. 🐶",
        "desc-cat": "¡Tienes una cara de gato encantadora! Tienes un aire elegante y misterioso. 🐱",
        "result-text": "¡Eres un {animal} al {percent}%!",
        "feat-dog-1": "¡Tienes ojos redondos y una mirada muy dulce!",
        "feat-dog-2": "Tu mandíbula suave da una impresión muy amigable.",
        "feat-dog-3": "¡Tienes un aura brillante y muy linda!",
        "feat-cat-1": "¡Las esquinas de tus ojos son encantadoras!",
        "feat-cat-2": "Tu línea facial definida destaca mucho.",
        "feat-cat-3": "¡Transmites un aire elegante y sofisticado!",
        "result-badge": "Perfect Match! 💖",
        "viral-badge": "¡Tendencia ahora! 🔥",
        "share-cta": "¿Qué animal son tus amigos? ¡Compártelo ahora!",
        "btn-copy": "Copiar enlace",
        "share-note": "* Para Instagram, copia el enlace y compártelo en tu Historia.",
        "guide-step-1": "Mire a la cámara en un área bien iluminada.",
        "guide-step-2": "Presione el botón y espere 3 segundos.",
        "guide-step-3": "¡Mira tu resultado y las características analizadas!",
        "rich-intro-title": "✨ Test IA: Secretos en tu Rostro",
        "rich-intro-desc": "'AnimalFace AI' es la culminación de la tecnología de IA más avanzada. Utiliza TensorFlow.js de Google para extraer rasgos faciales con precisión y compararlos con miles de datos para encontrar tu parecido animal.",
        "rich-why-ai-title": "🔍 ¿Por qué Inteligencia Artificial (IA)?",
        "rich-why-ai-desc": "Usamos Redes Neuronales Convolucionales (CNN) para analizar diferencias sutiles como el ángulo de los ojos y la línea de la mandíbula, ofreciendo una versión digital de la fisonomía moderna.",
        "rich-guide-title": "🐱 Guía de Tipos de Caras",
        "face-dog-title": "🐕 Cara de Perro",
        "face-dog-desc": "Se caracteriza por un rostro redondeado y ojos amables. Transmite confianza y cercanía.",
        "face-cat-title": "🐈 Cara de Gato",
        "face-cat-desc": "Un tipo de rostro sofisticado. Las esquinas de los ojos suelen estar elevadas, dando un aire chic.",
        "face-rabbit-title": "🐰 Cara de Conejo",
        "face-rabbit-desc": "Ojos grandes y dientes frontales adorables. Es el rostro representativo de la juventud y energía.",
        "face-fox-title": "🦊 Cara de Zorro",
        "face-fox-desc": "Mandíbula delgada y ojos alargados. Tiene un aire intelectual y misterioso a la vez.",
        "rich-story-title": "📚 IA y Fisonomía",
        "story-1-title": "Cómo la IA reconoce rostros",
        "story-1-desc": "La IA identifica la estructura facial mediante cientos de puntos de referencia y reconocimiento de patrones.",
        "story-2-title": "Origen de los tipos de cara",
        "story-2-desc": "Comparar humanos con animales ha sido una forma intuitiva de entender la personalidad desde hace siglos.",
        "faq-title": "❓ Preguntas Frecuentes (FAQ)",
        "faq-1-q": "¿Es segura mi foto?",
        "faq-1-a": "Privacidad total. Las imágenes se procesan solo en tu navegador y se borran al instante. Nada se envía al servidor.",
        "faq-2-q": "¿Qué tan exacto es?",
        "faq-2-a": "Depende de la luz y el ángulo. Recomendamos una foto frontal natural para mejores resultados.",
        "faq-3-q": "¿Es gratis?",
        "faq-3-a": "Sí, 100% gratis. Nos mantenemos gracias a la publicidad para seguir mejorando el modelo IA.",
        "footer-about": "Sobre nosotros",
        "footer-technic": "Técnica",
        "footer-terms": "Términos",
        "footer-contact": "Contacto",
        "footer-copyright": "© 2024 AnimalFace AI. All rights reserved. 💖",
        "footer-note": "Creemos que la IA puede traer alegría al mundo."
    },
    fr: {
        "main-title": "Test de Visage d'Animal IA",
        "main-subtitle": "Quel animal es-tu ? 🐶🐱",
        "security-msg": "🛡️ Les photos ne sont pas stockées sur le serveur !",
        "btn-start": "Démarrer l'Analyse ! ✨",
        "btn-retry": "Réessayer ! 🐾",
        "loading-msg": "L'IA analyse vos traits...",
        "result-title": "Résultats",
        "animal-dog": "Visage de Chien",
        "animal-cat": "Visage de Chat",
        "how-to-title": "🐾 Guide d'utilisation",
        "feature-analysis-title": "✨ Pourquoi ce look ? (Analyse)",
        "footer-privacy": "Confidentialité",
        "desc-dog": "Vous avez un adorable visage de chien ! Vous dégagez une énergie bienveillante. 🐶",
        "desc-cat": "Vous avez un charmant visage de chat ! Vous avez une aura chic et mystérieuse. 🐱",
        "result-text": "Vous êtes à {percent}% un {animal} !",
        "feat-dog-1": "Vous avez des yeux ronds et un regard très doux !",
        "feat-dog-2": "Votre mâchoire douce donne une impression amicale.",
        "feat-dog-3": "Vous avez une aura brillante et mignonne !",
        "feat-cat-1": "Les coins de vos yeux sont magnifiquement relevés !",
        "feat-cat-2": "Votre ligne de visage nette se démarque vraiment.",
        "feat-cat-3": "Vous dégagez une ambiance chic et sophistiquée !",
        "result-badge": "Perfect Match! 💖",
        "viral-badge": "En vogue ! 🔥",
        "share-cta": "Quel animal sont vos amis ? Partagez !",
        "btn-copy": "Copier le lien",
        "share-note": "* Pour Instagram, copiez le lien et partagez-le en Story.",
        "guide-step-1": "Regardez la caméra dans un endroit éclairé.",
        "guide-step-2": "Appuyez sur le bouton et attendez 3 secondes.",
        "guide-step-3": "Découvrez votre résultat et vos caractéristiques !",
        "rich-intro-title": "✨ Test IA : Secrets de votre Visage",
        "rich-intro-desc": "'AnimalFace AI' utilise la technologie TensorFlow.js de Google pour analyser vos traits faciaux et les comparer à des milliers de données pour identifier votre animal totem.",
        "rich-why-ai-title": "🔍 Pourquoi l'IA ?",
        "rich-why-ai-desc": "Nous utilisons des réseaux de neurones (CNN) pour mesurer des détails comme l'angle des yeux et la structure osseuse, offrant une analyse moderne et précise.",
        "rich-guide-title": "🐱 Guide des Visages d'Animaux",
        "face-dog-title": "🐕 Visage de Chien",
        "face-dog-desc": "Un visage rond et des yeux doux qui inspirent la confiance et la gentillesse.",
        "face-cat-title": "🐈 Visage de Chat",
        "face-cat-desc": "Un look sophistiqué avec des traits fins et des yeux félins très élégants.",
        "face-rabbit-title": "🐰 Visage de Lapin",
        "face-rabbit-desc": "De grands yeux et un sourire adorable, symbole de jeunesse et de dynamisme.",
        "face-fox-title": "🦊 Visage de Renard",
        "face-fox-desc": "Des traits allongés et mystérieux qui dégagent une certaine intelligence.",
        "rich-story-title": "📚 IA et Physiognomonie",
        "story-1-title": "Comment l'IA reconnaît les visages",
        "story-1-desc": "L'IA identifie la structure faciale grâce à des centaines de points de repère numériques.",
        "story-2-title": "Origine des tests",
        "story-2-desc": "Comparer l'humain à l'animal est une méthode intuitive utilisée depuis des siècles pour comprendre les personnalités.",
        "faq-title": "❓ FAQ",
        "faq-1-q": "Mes photos sont-elles en sécurité ?",
        "faq-1-a": "Sécurité totale. Le traitement se fait localement dans votre navigateur. Aucune donnée n'est envoyée.",
        "faq-2-q": "Est-ce précis ?",
        "faq-2-a": "La lumière joue un rôle. Utilisez une photo de face pour un résultat optimal.",
        "faq-3-q": "Est-ce gratuit ?",
        "faq-3-a": "Oui, gratuit à 100%. Les publicités nous permettent de maintenir et d'améliorer nos modèles d'IA.",
        "footer-about": "À propos",
        "footer-technic": "Technique",
        "footer-terms": "Conditions",
        "footer-contact": "Contact",
        "footer-copyright": "© 2024 AnimalFace AI. All rights reserved. 💖",
        "footer-note": "L'IA peut apporter de la joie au monde."
    },
    de: {
        "main-title": "KI-Tiergesichtstest",
        "main-subtitle": "Welches Tier bist du? 🐶🐱",
        "security-msg": "🛡️ Fotos werden nicht auf dem Server gespeichert!",
        "btn-start": "Analyse Starten! ✨",
        "btn-retry": "Nochmal Versuchen! 🐾",
        "loading-msg": "KI analysiert deine Züge...",
        "result-title": "Ergebnisse",
        "animal-dog": "Hundegesicht",
        "animal-cat": "Katzengesicht",
        "how-to-title": "🐾 Bedienungsanleitung",
        "feature-analysis-title": "✨ Warum dieses Ergebnis? (Analyse)",
        "footer-privacy": "Datenschutz",
        "desc-dog": "Du hast ein reizendes Hundegesicht! Du strahlst gütige Energie aus. 🐶",
        "desc-cat": "Du hast ein charmantes Katzengesicht! Du hast eine schicke Ausstrahlung. 🐱",
        "result-text": "Du bist zu {percent}% ein {animal}!",
        "feat-dog-1": "Du hast runde und sehr freundlich aussehende Augen!",
        "feat-dog-2": "Deine weiche Kieferpartie wirkt sehr sympathisch.",
        "feat-dog-3": "Du hast eine strahlende und süße Aura!",
        "feat-cat-1": "Deine Augenwinkel sind charmant nach oben gezogen!",
        "feat-cat-2": "Deine markante Gesichtslinie sticht hervor.",
        "feat-cat-3": "Du versprühst eine schicke Atmosphäre!",
        "result-badge": "Perfect Match! 💖",
        "viral-badge": "Jetzt im Trend! 🔥",
        "share-cta": "Welches Tier sind deine Freunde? Jetzt teilen!",
        "btn-copy": "Link kopieren",
        "share-note": "* Für Instagram: Link kopieren und in Story teilen.",
        "guide-step-1": "Schau in die Kamera in einem hellen Bereich.",
        "guide-step-2": "Start-Button drücken und 3 Sekunden warten.",
        "guide-step-3": "Prüfe dein Ergebnis und die KI-Merkmale!",
        "rich-intro-title": "✨ KI-Test: Geheimnisse in deinem Gesicht",
        "rich-intro-desc": "'AnimalFace AI' nutzt TensorFlow.js von Google, um Gesichtszüge präzise zu extrahieren und mit Tausenden von Daten zu vergleichen, um deine tierische Ähnlichkeit zu finden.",
        "rich-why-ai-title": "🔍 Warum KI?",
        "rich-why-ai-desc": "Wir nutzen neuronale Netze (CNN), um Details wie Augenwinkel und Kieferfluss zu messen, was eine digitale Form der modernen Physiognomie darstellt.",
        "rich-guide-title": "🐱 Guide für Tiergesichter",
        "face-dog-title": "🐕 Hundegesicht",
        "face-dog-desc": "Rundes Gesicht und gütige Augen. Wirkt vertrauenserweckend und freundlich.",
        "face-cat-title": "🐈 Katzengesicht",
        "face-cat-desc": "Ein schicker Gesichtstyp mit hochgezogenen Augenwinkeln und markanten Zügen.",
        "face-rabbit-title": "🐰 Hasengesicht",
        "face-rabbit-desc": "Große Augen und süße Zähne. Ein Look voller Jugendlichkeit und Energie.",
        "face-fox-title": "🦊 Fuchsgesicht",
        "face-fox-desc": "Schmaler Kiefer und lange Augen. Wirkt intellektuell und geheimnisvoll.",
        "rich-story-title": "📚 KI und Physiognomie",
        "story-1-title": "Wie KI Gesichter erkennt",
        "story-1-desc": "Die KI versteht die Gesichtsstruktur über Landmarken und Mustererkennung.",
        "story-2-title": "Ursprung der Tiertests",
        "story-2-desc": "Menschen mit Tieren zu vergleichen ist ein intuitiver Weg, Charakterzüge seit Jahrhunderten zu verstehen.",
        "faq-title": "❓ FAQ",
        "faq-1-q": "Sind meine Fotos sicher?",
        "faq-1-a": "Datenschutz hat Priorität. Bilder werden nur im Browser verarbeitet und sofort gelöscht.",
        "faq-2-q": "Wie genau ist es?",
        "faq-2-a": "Licht und Winkel sind wichtig. Ein frontales Foto wird für beste Ergebnisse empfohlen.",
        "faq-3-q": "Ist es kostenlos?",
        "faq-3-a": "Ja, 100% kostenlos. Werbung hilft uns, die KI-Modelle ständig zu verbessern.",
        "footer-about": "Über uns",
        "footer-technic": "Technik",
        "footer-terms": "Bedingungen",
        "footer-contact": "Kontakt",
        "footer-copyright": "© 2024 AnimalFace AI. All rights reserved. 💖",
        "footer-note": "Wir glauben, dass KI Freude in die Welt bringen kann."
    }
};

// Elements
const webcamContainer = document.getElementById("webcam-container");
const loading = document.getElementById("loading");
const resultContainer = document.getElementById("result-container");
const btnCaptureStart = document.getElementById("btn-capture-start");
const btnWebcamRetry = document.getElementById("btn-webcam-retry");
const langSelect = document.getElementById("lang-select");

function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('animalFaceLang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[lang] && i18n[lang][key]) el.innerText = i18n[lang][key];
    });
    
    // If result is shown, update its text
    if (resultContainer.style.display !== 'none') {
        const lastAnimal = document.getElementById("result-title").getAttribute('data-last-animal');
        const lastPercent = document.getElementById("result-title").getAttribute('data-last-percent');
        if (lastAnimal && lastPercent) renderResult(lastAnimal, lastPercent);
    }
}

langSelect.addEventListener('change', (e) => updateLanguage(e.target.value));

async function initModel() {
    if (model) return;
    try {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
    } catch (error) {
        console.error("Model load failed", error);
    }
}

async function setupWebcam() {
    loading.style.display = "block";
    btnCaptureStart.style.display = "none";
    await initModel();
    try {
        webcam = new tmImage.Webcam(320, 320, true);
        await webcam.setup();
        await webcam.play();
        webcamContainer.innerHTML = `<div id="countdown-overlay" style="display: none;">3</div>`;
        webcamContainer.appendChild(webcam.canvas);
        loading.style.display = "none";
        btnCaptureStart.style.display = "inline-block";
        window.requestAnimationFrame(webcamLoop);
    } catch (e) { console.error(e); }
}

function webcamLoop() {
    if (isCaptured) return;
    webcam.update();
    window.requestAnimationFrame(webcamLoop);
}

btnCaptureStart.addEventListener("click", () => {
    btnCaptureStart.style.display = "none";
    const overlay = document.getElementById("countdown-overlay");
    overlay.style.display = "flex";
    let count = 3;
    overlay.innerText = count;
    const interval = setInterval(() => {
        count--;
        if (count > 0) overlay.innerText = count;
        else {
            clearInterval(interval);
            overlay.style.display = "none";
            captureAndPredict();
        }
    }, 1000);
});

async function captureAndPredict() {
    isCaptured = true;
    webcam.stop();
    loading.style.display = "block";
    await predict(webcam.canvas);
    loading.style.display = "none";
    resultContainer.style.display = "block";
    btnWebcamRetry.style.display = "inline-block";
    resultContainer.scrollIntoView({ behavior: 'smooth' });
}

btnWebcamRetry.addEventListener("click", async () => {
    isCaptured = false;
    resultContainer.style.display = "none";
    btnWebcamRetry.style.display = "none";
    await setupWebcam();
});

async function predict(input) {
    const prediction = await model.predict(input);
    const sorted = [...prediction].sort((a,b) => b.probability - a.probability);
    const top = sorted[0];
    const percent = (top.probability * 100).toFixed(0);
    
    renderResult(top.className, percent);

    prediction.forEach(p => {
        const pVal = (p.probability * 100).toFixed(0);
        const type = p.className === "강아지" ? "dog" : "cat";
        document.getElementById(`${type}-bar`).style.width = pVal + "%";
        document.getElementById(`${type}-percent`).innerText = pVal + "%";
    });
}

function renderResult(className, percent) {
    const titleEl = document.getElementById("result-title");
    titleEl.setAttribute('data-last-animal', className);
    titleEl.setAttribute('data-last-percent', percent);

    const animalName = className === "강아지" ? i18n[currentLang]["animal-dog"] : i18n[currentLang]["animal-cat"];
    titleEl.innerText = i18n[currentLang]["result-text"]
        .replace("{percent}", percent)
        .replace("{animal}", animalName);
    
    document.getElementById("result-description").innerText = className === "강아지" 
        ? i18n[currentLang]["desc-dog"] : i18n[currentLang]["desc-cat"];

    const featureList = document.getElementById("feature-list");
    featureList.innerHTML = "";
    const prefix = className === "강아지" ? "feat-dog-" : "feat-cat-";
    for(let i=1; i<=3; i++) {
        const li = document.createElement("li");
        li.innerText = i18n[currentLang][prefix + i];
        featureList.appendChild(li);
    }
}

// --- Viral SNS Sharing Functions ---

function getShareText() {
    const title = document.getElementById("result-title").innerText;
    return `나의 AI 동물상 결과: ${title} 🐾\n당신은 어떤 동물과 닮았나요? 지금 바로 확인해보세요! ✨\n\n#동물상테스트 #AI테스트 #얼굴분석 #AnimalFace`;
}

function shareTwitter() {
    const text = getShareText();
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
}

function shareFacebook() {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
}

function shareReddit() {
    const url = window.location.href;
    const title = "나의 AI 동물상 테스트 결과 🐾";
    window.open(`https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`);
}

function shareTelegram() {
    const text = getShareText();
    const url = window.location.href;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
}

function copyLinkForIG() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        alert(i18n[currentLang]["share-note"]);
    });
}

function copyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        alert("Success! 🔗");
    });
}

const savedLang = localStorage.getItem('animalFaceLang') || (i18n[navigator.language.split('-')[0]] ? navigator.language.split('-')[0] : 'ko');
langSelect.value = savedLang;
updateLanguage(savedLang);
setupWebcam();
