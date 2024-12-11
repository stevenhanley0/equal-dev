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

    headlines.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        console.log(`Found ${elements.length} elements for ${selector}`);
        
        elements.forEach(element => {
            console.log(`Creating animation for ${selector}`);
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
                        invalidateOnRefresh: true,
                        onEnter: () => console.log(`Triggered ${selector}`)
                    }
                }
            );
        });
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
