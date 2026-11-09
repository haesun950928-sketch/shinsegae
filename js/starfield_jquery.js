


    $(document).ready(function(){

    // ---------------- 모바일 메뉴
        $(".icon-menu").click(function() {
            $(".mobile-menu")
                .css("transition", "transform 0.3s ease")
                .addClass("active");
        });

        $(".close").click(function() {
            $(".mobile-menu")
                .css("transition", "transform 0.3s ease")
                .removeClass("active");
        });

        // 900px 경계를 넘으면 메뉴 초기화
        let mobileMenuSize = window.innerWidth < 900;

        $(window).on("resize", function() {
            const mobileSize = window.innerWidth < 900;

            if (mobileMenuSize !== mobileSize) {
                $(".mobile-menu")
                    .css("transition", "none")
                    .removeClass("active");

                $(".gnb .sub, .sub-bg")
                    .stop(true, true)
                    .hide();
            }
    
            mobileMenuSize = mobileSize;
        });


    // ------------------모바일 sub
        $(".gnb>li>a").click(function(e){
            if (window.innerWidth >= 900) return;
            e.preventDefault();

            $(".gnb .sub").not($(this).next(".sub")).stop().slideUp();
            $(this).next(".sub").stop().slideToggle();
        });


    // PC 메뉴 열기
    $(".gnb > li").mouseenter(function() {
        if (window.innerWidth < 900) return;

        $(".gnb .sub, .sub-bg").stop().slideDown();
    });

    // 서브 배경까지 벗어나면 닫기
    $("header").mouseleave(function() {
        if (window.innerWidth < 900) return;

        $(".gnb .sub, .sub-bg").stop().slideUp();
    });





    // -------------------메인 브랜드 이미지
        const brand = $(".brand");

        // 브랜드 이미지 복제
        brand.append(brand.children("li").clone().addClass("brand-copy"));

        let i = 0;
        let isPaused = false;

        // 마우스를 올리면 멈춤 떼면 다시 움직임
        brand.hover(
            function() {
                isPaused = true;
            },
            function() {
                isPaused = false;
            }
        );

        // 브랜드 이미지 자동 이동
        setInterval(function() {
            if (window.innerWidth < 900) {
                i = 0;
                brand.css("transform", "translateX(0)");
                    return;
                }

                if (isPaused) return;

                const moveWidth =
                    brand.children("li").eq(1)[0].offsetLeft -
                    brand.children("li").eq(0)[0].offsetLeft;

                i -= 1;

                if (i <= -moveWidth) {
                    brand.append(brand.children("li").first());
                    i += moveWidth;
                }

                brand.css("transform", `translateX(${i}px)`);
            }, 20);



    //------------------ 키즈 - PC 마우스 호버
        $(".kids li").hover(
            function() {
                if (window.matchMedia("(hover: hover)").matches) {
                    $(this).addClass("active");
                }
            },
            function() {
                if (window.matchMedia("(hover: hover)").matches) {
                    $(this).removeClass("active");
                }
            }
        );

        // 임시 링크 클릭 시 맨 위로 이동하지 않게 처리
        $(".kids-btn, .library .btn").click(function(e) {
            e.preventDefault();
            e.stopPropagation();
        });

        // 키즈 - 모바일 터치
        $(".kids li").click(function() {
            if (window.matchMedia("(hover: none)").matches) {
                $(".kids li").not(this).removeClass("active");
                $(this).toggleClass("active");
            }
        });


    //-----------------------------푸드

        const taste = $(".taste");
        const tastes = $(".taste").children("li").clone().removeClass("active");

        let tasteDragging = false;
        let tastePaused = false;
        let startX = 0;
        let startScroll = 0;

        taste.append(tastes);
        const firstCopy = taste.children("li").eq(6);
        const firstCard = taste.children("li").first();
        

        taste.mousedown(function(e){
            e.preventDefault(); // 이미지 자체가 끌리는 동작 방지
            tasteDragging = true;

            startX = e.clientX;
            startScroll = taste.scrollLeft();

            
        });


        $(document).mouseup(function() {
            tasteDragging = false;
        });


        taste.mousemove(function(e){

            if(tasteDragging){

                const moveX = e.clientX - startX;
                taste.scrollLeft(startScroll - moveX);
            }
            
        });

        setInterval(function() {
            
            if(tasteDragging || tastePaused)return;

            const loopWidth = firstCopy.offset().left - firstCard.offset().left;

            taste.scrollLeft(taste.scrollLeft() + 1);

            if(taste.scrollLeft() >= loopWidth){
                taste.scrollLeft(0);
            }

        }, 20);



       // 모바일에서 타코를 가운데 배치하는 함수
        function centerTaco() {
            if (window.innerWidth < 900) {
                const taco = taste.children("li").eq(2);

                const tacoX =
                    taco.offset().left - firstCard.offset().left;

                const centerSpace =
                    (taste.innerWidth() - taco.outerWidth()) / 2;

                taste.scrollLeft(tacoX - centerSpace);
            }
        }

        // 페이지를 처음 열었을 때 실행
        centerTaco();

        // 변경 전 화면 너비 기억
        let previousWidth = window.innerWidth;

        $(window).on("resize", function() {
            // PC 크기에서 모바일 크기로 넘어왔을 때만 실행
            if (previousWidth >= 900 && window.innerWidth < 900) {
                centerTaco();
            }

            previousWidth = window.innerWidth;
        });





        
        taste.find("li img").hover(
            function() {
                if (window.matchMedia("(hover: hover)").matches) {
                    tastePaused = true;
                }
            },
            function() {
                tastePaused = false;
            }
        );

        // 손가락을 대면 자동 이동 정지
        taste.on("touchstart", function() {
            tasteDragging = true;
            tastePaused = false;
        });

        // 손가락을 떼면 자동 이동 재개
        taste.on("touchend touchcancel", function() {
            tasteDragging = false;
            tastePaused = false;
        });





    });
        
        
