export default function ButtonMain({variant = 'primary', onClick, text, ...props }) {
    const baseStyles = {
        borderRadius: 'var(--radius)',
        padding: 'var(--marging-S) var(--marging-section-S)',
        width: 'auto',
        height: 'auto'
    };

    const variantStyles = {
        primary: {
            backgroundColor: 'var(--color-bg-purple)',
            color: 'var(--color-text-white)',
        },
        secondary: {
            backgroundColor: 'var(--color-bg-white)',
            color: 'var(--color-text-black)',
        }
    };

    return (
        <button
            style={{...baseStyles, ...variantStyles[variant]}}
            onClick={onClick}
            {...props}
        >
            <span className="supportingText">{props.children} {text} </span>
        </button>
    );
}