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

            // Handle nested spans using SplitText if available
            if (typeof SplitText !== "undefined") {
                const split = new SplitText(element, { type: "lines" });

                gsap.fromTo(
                    split.lines,
                    {
                        opacity: 0,
                        y: "100%"
                    },
                    {
                        opacity: 1,
                        y: "0%",
                        stagger: 0.1,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: element,
                            start: "top 50%", // Trigger later when element is deeper in viewport
                            toggleActions: "play none none none"
                        },
                        onComplete: () => split.revert() // Revert SplitText after animation
                    }
                );
            } else {
                console.warn("SplitText plugin not available. Skipping nested span handling.");

                gsap.fromTo(
                    element,
                    {
                        opacity: 0,
                        y: "100%"
                    },
                    {
                        opacity: 1,
                        y: "0%",
                        stagger: 0.1,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: element,
                            start: "top 85%", // Trigger later when element is deeper in viewport
                            toggleActions: "play none none none"
                        }
                    }
                );
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
