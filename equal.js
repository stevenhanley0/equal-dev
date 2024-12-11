// Register plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

const headlines = [
    ".vision-headline",
    ".process-headline",
    ".platform-headline",
    ".team-headline",
    ".join-headline"
];

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
    // Once everything is loaded, create the animations
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
});
