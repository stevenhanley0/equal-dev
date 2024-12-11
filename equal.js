// Ensure GSAP is loaded
if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    // Register plugins
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const headlines = [
        ".vision-headline",
        ".process-headline",
        ".platform-headline",
        ".team-headline",
        ".join-headline"
    ];

    // Set initial opacity to prevent flash
    headlines.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.style.opacity = "0";
        });
    });

    // Wait for all content to load before initializing animations
    function initAnimations() {
        headlines.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            
            elements.forEach(element => {
                // Create the split
                const split = new SplitText(element, {
                    type: "lines",
                    linesClass: "split-line",
                    spanWrapper: true,
                    lineThreshold: 0.5
                });

                // Add CSS to ensure lines are block-level
                split.lines.forEach(line => {
                    line.style.display = "block";
                });

                // Animate the split lines
                gsap.fromTo(split.lines, 
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

    // Wait for content to load
    Promise.all([
        // Wait for images
        ...Array.from(document.querySelectorAll('img')).map(img => {
            return new Promise((resolve) => {
                if (img.complete) resolve();
                else img.onload = () => resolve();
            });
        }),
        // Wait for SVGs
        ...Array.from(document.querySelectorAll('svg')).map(svg => {
            return new Promise((resolve) => {
                if (svg.getBBox) resolve();
                else svg.onload = () => resolve();
            });
        }),
        // Wait for Lottie animations
        ...Array.from(document.querySelectorAll('lottie-player')).map(lottie => {
            return new Promise((resolve) => {
                if (lottie.loaded) resolve();
                else lottie.addEventListener('ready', () => resolve());
            });
        })
    ]).then(() => {
        // Add a small delay to ensure everything is rendered
        setTimeout(() => {
            ScrollTrigger.refresh();
            initAnimations();
            // Double check positions after a moment
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 500);
        }, 100);
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
