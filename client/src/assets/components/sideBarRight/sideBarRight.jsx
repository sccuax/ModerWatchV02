import React from "react";
import TertiaryButton from "../buttons/tertiary.jsx"; 
import ProfileStatus from "./profileStatus.jsx"; 

export default function SideBarRight({ className = "",  


    }) 
{ 

    const editButton = [{ 
        id: 1, 
        iconName: "", 
        text: "Edit",
        showIcon: false,
        onClick: () => { console.log("Edit profile clicked"); },
    }];
    

    return (
        <aside className={`w-[300px] bg-[var(--color-bg-light-gray)] 
                shadow-[ -2px_0_8px_rgba(0,0,0,0.05)] p-6 flex flex-col pt-[var(--marging-section-XL)] 
                px-0 pb-[50px] border-l-[0.5px] border-[var(--color-border-gray)] ${className}`} > 

    <div className="relative flex flex-col items-center h-[206px] border-b-[0.5px]
        border-[var(--color-border-gray)] w-full">
        {editButton.map((button) => (
            <TertiaryButton 
                key={button.id} 
                iconName={button.iconName} 
                text={button.text} 
                showIcon={button.showIcon} 
                onClick={button.onClick} 
                style={{ marginBottom: '16px' }} 
                className="absolute top-0 right-3"
            />
        ))}
    </div>
                
{/* Mostrar estado actual */} 
<div className="mb-4 font-bold text-[var(--color-text-dark)]"> 

    
{/* Ejemplo de componente de estado */} 
<div className="flex items-center gap-3 mb-4"> 
    <ProfileStatus status="Active" size={10} /> 
    <span className="text-[var(--color-text-gray)] font-medium">Active</span> 
    </div> 
    
<div className="flex items-center gap-3 mb-4"> 
    <ProfileStatus status="offline" size={10} /> 
    <span className="text-[var(--color-text-gray)] font-medium"> Disconnected </span> 
    </div> 
    
<div className="flex items-center gap-3"> 
    <ProfileStatus status="away" size={10} /> 
    <span className="text-[var(--color-text-gray)] font-medium"> Far from desk </span> 
</div>

    </div>
</aside>
    );

}