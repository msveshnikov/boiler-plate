import { useEffect } from 'react';

export function Landing() {
    useEffect(() => {
        fetch('/landing.html')
            .then((response) => response.text())
            .then((html) => {
                const container = document.getElementById('landing-container');
                container.innerHTML = html;
            });
    }, []);

    return <div id="landing-container"></div>;
}
