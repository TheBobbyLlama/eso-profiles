import { useCallback, useRef, useState } from "react";

const useDelayedSpinner = () => {
	const [showSpinner, setShowSpinner] = useState(false);
	const [spinnerTimeout, setSpinnerTimeout] = useState(null);
	const spinnerTOref = useRef(spinnerTimeout);
	spinnerTOref.current = spinnerTimeout;

	const startLoadTimer = useCallback(() => {
		if (!spinnerTOref.current) {
			setShowSpinner(false);
			setSpinnerTimeout(setTimeout(setShowSpinner, 1000, true));
		}
	}, [spinnerTOref]);

	const endLoadTimer = useCallback(() => {
		if (spinnerTOref.current) {
			clearTimeout(spinnerTOref.current);
			setSpinnerTimeout(null);
			setShowSpinner(false);
		}
	}, [spinnerTOref]);

	return [ showSpinner, startLoadTimer, endLoadTimer ];
}

export default useDelayedSpinner;