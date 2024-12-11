// Wait for the entire page to load
window.addEventListener('load', () => {
    // Register plugins
    gsap.registerPlugin(ScrollTrigger, SplitText);

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
                        markers: true,
                        invalidateOnRefresh: true,
                        // Recalculate on scroll
                        onUpdate: self => {
                            self.refresh();
                        }
                    }
                }
            );

            // Create a ResizeObserver to watch for any size changes
            const observer = new ResizeObserver(() => {
                ScrollTrigger.refresh();
            });

            // Observe both the element and its parent
            observer.observe(element);
            if (element.parentElement) {
                observer.observe(element.parentElement);
            }
        });
    });

    // Add window resize listener
    window.addEventListener('resize', () => {
        ScrollTrigger.refresh();
    });
});
