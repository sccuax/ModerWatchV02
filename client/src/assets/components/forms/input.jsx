export default function Input({ type, label, className="", classNameInput="", placeHolder, ...props }){

    return(
            <div className={`w-full flex flex-col h-auto gap-[var(--marging-M)] pt-[var(--marging-section-M)] ${className}`} {...props}>
                <label className="bodyText w-max text-[var(--color-text-black)]" htmlFor={label} {...props}>{label}</label>
                <input className={`suportingText text-[var(--color-text-black)] py-[10px] px-[var(--marging-section-M)]
                border-[0.5px] rounded-[var(--radius-lg)] border-[var(--color-border-gray)] text-center ${classNameInput}`} placeholder={placeHolder} type={type}{...props}/>
            </div>
    )
}