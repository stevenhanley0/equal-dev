// Ensure GSAP is loaded
if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

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
            console.log("Animating element:", element);

            // Use SplitText for line splitting
            if (typeof SplitText !== "undefined") {
                const split = new SplitText(element, { type: "lines" });
                const lines = split.lines; // Get the split lines

                // Animate the lines
                gsap.fromTo(
                    lines,
                    { opacity: 0, y: "100%" },
                    {
                        opacity: 1,
                        y: "0%",
                        stagger: 0.1,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: element,
                            start: "top 50%",
                            toggleActions: "play none none none"
                        }
                    }
                );

                // Revert SplitText after the animation
                ScrollTrigger.create({
                    trigger: element,
                    start: "top 85%",
                    onLeave: () => split.revert()
                });
            } else {
                console.warn("SplitText plugin not available. Animation skipped for:", element);
            }
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
