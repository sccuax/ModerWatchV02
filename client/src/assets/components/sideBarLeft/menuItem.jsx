import Icon from "./icon";

//menu item component
export default function MenuItem({ className="", icon, label, isActive, onClick, ...props }) {
    return ( 
        <div 
        className={`w-36 flex items-center gap-padding-s ${isActive ? "active" : ""} ${className}`} 
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
            <Icon name={icon} className="absolute inset-0"/>
            <span className="supportingText"> {label} </span>  
        </div>
    );
}