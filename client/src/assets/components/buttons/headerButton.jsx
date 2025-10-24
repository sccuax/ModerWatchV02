import Icon from '../sideBarLeft/icon.jsx';

export default function HeaderButton({ icon, onClick, ...props }) {
    const styles = {
        borderTop: "0.3px solid var(--color-border-gray, #9CA3AF)",
        borderLeft: "0.3px solid var(--color-border-gray, #9CA3AF)",
        borderRight: " 0.5px solid var(--color-border-gray, #9CA3AF)",
        borderBottom: "0.5px solid var(--color-border-gray, #9CA3AF)",
    };

    return (
    <button onClick={onClick}
    className={`box-shadow-button-header w-[48.37px] h-[40px] rounded-tl-[var(--radius-sm)] rounded-br-[var(--radius-sm)]
    rounded-tr-[var(--radius-md)] rounded-bl-[var(--radius-md)] bg-[var(--color-white)]
    px-[var(--marging-S)] py-[var(--padding-s)] flex items-center justify-center 
    ${styles}`}>
            {props.children}

            <Icon name={icon} className="absolute top-1/2 left-1/2 -translate-x-1/2 
            -translate-y-1/2 w-[var(--size-icon-base)] h-[var(--size-icon-base)]"/>
        </button>
    );
}