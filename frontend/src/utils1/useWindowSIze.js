import { useEffect, useState } from "react";

//custom hook to move the ball of the screen i.e. orb.js only on the active part of screen 
export const useWindowSize = () => {
    const [size, setSize] = useState([0, 0]);

    useEffect(() => {
        const updateSize = () => {
            setSize([window.innerWidth, window.innerHeight]);
        };

        window.addEventListener('resize', updateSize);
        updateSize(); // Call it initially to set the size on mount

        return () => window.removeEventListener('resize', updateSize);
    }, []);

    return {
        width: size[0],  
        height: size[1], 
    };
};