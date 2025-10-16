import Cancellations from '../../Images/stats/cancellations.png';
import OrderImage from '../../Images/stats/orders.png';
import StaffImage from '../../Images/stats/staff.png';

const imageStats = {
    cancellations: Cancellations,
    orders: OrderImage,
    staff: StaffImage,
};

export function StatCard({ type, className, text, data, colorClass, ...props }) {
    const imageSrc = imageStats[type];

    return (
        <div
            className={`w-[177px] h-[127px] flex items-center gap-[var(--marging-M)]
            justify-start ${className || ''}`}
            {...props}
        >
            {imageSrc && (
                <img src={imageSrc} alt={`${type}`} className="w-16 h-[66.13px]" />
            )}
            <div className='flex flex-col w-auto h-full gap-[var(--marging-S)] justify-center'>
                <p className='heading2 text-[var(--color-text-black)]'>{text}</p>
                <p className={`leading-[23px] font-black text-[20px] tracking-[1px] ${colorClass}`}>
                    {data}
                </p>
            </div>
        </div>
    );
}

export default function StatsSection({ statsData, className, ...props }) {
    const defaultStats = [
        { 
            type: 'staff', 
            text: 'Staff',
            data: '8',
            colorClass: 'text-[var(--color-text-purple)]'
        },
        { 
            type: 'orders', 
            text: 'Orders',
            data: '202',
            colorClass: 'text-[var(--color-text-stock)]'
        },
        { 
            type: 'cancellations',
            text: 'Cancel',
            data: '152',
            colorClass: 'text-[var(--color-text-no-stock)]',
            className: 'justify-end'
        }
    ];

    const stats = statsData || defaultStats;

    return (
        <section
            className={`w-full h-[127px] 
            rounded-[var(--radius-md)] box-shadow-section p-[var(--padding-m)] 
            flex items-center gap-[var(--marging-L)] justify-between ${className || ''}`}
            {...props}
        >
            {stats.map((stat, index) => (
                <StatCard
                    key={index}
                    type={stat.type}
                    text={stat.text}
                    data={stat.data}
                    colorClass={stat.colorClass}
                    className={stat.className}
                />
            ))}
        </section>
    );
}