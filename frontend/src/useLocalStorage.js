// useLocalStorage.js
import { useState, useEffect } from "react";

export const useLocalStorage = (key, firstValue = null) => {
    const initialValue = localStorage.getItem(key) || firstValue;

    const [item, setItem] = useState(initialValue);
    useEffect(() => {
        console.debug("hooks useLocalStorage useEffect", "item=", item);
        if (item === null) {
            localStorage.removeItem(key)
        } else {
            localStorage.setItem(key, item);
        }
    }, [key, item]);
    return [item, setItem];
};
