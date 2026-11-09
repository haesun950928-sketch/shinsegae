    
   // ---------이벤트 gsap
        (function() {
            gsap.registerPlugin(Draggable);

            const area = document.querySelector(".events");
            const track = area.querySelector(".event");

            const cards = Array.from(track.children);
            const texts = Array.from(
                document.querySelector(".event-txt").children
            );

            const count = cards.length;
            const head = { value: 1 }; // 두 번째 피터팬부터 시작

            const proxy = document.createElement("div");
            const wrap = gsap.utils.wrap(-count / 2, count / 2);

            let target = 1;
            let selected = -1;
            let motion;
            let step = 1;
            let pc = false;
            let dragging = false;
            let wheelTimer;

            proxy.className = "event-drag-proxy";
            area.appendChild(proxy);

            // 포스터 위치 · 크기 · 투명도 설정
            function render() {
                cards.forEach(function(card, index) {
                    const distance = wrap(index - head.value);
                    const absolute = Math.abs(distance);

                    const opacity = pc
                        ? gsap.utils.clamp(0, 1, (2 - absolute) / 0.6)
                        : gsap.utils.clamp(0, 1, 1 - absolute);

                    const scale = absolute <= 1
                        ? 1 - absolute * 0.2
                        : Math.max(0, (2 - absolute) * 0.8);

                    gsap.set(card, {
                        xPercent: -50,
                        yPercent: pc ? -50 : 0,
                        x: distance * step,
                        scale: scale,
                        autoAlpha: opacity,
                        zIndex: Math.round((2 - absolute) * 10),
                        pointerEvents: opacity > 0.5 ? "auto" : "none"
                    });
                });

                // 가운데 포스터 번호 계산
                const next = (
                    (Math.round(head.value) % count) + count
                ) % count;

                if (next === selected) return;

                selected = next;

                cards.forEach(function(card, index) {
                    card.classList.toggle("active", index === next);
                });

                // 가운데 포스터와 아래 설명 연결
                gsap.killTweensOf(texts);

                texts.forEach(function(text, index) {
                    text.classList.toggle("active", index === next);
                });

                gsap.fromTo(
                    texts[next],
                    {
                        opacity: 0,
                        y: 12
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.35,
                        overwrite: true
                    }
                );
            }

            // GSAP으로 부드럽게 이동
            function move(value, duration = 0.5) {
                target = value;

                if (motion) motion.kill();

                motion = gsap.to(head, {
                    value: target,
                    duration: duration,
                    ease: "power3.out",
                    onUpdate: render
                });
            }

            // 가까운 포스터를 가운데에 정렬
            function snap() {
                move(Math.round(target));
            }

            // 화면 크기에 따라 이동 간격 다시 계산
            function measure() {
                pc = window.innerWidth >= 900;
                step = area.clientWidth * (pc ? 0.36 : 1.15);

                render();
            }

            // 다음 버튼
            area.querySelector(".next").addEventListener(
                "click",
                function() {
                    clearTimeout(wheelTimer);
                    move(Math.round(target) + 1);
                }
            );

            // 이전 버튼
            area.querySelector(".prev").addEventListener(
                "click",
                function() {
                    clearTimeout(wheelTimer);
                    move(Math.round(target) - 1);
                }
            );

            // 브라우저의 기본 이미지 끌기 방지
            area.addEventListener("dragstart", function(event) {
                event.preventDefault();
            });

            // 마우스로 끌기 · 모바일 손가락으로 밀기
            Draggable.create(proxy, {
                type: "x",
                trigger: track,
                allowNativeTouchScrolling: true,
                minimumMovement: 5,

                onPress: function() {
                    clearTimeout(wheelTimer);

                    if (motion) motion.kill();

                    target = head.value;
                    this.startValue = head.value;
                    dragging = true;
                },

                onDrag: function() {
                    target = this.startValue
                        + (this.startX - this.x) / step * 2.5;

                    head.value = target;

                    render();
                },

                onRelease: function() {
                    dragging = false;

                    snap();
                }
            });

            // 트랙패드 두 손가락 좌우 밀기
            area.addEventListener("wheel", function(event) {
                if (event.ctrlKey || dragging) return;

                // 세로 휠은 포스터를 움직이지 않고 페이지 스크롤
                if (
                    Math.abs(event.deltaX)
                    <= Math.abs(event.deltaY)
                ) {
                    return;
                }

                event.preventDefault();

                const unit = event.deltaMode === 1
                    ? 16
                    : event.deltaMode === 2
                        ? area.clientWidth
                        : 1;

                move(
                    target + event.deltaX * unit / step,
                    0.18
                );

                clearTimeout(wheelTimer);
                wheelTimer = setTimeout(snap, 180);
            }, { passive: false });

            // 처음 포스터 배치
            measure();

            // 모바일 · 태블릿 · PC 크기 변경 대응
            window.addEventListener("resize", measure);
        })();
