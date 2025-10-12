import PageHeader from './PageHeader';
import StatsSection from './StatsSection';


export default function MainContent({ 
    showStats = false,
    statsData = [],
    children  // ← Aquí va la parte variable (table, form, etc)
}) {
    return (
    <main className="flex flex-col w-[749px] h-full gap-[var(--marging-section-S)] px-[var(--marging-M)]
    pt-[var(--marging-section-M)]">
            <PageHeader userName="Jonathan" />
            
            {showStats && <StatsSection data={statsData} />}
            
            <div className="content-body">
                {children}  {/* ← Aquí cambias table o form según la página */}
            </div>
        </main>
    );
}