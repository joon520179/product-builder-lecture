document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    // 스크롤 시 내비게이션 바 스타일 변경
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 모바일 메뉴 토글
    mobileToggle.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.backgroundColor = 'white';
        navLinks.style.padding = '20px';
        navLinks.style.boxShadow = '0 5px 10px rgba(0,0,0,0.1)';
        
        // 링크 클릭 시 메뉴 닫기 (모바일)
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.style.color = '#333';
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navLinks.style.display = 'none';
                }
            });
        });
    });

    // 부드러운 스크롤 이동
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 폼 제출 시 간단한 알림 (Formspree가 실제 처리를 담당하지만 사용자 경험을 위해 추가)
    const contactForm = document.querySelector('.contact-form-main');
    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            // 실제 제출은 action URL로 진행되므로 여기서는 간단한 UI 피드백만 고려 가능
            // Formspree의 기본 성공 페이지로 이동하게 됨
        });
    }
});
