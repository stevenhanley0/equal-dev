// Ensure GSAP is loaded
if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Force a ScrollTrigger refresh on page load
    ScrollTrigger.refresh();

    // Define the animation for the specified classes
    const headlines = [
        ".vision-headline",
        ".process-headline",
        ".platform-headline",
        ".team-headline",
        ".join-headline"
    ];

    // Safari detection
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    function initAnimations() {
        // Kill any existing ScrollTriggers first
        ScrollTrigger.getAll().forEach(st => st.kill());
        
        headlines.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            console.log(`Initializing ${selector} with ${elements.length} elements`); // Debug log
            
            elements.forEach(element => {
                // Revert any existing splits
                SplitText.revert(element);
                
                const split = new SplitText(element, {
                    type: "lines",
                    linesClass: "split-line"
                });

                const animation = gsap.fromTo(
                    split.lines,
                    {
                        opacity: 0,
                        y: "50%"
                    },
                    {
                        opacity: 1,
                        y: "0%",
                        stagger: 0.075,
                        duration: 1,
                        ease: "power3.out",
                        paused: true // Start paused
                    }
                );

                // Create ScrollTrigger with simpler settings for Safari
                ScrollTrigger.create({
                    trigger: element,
                    start: "top 80%",
                    onEnter: () => {
                        console.log(`Triggering animation for ${selector}`); // Debug log
                        animation.play();
                    },
                    onEnterBack: () => animation.play(),
                    onLeave: () => animation.pause(),
                    onLeaveBack: () => animation.pause(),
                    markers: true,
                    // Special handling for Safari
                    fastScrollEnd: true,
                    preventOverlaps: true
                });
            });
        });
    }

    function waitForContent() {
        return new Promise((resolve) => {
            // Longer delay for Safari
            const minDelay = new Promise(r => setTimeout(r, isSafari ? 1000 : 500));
            
            let loadedCount = 0;
            const images = [...document.querySelectorAll('img')];
            const svgs = [...document.querySelectorAll('svg')];
            const lottieAnims = [...document.querySelectorAll('lottie-player')];
            const totalElements = images.length + svgs.length + lottieAnims.length;

            function checkComplete() {
                loadedCount++;
                if (loadedCount === totalElements) {
                    minDelay.then(resolve);
                }
            }

            // Handle images
            images.forEach(img => {
                if (img.complete) {
                    checkComplete();
                } else {
                    img.addEventListener('load', checkComplete);
                    img.addEventListener('error', checkComplete); // Handle failed loads
                }
            });

            // Handle SVGs
            svgs.forEach(svg => {
                if (svg.getBBox) {
                    checkComplete();
                } else {
                    svg.addEventListener('load', checkComplete);
                }
            });

            // Handle Lottie animations
            lottieAnims.forEach(anim => {
                if (anim.loaded) {
                    checkComplete();
                } else {
                    anim.addEventListener('ready', checkComplete);
                    anim.addEventListener('error', checkComplete);
                }
            });

            // If no elements to wait for, still wait for min delay
            if (totalElements === 0) {
                minDelay.then(resolve);
            }
        });
    }

    // Initialize everything with additional safeguards
    waitForContent().then(() => {
        // Force a layout recalculation
        document.body.offsetHeight;
        
        setTimeout(() => {
            initAnimations();
            
            // Additional refresh for Safari
            if (isSafari) {
                setTimeout(() => {
                    ScrollTrigger.refresh(true);
                    console.log("Safari refresh triggered"); // Debug log
                }, 500);
            }
        }, isSafari ? 200 : 100);
    });

    // More aggressive refresh handling for Safari
    if (isSafari) {
        window.addEventListener('scroll', () => {
            ScrollTrigger.update();
        }, { passive: true });
    }

    // Add additional refresh on orientation change
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            ScrollTrigger.refresh(true);
        }, 200);
    });
} else {
    console.warn("GSAP or ScrollTrigger not available. Falling back to default styles.");

    // Fallback: Ensure text is visible
    const headlines = document.querySelectorAll(
        ".vision-headline, .process-headline, .platform-headline, .team-headline, .join-headline"
    );

    headlines.forEach(element => {
        element.style.opacity = "1";
        element.style.transform = "none";
    });
}
