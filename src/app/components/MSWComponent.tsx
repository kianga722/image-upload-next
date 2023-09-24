import { useEffect } from "react";

export const MSWComponent = () => {
    useEffect(() => {
        if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
            const { worker } = require('../mocks/browser')
            worker.start()
        }
    }, []);

    return null;
};

export default MSWComponent;