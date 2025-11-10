export const developmentConfig = {
    // Esta bandera te permite activar/desactivar el modo sandbox fácilmente
    enableComponentSandbox: false, // Cambia a false cuando no necesites desarrollar componentes
    
    // Aquí puedes especificar qué componente quieres ver en desarrollo
    activeComponent: 'user-dashboard', // Opciones: 'sidebar', 'dashboard', 'none', etc.
    
    // Mock data para desarrollo
    mockUser: {
        id: 1,
        email: 'developer@test.com',
        role: 'admin',
        name: 'Developer Mode'
    }
};