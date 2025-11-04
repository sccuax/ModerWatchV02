// PageHeader.jsx
import HeaderButton from "../buttons/headerButton";
import Icon from "../sideBarLeft/icon";
import Badge from "../buttons/badge";
import NotificationDropdown from "../notifications/NotificationDropdown";
import Dropdown from "../notifications/dropDown"; // nuevo dropdown (animado)

export default function PageHeader({
    userName = "Usuario",
    showWaving = true,
    buttons = [],  // recibir array de botones
    onCloseDropdown
}) {

    const getCurrentDate = () => {
        const date = new Date();
        return new Intl.DateTimeFormat('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date);
    };

    return (
        <header className="flex items-start justify-between w-full border-b-[0.5px] pb-[54px]
        px-[var(--padding-s)] pt-[var(--marging-M)] border-[var(--color-border-gray)]">
            {/* -- waving -- */}
            <div className="flex flex-col gap-[var(--marging-M)]">
                <h1 className="heading1 text-[var(--color-text-black)]">Hello, {userName}!</h1>
                {showWaving && (
                    <p className="supportingText text-[var(--color-text-gray)]">
                        Welcome back, let's do some administrative task
                    </p>
                )}
            </div>

            {/* -- buttons container -- */}
            <div className="flex flex-row gap-[var(--marging-M)]">
                {buttons.map((button) => (
                    <div key={button.id} className="relative">
                        <HeaderButton
                            onClick={button.onClick}
                            icon={button.icon}
                            isActive={button.isActive}
                        />
                        <Badge count={button.count} />

                        {/* ---------- Condicional: Mantener compatibilidad con el dropdown viejo ---------- */}
                        {button.dropdown && (
                            <>
                                {/*
                                Por defecto (si no se especifica button.dropdown.type) se usa
                                NotificationDropdown (comportamiento actual / retrocompatible).
                                Si button.dropdown.type === 'new' (u otro valor que prefieras),
                                usamos el nuevo Dropdown (dropDown.jsx).
                              */}
                                {(button.dropdown.type === undefined || button.dropdown.type === 'notification') ? (
                                    <NotificationDropdown
                                        messages={button.dropdown.messages}
                                        isOpen={button.isActive}
                                        onClose={onCloseDropdown}
                                        title={button.dropdown.title}
                                        emptyMessage={button.dropdown.emptyMessage}
                                    />
                                ) : (
                                    <Dropdown
                                        messages={button.dropdown.messages}
                                        isOpen={button.isActive}
                                        onClose={onCloseDropdown}
                                        title={button.dropdown.title}
                                        emptyMessage={button.dropdown.emptyMessage}
                                    />
                                )}
                            </>
                        )}
                    </div>
                ))}

                {/*------------Calendar--------- */}
                <div className="px-[var(--marging-S))] pointer-events-none box-shadow-button-header bg-[var(--color-white)] flex flex-row gap-[var(--marging-S)] 
                items-center justify-center rounded-tl-[var(--radius-sm)] rounded-br-[var(--radius-sm)]
                rounded-tr-[var(--radius-md)] rounded-bl-[var(--radius-md)]">
                    <span className="supportingText w-[121px] text-[var(--color-text-black)] text-center">{getCurrentDate()}</span>
                    <Icon name="calendar" className="w-[var(--size-icon-base)] h-[var(--size-icon-base)]" />
                </div>
            </div>
        </header>
    );
}
