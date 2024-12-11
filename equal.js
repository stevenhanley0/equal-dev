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

    function initAnimations() {
        // Kill any existing ScrollTriggers first
        ScrollTrigger.getAll().forEach(st => st.kill());
        
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
                            start: "top 85%", // Adjusted for better mobile viewing
                            toggleActions: "restart pause resume reset",
                            markers: true,
                            invalidateOnRefresh: true,
                            // Add specific settings for touch devices
                            onRefresh: self => {
                                // Force recalculation on refresh
                                self.scroll(self.scroll());
                            }
                        }
                    }
                );
            });
        });
    }

    function waitForContent() {
        return new Promise((resolve) => {
            // Add a minimum delay for Safari
            const minDelay = new Promise(r => setTimeout(r, 500));
            
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
        // Initial delay for Safari
        setTimeout(() => {
            initAnimations();
            
            // Force ScrollTrigger refresh after a delay
            setTimeout(() => {
                ScrollTrigger.refresh(true); // true forces a hard refresh
            }, 200);

            // Add resize handler for mobile orientation changes
            window.addEventListener('resize', () => {
                setTimeout(() => {
                    ScrollTrigger.refresh(true);
                }, 200);
            });
        }, 100);
    });

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
