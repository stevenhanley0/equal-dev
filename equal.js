// Ensure GSAP is loaded
if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    function initAnimations() {
        // Kill any existing ScrollTriggers first
        ScrollTrigger.getAll().forEach(st => st.kill());
        
        // Force a ScrollTrigger refresh
        ScrollTrigger.refresh();

        const headlines = [
            ".vision-headline",
            ".process-headline",
            ".platform-headline",
            ".team-headline",
            ".join-headline"
        ];
        
        headlines.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            
            elements.forEach(element => {
                // Revert any existing splits
                SplitText.revert(element);
                
                const split = new SplitText(element, {
                    type: "lines",
                    linesClass: "split-line"
                });

                gsap.fromTo(
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
                        scrollTrigger: {
                            trigger: element,
                            start: "top bottom-=100",
                            end: "top center",
                            toggleActions: "play none none reset",
                            markers: true,
                            invalidateOnRefresh: true
                        }
                    }
                );
            });
        });
    }

    function waitForContent() {
        return new Promise((resolve) => {
            let loadedCount = 0;
            const images = [...document.querySelectorAll('img')];
            const svgs = [...document.querySelectorAll('svg')];
            const lottieAnims = [...document.querySelectorAll('lottie-player')];
            const totalElements = images.length + svgs.length + lottieAnims.length;

            function checkComplete() {
                loadedCount++;
                if (loadedCount === totalElements) {
                    setTimeout(resolve, 100);
                }
            }

            // Handle images
            images.forEach(img => {
                if (img.complete) {
                    checkComplete();
                } else {
                    img.addEventListener('load', checkComplete);
                    img.addEventListener('error', checkComplete);
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

            // If no elements to wait for, resolve immediately
            if (totalElements === 0) {
                resolve();
            }
        });
    }

    // Initialize everything
    waitForContent().then(() => {
        initAnimations();
        // Double-check positions after a moment
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 500);
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
