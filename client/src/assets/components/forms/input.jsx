import { useState, useRef } from 'react';
import Icon from '../sideBarLeft/icon';

export default function Input({ type, label, value, name, onChange, className = "", classNameInput = "", placeHolder, ...props }) {
    const [selectedDate, setSelectedDate] = useState('');
    const dateInputRef = useRef(null);

    // Función para abrir el calendario cuando se hace clic en el ícono
    const handleIconClick = () => {
        if (dateInputRef.current) {
            dateInputRef.current.showPicker();
        }
    };

    // Input tipo date
    if (type === 'date') {
        return (
            
            <div className={`flex flex-row items-end h-auto gap-[var(--marging-M)] pt-[var(--marging-section-M)] ${className}`}>
                <label className="bodyText w-max text-[var(--color-text-black)] whitespace-nowrap" htmlFor={label}>
                    {label}
                </label>
                <div className="relative flex items-center">
                    <input 
                        ref={dateInputRef}
                        type="date"
                        id={label}
                        name={name || label}
                        value={selectedDate}
                        onChange={(e) => {
                            setSelectedDate(e.target.value)
                            if (onChange) onChange(e);
                        }}
                        className={`absolute inset-0 w-full h-full cursor-pointer opacity-0 z-10 ${classNameInput}`}
                        {...props}
                    />
                    <div 
                        onClick={handleIconClick}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <Icon 
                            name="chooseDate" 
                            className="w-6 h-6 text-[var(--color-text-purple)]" 
                        />
                        {selectedDate && (
                            <span className="bodyText text-[var(--color-text-black)]">
                                {new Date(selectedDate).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    // Input tipo submit (botón)
    if (type === 'submit') {
        return (
            <div className={`flex items-center justify-end pt-[var(--marging-section-M)] ${className}`}>
                <button 
                    type="submit"
                    className={`w-12 h-12 flex items-center justify-center cursor-pointer
                    rounded-[var(--radius-lg)] 
                    hover:opacity-90 transition-opacity ${classNameInput}`}
                    {...props}
                >
                    <Icon 
                        name="submit"  // Cambiado a ícono más apropiado
                        className="w-6 h-6 text-white" 
                    />
                </button>
            </div>
        )
    }

    // Layout normal para otros inputs
    return (
        <div className={`flex flex-col w-full h-auto gap-[var(--marging-M)] pt-[var(--marging-section-M)] ${className}`}>
            <label className="bodyText w-max text-[var(--color-text-black)]" htmlFor={label}>
                {label}
            </label>
            <input 
                required
                value={value}
                name={name || label}
                onChange={onChange}  // Agregado para controlar el input
                className={`h-[40px] text-[var(--color-text-black)] py-[10px] px-[var(--marging-section-M)]
                border-[0.5px] rounded-[var(--radius-lg)] border-[var(--color-border-gray)] text-center
                placeholder:text-[var(--color-text-gray)] placeholder:text-[14px] placeholder:font-[400] 
                placeholder:leading-5 ${classNameInput}`} 
                placeholder={placeHolder} 
                type={type}
                id={label}
                {...props}
            />
        </div>
    )
}