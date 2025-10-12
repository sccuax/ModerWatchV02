import HeaderButton from "../buttons/headerButton";

export default function PageHeader({ userName = "Usuario" }) {

    const iconButton =[
            {
        id: 'messages',
        icon: 'message',
    },
        {
        id: 'notification',
        icon: 'bell',           // Nota: ahora usamos strings, no componentes
    }

]

    return (
        <header className="flex items-start justify-between w-full border-b pb-[54px]
        px-[var(--padding-s)] pt-[var(--marging-M)]">
            {/*     -- waving --    */}
            <div className="flex flex-col gap-[var(--marging-M)]">
                <h1 className="heading1 text-[var(--color-text-black)]">Hello, {userName}!</h1>
                <p className="supportingText text-[var(--color-text-gray)]">Welcome back, let's do some administrative task</p>
            </div>
            {/*     -- buttons container --    */}
            <div className="flex flex-row gap-[var(--marging-M)]">
                {iconButton.map((button) => (
                    <HeaderButton 
                    key={button.id} 
                    icon={button.icon} />
                ))}
            </div>
        </header>
    );
}