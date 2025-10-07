import SideBarLeft from '../sideBarLeft/sideBarLeft';
import UserDashboard from '../../../pages/Dashboard/UserDashboard';
import AdminDashboard from '../../../pages/Dashboard/AdminDashboard';
import { useState } from 'react';

// Este es tu "laboratorio" para desarrollar componentes
function ComponentSandbox({ activeComponent = 'sidebar' }) {
    const [currentPath, setCurrentPath] = useState('/dashboard');
    
    // Función de navegación para desarrollo - solo para testing
    const handleDevelopmentNavigation = (path, item) => {
        console.log('🔧 MODO DESARROLLO - Navegación simulada:', { path, item });
        setCurrentPath(path);
        
        // Aquí puedes agregar lógica adicional para simular cambios de página
        // o cualquier otra funcionalidad que necesites probar
    };

    // Diferentes vistas según el componente que estés desarrollando
    const renderComponent = () => {
        switch (activeComponent) {
            case 'sidebar':
                return (
                    <div className="flex h-screen bg-gray-100">
                        <SideBarLeft 
                            onNavigate={handleDevelopmentNavigation}
                            currentPath={currentPath}
                        />
                        <main className="flex-1 flex items-center justify-center">
                            <div className="text-center bg-white p-8 rounded-lg shadow-md">
                                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                                    🔧 Modo Desarrollo - Sidebar
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    Actualmente desarrollando el componente Sidebar
                                </p>
                                <p className="text-sm text-gray-500">
                                    Ruta actual simulada: <code className="bg-gray-100 px-2 py-1 rounded">{currentPath}</code>
                                </p>
                            </div>
                        </main>
                    </div>
                );
                
            case 'dashboard':
                return (
                    <div className="flex h-screen">
                        <SideBarLeft 
                            onNavigate={handleDevelopmentNavigation}
                            currentPath={currentPath}
                        />
                        <div className="flex-1 p-6 bg-gray-50">
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h1 className="text-2xl font-bold mb-4">Dashboard de Desarrollo</h1>
                                <p>Aquí puedes probar la integración completa sidebar + dashboard</p>
                            </div>
                        </div>
                    </div>
                );
                
            case 'components-showcase':
                return (
                    <div className="min-h-screen bg-gray-50 p-8">
                        <div className="max-w-6xl mx-auto">
                            <h1 className="text-3xl font-bold mb-8 text-center">
                                🎨 Showcase de Componentes
                            </h1>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Sidebar Preview */}
                                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <div className="p-4 bg-gray-50 border-b">
                                        <h3 className="font-semibold">Sidebar Component</h3>
                                    </div>
                                    <div className="h-96">
                                        <SideBarLeft 
                                            onNavigate={handleDevelopmentNavigation}
                                            currentPath={currentPath}
                                        />
                                    </div>
                                </div>
                                
                                {/* Aquí puedes agregar otros componentes que quieras desarrollar */}
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h3 className="font-semibold mb-4">Otros Componentes</h3>
                                    <p className="text-gray-600">
                                        Agregar aquí otros componentes que estés desarrollando
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
                
            default:
                return (
                    <div className="min-h-screen flex items-center justify-center bg-gray-100">
                        <div className="text-center">
                            <h2 className="text-xl font-bold mb-4">Modo Desarrollo Activo</h2>
                            <p>Especifica un componente válido en developmentConfig.activeComponent</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <>
            {/* Banner de modo desarrollo - para que sepas que estás en modo sandbox */}
            <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black px-4 py-2 text-sm font-medium z-50 text-center">
                🔧 MODO DESARROLLO ACTIVO - Componente: {activeComponent}
            </div>
            
            {/* Contenido principal con padding para el banner */}
            <div className="pt-10">
                {renderComponent()}
            </div>
        </>
    );
}

export default ComponentSandbox;