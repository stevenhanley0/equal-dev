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

    headlines.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(element => {
            // Add debug class to track which elements are being processed
            element.classList.add('debug-animated');
            
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
                        start: "top 80%", // Simplified trigger point
                        toggleActions: "restart none none reverse",
                        markers: true,
                        onEnter: () => console.log(`Triggered: ${selector}`),
                        onLeaveBack: () => console.log(`Reset: ${selector}`),
                    }
                }
            );
        });
    });

    // Add a delayed refresh for any dynamic content
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 1000);
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
