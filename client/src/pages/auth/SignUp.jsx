import { useState } from 'react';
import SideBarLeft from '../../assets/components/sideBarLeft/sideBarLeft';
import MainContent from '../../assets/components/layout/mainContent';
import Forms from '../../assets/components/forms/forms';

export default function SignUp() {
    const [notifications, setNotifications] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(null);  // ← CAMBIO: null en vez de boolean

    const handleNotification = (notification) => {
        const newNotification = {
            ...notification,
            timestamp: new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }),
            id: Date.now() + Math.random()
        };

        setNotifications(prev => [newNotification, ...prev]);
    };

    const toggleDropdown = (dropdownId) => {  // ← CAMBIO: recibe ID
        setOpenDropdown(openDropdown === dropdownId ? null : dropdownId);
    };

    // ← CAMBIO: Configuración de botones
    const buttonsConfig = [
        {
            id: "info",
            icon: "helpInfo",
            count: notifications.length,
            onClick: () => toggleDropdown('info'),
            isActive: openDropdown === 'info',
            dropdown: {
                messages: notifications,
                title: "Form Notifications",
                emptyMessage: "No form errors or success messages"
            }
        }
    ];

    return (
        <div className='w-screen h-screen flex flex-row gap-[var(--marging-section-XXL)] bg-[var(--color-bg-white)]'>
            <SideBarLeft
                mainMenu={[
                    {
                        id: 'help',
                        label: 'Log in',
                        icon: 'login',
                        href: '/login'
                    },
                    {
                        id: 'contact',
                        label: 'contact',
                        icon: 'contact'
                    }
                ]}

                mainBottomMenu={[
                    {
                        id: 'help',
                        label: 'Help & Information',
                        icon: 'helpInfo',
                        href: '/help'
                    },
                    {
                        id: 'tutorial',
                        label: 'tutorial',
                        icon: 'tutorial',
                        href: ''
                    },

                ]}
            />
            <MainContent
                showSection={false}
                userName='Welcome to MW'
                buttons={buttonsConfig}  // ← CAMBIO: pasar buttonsConfig
                onCloseDropdown={() => setOpenDropdown(null)}
            >
                <Forms onNotification={handleNotification}
                    onSubmitUrl={"http://localhost:3000/api/users"}
                    mode='create' />
            </MainContent>
        </div>
    );
}