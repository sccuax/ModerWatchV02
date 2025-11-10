
import RowData from "./rowData";

export default function ContainerData({
    heading1,
    heading2,
    heading3,
    heading4,
    iconConf,
    justifyContainerData,
    ...props 
}) {

    const dataContent = [
        {
            data1: "Rolex Perpetual",
            data2: "FGHK20",
            data3: "clasic",

        },
        {
            data1: "Rolex Perpetual",
            data2: "FGHK20",
            data3: "clasic",
        },
        {
            data1: "Rolex Perpetual",
            data2: "FGHK20",
            data3: "clasic",
        },
        {
            data1: "Rolex Perpetual",
            data2: "FGHK20",
            data3: "clasic",
        }
    ]


    return (
        <div className="flex flex-col h-auto w-auto bg-[var(--color-bg-gray)]" {...props}>
        {/*-------------Heading-----------*/}
            <div className="flex flex-row items-center h-[51px] gap-[var(--marging-S)] 
        w-full px-[var(--marging-M)] border-b-[0.5px] border-[var(--color-border-gray)]">
                <input type="checkbox" className="w-[16px] h-[16px]"/>
                <p className="bodyText text-[var(--color-text-black)] py-[var(--marging-M)] w-[150px] text-center">{heading1}</p>
                <p className="bodyText text-[var(--color-text-black)] py-[var(--marging-M)] w-[150px] text-center">{heading2}</p>
                <p className="bodyText text-[var(--color-text-black)] py-[var(--marging-M)] w-[150px] text-center">{heading3}</p>
                <p className="bodyText text-[var(--color-text-black)] py-[var(--marging-M)] w-[150px] text-center">{heading4}</p>
            </div>
            {/*-------------Row Data-----------*/}
            {dataContent.map((data, index) => (
                <RowData 
                key={index}
                data1={data.data1}
                data2={data.data2}
                data3={data.data3}
                justifyData={justifyContainerData}
                iconName={iconConf}
                />
            ))}
        </div>
    );
}