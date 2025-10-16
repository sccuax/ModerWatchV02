import Filter from '../buttons/tertiary.jsx';
import Loop from '../sideBarLeft/icon.jsx';
import Icon from '../sideBarLeft/icon.jsx';

export function RequesterContent({tittle, dataRequester, ...props }) {
    return (
        <div className='flex flex-row gap-[var(--marging-M)]' {...props}>
            <p className='bodyText w-[80px] text-[var(--color-text-black)]'>{tittle}</p>
            <span className='microText w-[280px] text-[var(--color-text-black)]'>{dataRequester}</span>
        </div>
    );
}


export function RequesterBlock({ ...props }) {

    const infoRequester = [
        {id: 1, tittle: "Requester:", dataRequester: "Javier Molina"},
        {id: 2, tittle: "Email:", dataRequester: "Javier123@gmail.com"},
        {id: 3, tittle: "Message:", dataRequester: "Hi there, I hope you are doing well! I am messaging you in regards to my new job possition. Can you please give me acces to this tool?"}
    ];  

    return (
        <div className="flex flex-row justify-between items-end px-[var(--marging-S)]
        py-[var(--marging-M)] border-[0.5px] border-[var(--color-border-gray)] bg-[var(--color-bg-light-purple)]">
            <div className='flex flex-col items-start gap-[var(--marging-section-M)] 
            justify-start' {...props}>
                {infoRequester.map((info) => (
                    <RequesterContent 
                    key={info.id}
                    tittle={info.tittle}
                    dataRequester={info.dataRequester}
                    />
                ))}
            </div>
            <div className='flex flex-row px-[var(--marging-M)] w-[268px] gap-[var(--marging-section-S)] items-end justify-end'>
                <Icon name="verify" className="w-6 h-6 cursor-pointer" />
                <Icon name="deny" className="w-6 h-6 cursor-pointer" />
                <Icon name="pencil" className="w-6 h-6 cursor-pointer" />
                <Icon name="delete" className="w-6 h-6 cursor-pointer" />
            </div>
        </div>
    );
}





/* ------------here we have the search bar--------------- */
export function SearchBar() {

    return (
        <div className="w-full h-[32px] flex items-center bg-white
        border-[0.5px] border-[var(--color-border-gray)]
        rounded-[4px] px-[var(--marging-M)] gap-[10px] flex-row-reverse shadow-[2px_2px_8px_0_#E5E7EB_inset]">
            <input
                type="text"
                placeholder="Search for product ID, brand, categories or key word..."
                className="w-full h-full text-[var(--color-text-gray)]
                bodyText outline-none"
            />
            <Loop name="search" className="w-6 h-6 color-[var(--color-icon-gray)] opacity-50" />
        </div>
    );
}

export default function ShowRequester({onFilterClick}) {
    const buttonFilter = [{
        id: 1,
        iconName: "filter", 
        text: "Filters",
        textClass: "bodyText text-[var(--color-text-gray)]",
        showIcon: true,
        onClick: onFilterClick,
    }];

    return (
        <section className='w-full flex flex-col pt-[var(--marging-section-XL)] border-t-[0.5px]
        border-[var(--color-border-gray)] gap-[var(--marging-section-S)]'>
        <div className="flex-row w-full flex items-center py-[var(--marging-M)] 
        gap-[32px]">
            <SearchBar />
            {buttonFilter.map((button) => (
                <Filter 
                    key={button.id} 
                    iconName={button.iconName} 
                    text={button.text}
                    showIcon={button.showIcon} 
                    onClick={button.onClick} 
                    textClass={button.textClass}
                /> 
            ))}
        </div>
        <div className='w-full h-auto flex flex-col'>
            <RequesterBlock />
        </div>
        </section>
    );
}