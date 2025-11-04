import Icon from '../sideBarLeft/icon';

export default function NotificationDropdown({ 
    messages, 
    onClose, 
    isOpen,
    title = "Notifications",  // ← Título personalizable
    emptyMessage = "No notifications"  // ← Mensaje vacío personalizable
}) {
    if (!isOpen) return null;
    
    return (
        <div className="absolute top-12 right-0 w-[400px] h-[300px] flex flex-col gap-[var(--marging-section-S)] bg-[var(--color-white)] border border-[var(--color-border-gray)] rounded-[var(--radius-lg)] shadow-xl z-50">
            {/* Header */}
            <div className="flex h-[48px] items-center justify-between p-[var(--marging-M)] border-b border-[var(--color-border-gray)]">
                <h3 className="bodyText text-[var(--color-text-black)]">{title}</h3>
                <button 
                    onClick={onClose} 
                    className="text-[var(--color-text-gray)] hover:text-[var(--color-text-black)] transition-colors"
                >
                    <Icon name="close" className="w-[var(--size-icon-base)] h-[var(--size-icon-base)]"/>
                </button>
            </div>
            
            {/* Messages List */}
            <div className="max-h-96 gap-[var(--marging-M)] flex flex-col overflow-y-auto">
                {messages.length === 0 ? (
                    <div className="p-[var(--marging-section-M)] text-center text-[var(--color-text-gray)]">
                        <p className="supportingText">{emptyMessage}</p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div 
                            key={msg.id || index} 
                            className={`p-[var(--marging-M)] flex gap-[var(--marging-S)] ${
                                msg.type === 'success' 
                                    ? 'bg-[var(--color-bg-light-green)]' 
                                    : msg.type === 'error'
                                    ? 'bg-red-50'
                                    : msg.type === 'info'
                                    ? 'bg-blue-50'
                                    : 'bg-gray-50'
                            }`}
                        >
                            <Icon 
                                name={
                                    msg.type === 'success' ? 'verify' : 
                                    msg.type === 'error' ? 'warning' : 
                                    msg.type === 'info' ? 'helpInfo' :
                                    msg.icon || 'message'  // ← Permite icono personalizado
                                } 
                                className={`w-[var(--size-icon-base)] h-[var(--size-icon-base)] flex-shrink-0 ${
                                    msg.type === 'success' 
                                        ? 'text-[var(--color-icon-success)]' 
                                        : msg.type === 'error'
                                        ? 'text-[var(--color-text-no-stock)]'
                                        : msg.type === 'info'
                                        ? 'text-blue-600'
                                        : 'text-[var(--color-text-gray)]'
                                }`}
                            />
                            <div className="flex-1">
                                <p className={`bodyText font-medium ${
                                    msg.type === 'success' 
                                        ? 'text-green-900' 
                                        : msg.type === 'error'
                                        ? 'text-red-900'
                                        : msg.type === 'info'
                                        ? 'text-blue-900'
                                        : 'text-[var(--color-text-black)]'
                                }`}>
                                    {msg.title}
                                </p>
                                <p className={`supportingText mt-1 ${
                                    msg.type === 'success' 
                                        ? 'text-green-700' 
                                        : msg.type === 'error'
                                        ? 'text-red-700'
                                        : msg.type === 'info'
                                        ? 'text-blue-700'
                                        : 'text-[var(--color-text-gray)]'
                                }`}>
                                    {msg.message}
                                </p>
                                <p className="supportingText text-[var(--color-text-gray)] mt-1">
                                    {msg.timestamp}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}