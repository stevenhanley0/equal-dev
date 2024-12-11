// Add debug logs
console.log("GSAP available:", typeof gsap !== "undefined");
console.log("ScrollTrigger available:", typeof ScrollTrigger !== "undefined");

// Ensure GSAP is loaded
if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    console.log("ScrollTrigger registered");

    // Define headlines FIRST
    const headlines = [
        ".vision-headline",
        ".process-headline", 
        ".platform-headline",
        ".team-headline",
        ".join-headline"
    ];

    // Set initial opacity AND transform to prevent flash
    headlines.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            gsap.set(el, { opacity: 0, y: "50%" });
        });
    });

    // Wait for all content to load before initializing animations
    function initAnimations() {
        headlines.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            console.log(`Found ${elements.length} elements for ${selector}`);
            
            elements.forEach(element => {
                console.log(`Creating animation for ${selector}`);
                const split = new SplitText(element, {
                    type: "lines",
                    linesClass: "split-line"
                });

                // Set initial state of split lines
                gsap.set(split.lines, { 
                    opacity: 0,
                    y: "50%"
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
                            invalidateOnRefresh: true,
                            onEnter: () => console.log(`Triggered ${selector}`),
                            onLeaveBack: () => {
                                // Reset the lines when scrolling back up
                                gsap.set(split.lines, { 
                                    opacity: 0,
                                    y: "50%"
                                });
                            }
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

    // Use the same headlines array for the fallback
    const headlines = [
        ".vision-headline",
        ".process-headline", 
        ".platform-headline",
        ".team-headline",
        ".join-headline"
    ];

    const elements = document.querySelectorAll(headlines.join(", "));
    elements.forEach(element => {
        element.style.opacity = "1";
        element.style.transform = "none";
    });
}
