import Icon from '../sideBarLeft/icon'

export default function RowData({ data1, data2, data3, iconName, justifyData, ...props }) {



    const dataStyle = "text-[var(--color-text-gray)] supportingText";

    return (
        <div className="flex flex-row items-center h-[51px] gap-[var(--marging-S)] 
        w-full px-[var(--marging-M)] border-b-[0.5px] border-[var(--color-border-gray)]" {...props}>
            <input type="checkbox" className="w-[16px] h-[16px]"/>
            <div className={`flex items-center w-[150px] ${justifyData}`}> <span className={dataStyle} >{data1}</span> </div>
            <div className={`flex items-center w-[150px] ${justifyData}`}> <span className={dataStyle} >{data2}</span> </div>
            <div className={`flex items-center w-[150px] ${justifyData}`}> <span className={dataStyle} >{data3}</span> </div>
            <div className="flex flex-row gap-[var(--marging-M)] items-center justify-center w-[150px]">
    {iconName && iconName.map((icon) => (
        <button key={icon.id}>
            <Icon 
                name={icon.IconName.toLowerCase()} 
                className={`w-[var(--size-icon-base)] h-[var(--size-icon-base)]`}
            />
        </button>
    ))}
</div>
        </div>
    );
}   