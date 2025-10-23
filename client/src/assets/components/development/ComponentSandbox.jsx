import SideBarLeft from '../sideBarLeft/sideBarLeft';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import SideBarRight from '../sideBarRight/sideBarRight';
import MainContent from '../layout/mainContent';
import AdminDashboard  from '../../../pages/Dashboard/AdminDashboard';  
import Login from '../../../pages/auth/login'
import Forms from '../forms/forms'
import { useState } from 'react';
import ShowRequester from '../layout/showRequester';

// Este es tu "laboratorio" para desarrollar componentes
function ComponentSandbox({ activeComponent = 'sidebar' }) {
  const [currentPath, setCurrentPath] = useState('/dashboard');

  // Función de navegación para desarrollo - solo para testing
  const handleDevelopmentNavigation = (path, item) => {
    console.log('🔧 MODO DESARROLLO - Navegación simulada:', { path, item });
    setCurrentPath(path);
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
                  Ruta actual simulada:{' '}
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    {currentPath}
                  </code>
                </p>
              </div>
            </main>
            <SideBarRight className="" currentPath={currentPath} />
          </div>
        );

      case 'sidebar-right':
        return (
          <div className="flex h-screen bg-gray-100">
            <main className="flex-1 flex items-center justify-center w-full">
              <div className="text-center bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  🔧 Modo Desarrollo - Sidebar Right
                </h2>
                <p className="text-gray-600 mb-4">
                  Aquí solo mostramos el Sidebar Derecho
                </p>
              </div>
            </main>
            <SideBarRight className="" currentPath={currentPath} />
          </div>
        );

      case 'main-content':
        return (
          <div className="flex h-screen bg-gray-100">
            <main className="flex-1 flex items-center justify-center w-full">
              <MainContent>
                <ShowRequester></ShowRequester>
              </MainContent>
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

        case 'admin-dashboard':
  return (
    <div className="h-screen w-full">
      <AdminDashboard />
    </div>
  );

      case 'login':
        return (
          <div className="h-screen w-full">
                <BrowserRouter>
<Routes>
  <Route path="/" element={<Navigate to="/login" />} />
  <Route path="/login" element={<Login />} />
  <Route path="/admin-dashboard" element={<AdminDashboard />} />
</Routes>
    </BrowserRouter>
          </div>
        );

  // Here we're going to prove forms
      case 'forms':
        return (
        <div className="flex h-screen bg-gray-100">
            <main className="flex-1 flex items-center justify-center w-full">
                <MainContent showSection={false}>  {/* ← Cambia a true/false según necesites */}
                    <Forms
                      mode="create"
                      onSubmitUrl="http://localhost:3000/api/users"
                    />
                </MainContent>
            </main>
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

                {/* main content preview*/}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b">
                    <h3 className="font-semibold">Main Content</h3>
                  </div>
                  <div className="h-96 p-4">
                    <MainContent showStats={true} statsData={[{ label: 'Usuarios', value: 120 }, { label: 'Ventas', value: 75 }]}>
                      <div className="bg-white p-6 rounded-lg shadow-md w-full h-full flex items-center justify-center">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">
                          Contenido Variable
                        </h2>
                      </div>
                    </MainContent>
                  </div>
                </div>

                {/* Sidebar Right Preview */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b">
                    <h3 className="font-semibold">Sidebar Right</h3>
                  </div>
                  <div className="h-96">
                    <SideBarRight className="" currentPath={currentPath} />
                  </div>
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
      {/* Banner de modo desarrollo */}
      <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black px-4 py-2 text-sm font-medium z-50 text-center">
        🔧 MODO DESARROLLO ACTIVO - Componente: {activeComponent}
      </div>

      {/* Contenido principal con padding para el banner */}
      <div className="pt-10 w-full">{renderComponent()}</div>
    </>
  );
}

export default ComponentSandbox;
