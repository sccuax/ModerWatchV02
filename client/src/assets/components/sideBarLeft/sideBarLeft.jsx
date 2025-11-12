import MenuItem from "./menuItem";
import { useNavigate } from 'react-router-dom'; 
import { useState } from "react";
import { useLogOut } from '../../../hooks/logOutUser'
import logo from "../../images/logo/modernwatchlogo.png";

export default function SideBarLeft({ 
    mainBottomMenu,
    mainMenu,
    onNavigate,
    currentPath = "/"
}) {
    const [activeItem, setActiveItem] = useState(currentPath);
    const [expandedItems, setExpandedItems] = useState([]); // ✅ NUEVO: Estado para items expandidos
    const navigate = useNavigate();
    const { handleLogout } = useLogOut();

    // Configuración de los elementos del menú
    const menuItems = [
        {
            id: 'home',
            label: 'Home',
            icon: 'home',
            href: '/'
        },
        {
            id: 'products',
            label: 'Add Product',
            icon: 'product',
            href: '/products'
        },
        {
            id: 'suppliers',
            label: 'Supplier Info',
            icon: 'supplier',
            href: '/suppliers',
            hasSubmenu: true, // ✅ NUEVO
            submenuItems: [   // ✅ NUEVO
                {
                    id: 'add-supplier',
                    label: 'Add supplier',
                    icon: 'plus', // o 'plus'
                    href: '/suppliers/add'
                }
            ]
        },
        {
            id: 'inventory',
            label: 'Update Stock',
            icon: 'update',
            href: '/inventory'
        }
    ];

    const bottomMenuItems = [
        {
            id: 'help',
            label: 'Help & Information',
            icon: 'helpInfo',
            href: '/help'
        },
        {
            id: 'logout',
            label: 'Log Out',
            icon: 'logout',
            href: '',
            onClick: handleLogout
        }
    ];

    const menu = mainMenu || menuItems;
    const bottomMenu = mainBottomMenu || bottomMenuItems;

    // ✅ NUEVO: Función para manejar clicks en elementos del menú
    const handleMenuClick = (item) => {
        // Si tiene submenú, expandir/colapsar
        if (item.hasSubmenu) {
            setExpandedItems(prev => 
                prev.includes(item.id) 
                    ? prev.filter(id => id !== item.id) 
                    : [...prev, item.id]
            );
        } else {
            // Si no tiene submenú, navegar normalmente
            setActiveItem(item.href);
            navigate(item.href);
            onNavigate && onNavigate(item.href, item);
        }
    };

    // ✅ NUEVO: Función para manejar clicks en sub-items
    const handleSubmenuClick = (parentItem, subItem) => {
        setActiveItem(subItem.href);
        navigate(subItem.href);
        onNavigate && onNavigate(subItem.href, subItem);
    };

    return (
        <aside className="flex flex-col justify-between h-screen bg-[var(--color-bg-light-gray)]
            text-white w-64 shadow-lg px-[var(--marging-M)] py-[var(--marging-section-M)] border-r-[0.5px] border-[var(--color-border-gray)]">
            {/* Sección superior del menú */}
            <div className="inline-flex flex-col items-start gap-[var(--marging-section-XXL)] pt-[var(--padding-s)]">
                {/* Logo */}
                <div className="inline-flex items-center gap-[var(--marging-S)] p-[var(--padding-s)]">
                    <img className="w-[48px]" src={logo} alt="Modern Watch Logo" />
                    <h2 className="headingDisplay text-[var(--color-text-black)]">ADMIN</h2>
                </div>
                
                {/* Elementos principales del menú */}
                <div className="flex gap-[var(--marging-M)] flex-col w-full">
                    {menu.map((item) => (
                        <MenuItem
                            key={item.id}
                            label={item.label}
                            icon={item.icon}
                            isActive={activeItem === item.href}
                            hasSubmenu={item.hasSubmenu}
                            isExpanded={expandedItems.includes(item.id)}
                            submenuItems={item.submenuItems}
                            onClick={() => handleMenuClick(item)}
                            onSubmenuClick={(subItem) => handleSubmenuClick(item, subItem)}
                        />
                    ))}
                </div>
            </div>

            {/* Sección inferior del menú */}
            <div className="inline-flex flex-col border-t items-start justify-end py-0 px-[var(--padding-s)] gap-[var(--marging-M)] border-gray-700 pt-4">
                {bottomMenu.map((item) => (
                    <MenuItem
                        key={item.id}
                        label={item.label}
                        icon={item.icon}
                        isActive={activeItem === item.href}
                        onClick={item.onClick ? item.onClick : () => handleMenuClick(item)}
                    />
                ))}
            </div>
        </aside>
    );
}