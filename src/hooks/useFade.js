import { useEffect, useState } from "react";

const useFade = (ref) => {
	const [fadeOut, setFadeOut] = useState(false); // Debounce protection

	useEffect(() => {
		if (ref?.current) {
			ref.current.className = ref.current.className.replace(/ fade-(in|out)\b/g, "") + " fade-in";
		}
	}, [ref?.current]);

	return (func, ...args) => {
		setFadeOut(true);

		if (!fadeOut) {
			if (ref?.current) {
				ref.current.className += " fade-out";
			}

			if (func) {
				setTimeout((...args) => {
					func(...args);

					// Reset component if it is being reused
					if (ref?.current) {
						ref.current.className = ref.current.className.replace(/ fade-(in|out)/g, "") + " fade-in";
						setFadeOut(false);
					}
				}, 250, ...args);
			}
		}
	}
}

export default useFade;