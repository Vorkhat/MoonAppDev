export default function Loading() {
    return (
        <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"
                 style={{
                     placeSelf: 'center',
                 }}
                 width="48" height="48">
                <g>
                    <circle strokeDasharray="150.79644737231007 52.26548245743669" r="32" strokeWidth="4"
                            stroke="var(--color-text-home)" fill="none" cy="50" cx="50">
                        <animateTransform keyTimes="0;1" values="0 50 50;360 50 50" dur="1s"
                                          repeatCount="indefinite" type="rotate"
                                          attributeName="transform"></animateTransform>
                    </circle>
                    <g></g>
                </g>
            </svg>
        </>
    );
}