import MenuItem from "./menuItem";
import { useState } from "react";

// SidebarLeft con mejor gestión de estado y navegación
export default function SideBarLeft({ 
    onNavigate,     // Función callback para manejar navegación
    currentPath = "/" // Ruta actual para determinar qué item está activo
}) {
    // Estado local para manejar qué elemento del menú está activo
    const [activeItem, setActiveItem] = useState(currentPath);

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
            href: '/logout'
        }
    ];

    // Función para manejar clicks en elementos del menú
    const handleMenuClick = (item) => {
        setActiveItem(item.href);
        onNavigate && onNavigate(item.href, item);
    };

    return (
        <aside className="flex flex-col justify-between h-screen bg-gray-900 text-white p-4 w-64 shadow-lg">
            {/* Sección superior del menú */}
            <div className="space-y-2">
                {/* Logo o título de la aplicación (opcional) */}
                <div className="mb-8 px-3">
                    <h2 className="text-xl font-bold text-white">Modern Watch</h2>
                </div>
                
                {/* Elementos principales del menú */}
                {menuItems.map((item) => (
                    <MenuItem
                        key={item.id}
                        label={item.label}
                        icon={item.icon}
                        isActive={activeItem === item.href}
                        onClick={() => handleMenuClick(item)}
                    />
                ))}
            </div>

            {/* Sección inferior del menú */}
            <div className="space-y-2 border-t border-gray-700 pt-4">
                {bottomMenuItems.map((item) => (
                    <MenuItem
                        key={item.id}
                        label={item.label}
                        icon={item.icon}
                        isActive={activeItem === item.href}
                        onClick={() => handleMenuClick(item)}
                    />
                ))}
            </div>
        </aside>
    );
}