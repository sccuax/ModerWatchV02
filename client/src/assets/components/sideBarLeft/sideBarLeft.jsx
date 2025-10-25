import MenuItem from "./menuItem";
import { useNavigate } from 'react-router-dom'; 
import { useState } from "react";
import { useLogOut } from '../../../hooks/logOutUser'
import logo from "../../images/logo/modernwatchlogo.png";

// SidebarLeft con mejor gestión de estado y navegación
export default function SideBarLeft({ 
    mainBottomMenu,
    mainMenu,
    onNavigate,     // Función callback para manejar navegación
    currentPath = "/" // Ruta actual para determinar qué item está activo
}) {
    // Estado local para manejar qué elemento del menú está activo
    const [activeItem, setActiveItem] = useState(currentPath);
    const navigate = useNavigate();
    const { handleLogout } = useLogOut();

    // Configuración de los elementos del menú
    // Esta estructura te permite agregar o quitar elementos fácilmente
    const menuItems = [
        {
            id: 'home',
            label: 'Home',
            icon: 'home',           // Nota: ahora usamos strings, no componentes
            href: '/'
        },
        {
            id: 'products',
            label: 'Add Product',
            icon: 'product',        // El nombre debe coincidir con el diccionario en Icon
            href: '/products'
        },
        {
            id: 'suppliers',
            label: 'Supplier Info',
            icon: 'supplier',
            href: '/suppliers'
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
    // Función para manejar clicks en elementos del menú
    const handleMenuClick = (item) => {
        setActiveItem(item.href);
        navigate(item.href);
        onNavigate && onNavigate(item.href, item);
    };

    return (
        <aside className="flex flex-col justify-between h-screen bg-[var(--color-bg-light-gray)]
            text-white w-64 shadow-lg px-[var(--marging-M)] py-[var(--marging-section-M)] border-r-[0.5px] border-[var(--color-border-gray)]">
            {/* Sección superior del menú */}
            <div className="inline-flex flex-col items-start gap-[var(--marging-section-XXL)] pt-[var(--padding-s)]">
                {/* Logo o título de la aplicación (opcional) */}
                <div className="inline-flex items-center gap-[var(--marging-S)] p-[var(--padding-s)]">
                    <img className="w-[71px]" src={logo} alt="Modern Watch Logo" />
                    <h2 className="headingDisplay text-[var(--color-text-black)]">ADMIN</h2>
                </div>
                
                {/* Elementos principales del menú */}
                <div className="flex gap-[var(--marging-M)] flex-col">
                {menu.map((item) => (
                    <MenuItem
                        key={item.id}
                        label={item.label}
                        icon={item.icon}
                        isActive={activeItem === item.href}
                        href={item.href}
                        onClick={() => handleMenuClick(item)}
                    />
                ))}</div>
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