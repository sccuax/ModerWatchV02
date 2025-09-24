import Icon from "./icon";

//menu item component
export default function MenuItem({ name, icon, isActive, onClick, ...props }) {
    return ( 
        <div 
            className={`menu-item ${isActive ? "active" : ""}`} 
            onClick={onClick}
        >
            <Icon name={icon} className="absolute inset-0" />
            <span className="supportingText">{props.label}{name}</span>  
        </div>
    );
}