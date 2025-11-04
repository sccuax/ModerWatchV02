// src/components/Dropdown.jsx
import { motion, AnimatePresence } from "framer-motion";

export default function Dropdown({ isOpen, onClose, title, messages = [], emptyMessage }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="absolute top-12 right-0 bg-white shadow-xl rounded-xl w-72 z-50 border border-gray-200"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center py-[var(--marging-S)] px-[var(--marging-M)] border-b border-gray-200">
                        <h4 className="bodyText text-[var(--color-text-black)]">{title}</h4>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            ✕
                        </button>
                    </div>

                    {/* Contenido */}
                    <div className="max-h-64 flex flex-col gap-[var(--marging-section-S)] mt-[var(--marging-section-S)] overflow-y-auto">
                        {messages.length > 0 ? (
                            messages.map((msg) => (
                                <div
                                    key={msg.id || Math.random()}
                                    className="p-[var(--marging-M)] flex flex-col gap-[var(--marging-M)] hover:bg-gray-50 bg-[var(--color-bg-light-gray)]"
                                >
                                    {/* 👤 NOMBRE DEL USUARIO */}
    <p className="supportingText pb-[var(--marging-M)] border-b-[0.5px] border-[var(--color-border-light-gray)] text-[var(--color-text-gray)]">
        {msg.title || msg.name || "Usuario desconocido"}
    </p>
                                    {/* 💬 CONTENIDO DEL MENSAJE */}
    <p className="supportingText text-[var(--color-text-gray)]">
        {msg.message || msg.text || "Sin contenido"}
    </p>

                                    {/* Subtexto opcional (tipo, hora, etc.) */}
                                    {(msg.timestamp || msg.type || msg.email) && (
                                        <span className="text-xs text-gray-400 block mt-1">
                                            {msg.timestamp
                                                ? msg.timestamp
                                                : msg.type
                                                    ? `Tipo: ${msg.type}`
                                                    : msg.email
                                                        ? msg.email
                                                        : ""}
                                        </span>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="p-4 text-gray-400 text-sm text-center">{emptyMessage}</p>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
