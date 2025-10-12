import React from "react";
import TertiaryButton from "../buttons/tertiary.jsx";
import ButtonMain from "../buttons/primary.jsx";
import ProfileStatus from "./profileStatus.jsx"; 
import coverImg from '../../images/general/cover.png';
import profilePicture from '../../images/rightBar/Generic avatar.png';


export default function SideBarRight({ className = "",  


    }) 
{ 

    const primaryButton= [
        {
            id: 1,
            variant: "primary", 
            text: "Profile",
            className: "shadow-buttons-main",
            onClick: () => { console.log("Follow clicked"); },
        },
    {
        id: 2,
        variant: "secondary", 
        text: "Orders",
        className: "shadows-button-secondary",
        onClick: () => { console.log("Settings clicked"); },
    }
    ]

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
                px-0 pb-[50px] border-l-[0.5px] border-[var(--color-border-gray)]
                gap-[148px] ${className}`} > 
{/* -----------------------cover ad profile picture------------------------ */} 
    <div
        className="relative flex flex-col items-center h-[206px] border-b-[0.5px]
        border-[var(--color-border-gray)] bg-size-[200px] bg-no-repeat bg-top"
        style={{ backgroundImage: `url(${coverImg})` }}
    >
{/* -----------------------edit button------------------------ */} 
        {editButton.map((button) => (
            <TertiaryButton 
                key={button.id} 
                iconName={button.iconName} 
                text={button.text} 
                showIcon={button.showIcon} 
                onClick={button.onClick} 
                style={{ marginBottom: '16px' }} 
                className="absolute top-0 right-[51px]"
            />
        ))}

        <div className=" flex absolute w-[151px] h-[151px]
        bottom-[-118px] align-center justify-center">
            <img
                src={profilePicture}
                alt="Profile"
                className="relative w-[120px] h-[120px] rounded-full object-cover"
            />
        <button
            onClick={() => console.log("Edit clicked")}
            className="w-[40px] h-[40px] rounded-full border border-[var(--color-border-gray)] bg-white transition-all 
    flex items-center justify-center p-[var(--marging-S)] absolute bottom-0 -right-4 shadow-shadow-gray
    shadow-[1px_1px_4px_0]"
        >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M1.50586 11.1616V14.495L4.83919 14.495L13.8964 5.43776L13.8971 5.43705C14.2267 5.10751 14.3915 4.94268 14.4533 4.75254C14.5077 4.58517 14.5077 4.40488 14.4533 4.23751C14.3915 4.04724 14.2264 3.88215 13.8964 3.55214L12.4465 2.10231C12.1179 1.77371 11.9533 1.60907 11.7634 1.54738C11.5961 1.493 11.4158 1.493 11.2484 1.54738C11.0584 1.60911 10.8936 1.77394 10.5645 2.10301L10.5631 2.10443L1.50586 11.1616Z" stroke="#111827" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
        </button>
        </div>
    </div>
                
{/* ----------------info profile container and profile status ------------------*/} 
<div className="flex flex-col items-start justify-center w-full gap-[48px]"> 
<div className="flex flex-col items-center justify-center gap-[5px] w-full">
    <div className="flex items-center gap-2 flex-row w-full justify-center">
        <p className="bodyText text-[var(--color-text-black)]">JONATHAN VELEZ</p>
        {/* Ejemplo de componente de estado */} 
        <div className="flex items-center gap-3"> 
            <ProfileStatus status="Active" size={10} /> 
        </div> 
    </div>
    <p className="supportingText text-[var(--color-text-gray)]">Emial@gmail.com</p>
</div>

        <div className="flex w-full flex-row-reverse items-center justify-center gap-[var(--marging-section-S)]">
        {primaryButton.map((button) => (
            <ButtonMain 
                key={button.id} 
                variant={button.variant}
                text={button.text}
                className={button.className || ""}
            />
        ))}
        </div>
    </div>
</aside>
    );

}