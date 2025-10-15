export default function Badge({ count, ...props }) {
    if (!count || count === 0) return null;

    return (
        <span className="microText absolute -top-2 -left-2 
    bg-[#B91C1C] text-[var(--color-text-white)] px-[var(--padding-s)] w-[16px]
    h-[16px] rounded-full flex items-center justify-center"
        
        {...props}>
            {count > 99 ? '99+' : count}
        </span>
    );     
}    