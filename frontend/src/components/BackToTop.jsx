import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react"; // you can use any icon

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when user scrolls down 300px
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    // Scroll to top smoothly
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 p-3 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-all duration-300 z-50"
                >
                    <ArrowUp size={24} />
                </button>
            )}
        </>
    );
};

export default BackToTop;
