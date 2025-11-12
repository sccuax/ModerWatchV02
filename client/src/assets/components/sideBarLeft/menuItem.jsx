import Icon from "./icon";

export default function MenuItem({
    className = "",
    icon,
    label,
    isActive,
    onClick,
    hasSubmenu = false,      // ✅ NUEVO
    isExpanded = false,      // ✅ NUEVO
    submenuItems = [],       // ✅ NUEVO
    onSubmenuClick,
    ...props
}) {
    return (
        <div className={`transition-all duration-200 flex flex-col gap-[var(--marging-M)]
                ${isActive
                ? "bg-[var(--color-bg-gray)]"
                : "hover:bg-[var(--color-bg-gray)] hover:bg-opacity-50"
            }
                ${className}`}>
            <div
                className={`
                flex flex-row items-center cursor-pointer 
                gap-[var(--marging-M)] p-[var(--padding-s)] 
                `}
                onClick={onClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onClick && onClick();
                    }
                }}
                {...props}
                >
                <Icon
                    name={icon}
                    className={`
                    w-[var(--size-icon-base)] h-[var(--size-icon-base)]
                    ${isActive
                            ? "text-[var(--color-text-black)]"
                            : "text-[var(--color-text-gray)]"
                        }
                `}
                />
                <span className={`
                bodyText
                ${isActive
                        ? "text-[var(--color-text-gray)]"
                        : "text-[var(--color-text-gray)]"
                    }
                `}>
                    {label}
                </span>

                {/* ✅ NUEVO: Flecha indicadora si tiene submenú */}
                {hasSubmenu && (
                    <Icon
                        name={isExpanded ? "downArrow" : "rightArrow"}
                        className="w-4 h-4 text-gray-600 transition-transform duration-200"
                    />
                )}
            </div>

            {/* ✅ NUEVO: Submenú desplegable */}
            {hasSubmenu && isExpanded && (
                <>
                    {submenuItems.map((subItem) => (
                        <div
                            key={subItem.id}
                            className="
                                flex flex-row items-center justify-center cursor-pointer
                                gap-[var(--marging-M)] p-[var(--padding-s)]
                                rounded-lg
                                transition-all duration-200
                            "
                            onClick={() => onSubmenuClick && onSubmenuClick(subItem)}
                            role="button"
                            tabIndex={0}
                        >
                            <Icon
                                name={subItem.icon}
                                className="w-[var(--size-icon-sm)] h-[var(--size-icon-sm)] text-gray-600"
                            />
                            <span className={`supportingText text-[var(--color-text-gray)]
                            ${isActive
                                    ? "text-[var(--color-text-purple)]"
                                    : "hover:text-[var(--color-text-purple)]"
                                }
                ${className}
                            `}>
                                {subItem.label}
                            </span>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}