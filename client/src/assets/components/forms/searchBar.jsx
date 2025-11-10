import Loop from '../sideBarLeft/icon'

export default function SearchBar({ search, setSearch, placeholder }) {
    return (
        <div
            className="w-full h-[32px] flex items-center bg-white
        border-[0.5px] border-[var(--color-border-gray)]
        rounded-[4px] px-[var(--marging-M)] gap-[10px] flex-row-reverse shadow-[inset_2px_2px_6px_rgba(0,0,0,0.1)]"
        >
            <input
                type="text"
                placeholder={placeholder}
                className="w-full h-full text-[var(--color-text-gray)] bodyText outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <Loop
                name="search"
                className="w-6 h-6 color-[var(--color-icon-gray)] opacity-50"
            />
        </div>
    );
}