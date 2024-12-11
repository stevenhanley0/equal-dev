// Ensure GSAP is loaded
if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger, SplitText);

    // Define the animation for the specified classes
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
            // Log before split
            console.log(`Before split for ${selector}:`, element.innerHTML);
            
            // Create the split
            const split = new SplitText(element, {
                type: "lines",
                linesClass: "split-line",
                // Add these settings to help with splitting
                spanWrapper: true,
                lineThreshold: 0.5
            });
            
            // Log after split
            console.log(`After split for ${selector}:`, split.lines);
            console.log(`Number of lines:`, split.lines.length);

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
                        markers: true
                    }
                }
            );
        });
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
