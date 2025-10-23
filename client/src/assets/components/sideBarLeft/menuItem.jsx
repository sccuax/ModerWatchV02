import Icon from "./icon";

//menu item component
export default function MenuItem({ className="", icon, label, isActive, onClick, ...props }) {
    return ( 
        <div 
        className={` flex flex-row items-center cursor-pointer gap-[var(--marging-M)] p-[var(--padding-s)] ${isActive ? "active" : ""} ${className}`} 
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                // Permite activar con Enter o Espacio
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick && onClick();
                }
            }}
            {...props}
        >
            <Icon name={icon} className=" w-[var(--size-icon-base)] h-[var(--size-icon-base)]"/>
            <span className="bodyText text-[var(--color-text-gray)]"> {label} </span>  
        </div>
    );
}