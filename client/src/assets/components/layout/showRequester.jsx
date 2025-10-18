import { useState, useEffect, useCallback } from "react";
import Filter from "../buttons/tertiary.jsx";
import Loop from "../sideBarLeft/icon.jsx";
import Icon from "../sideBarLeft/icon.jsx";

/* -------- subcommponent row -------- */
export function RequesterContent({ tittle, dataRequester, ...props }) {
    return (
        <div className="flex flex-row gap-[var(--marging-M)]" {...props}>
            <p className="bodyText w-[80px] text-[var(--color-text-black)]">
                {tittle}
            </p>
            <span className="microText w-[280px] text-[var(--color-text-black)]">
                {dataRequester}
            </span>
        </div>
    );
}

/* -------- table that shows all request to get access -------- */
export function RequesterBlock({ requesters = [], onDelete, ...props }) {
    if (!requesters.length)
        return (
            <p className="bodyText text-[var(--color-text-gray)] px-[var(--marging-M)]">
                No se encontraron usuarios.
            </p>
        );

    return (
        <div className="">
            {requesters.map((r) => (
                <div
                    key={r._id ?? r.id}
                    className="flex flex-row justify-between items-end px-[var(--marging-S)]
            py-[var(--marging-M)] border-[0.5px] border-[var(--color-border-gray)] 
            bg-[var(--color-bg-light-purple)]"
                >
                    <div
                        className="flex flex-col items-start gap-[var(--marging-section-M)] justify-start"
                        {...props}
                    >
                        <RequesterContent
                            tittle="Requester:"
                            dataRequester={`${r.name ?? ""} ${r.surname ?? ""}`.trim()}
                        />
                        <RequesterContent tittle="Email:" dataRequester={r.email ?? ""} />
                        <RequesterContent
                            tittle="Message:"
                            dataRequester={r.message ?? ""}
                        />
                    </div>

                    <div className="flex flex-row px-[var(--marging-M)] w-[268px] gap-[var(--marging-section-S)] items-end justify-end">
                        <Icon name="verify" className="w-6 h-6 cursor-pointer" />
                        <Icon name="deny" className="w-6 h-6 cursor-pointer" />
                        <Icon name="pencil" className="w-6 h-6 cursor-pointer" />
                        <Icon 
                            onClick={() => onDelete(r._id)} 
                            name="delete" 
                            className="w-6 h-6 cursor-pointer" 
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ------------ Search Bar --------------- */
export function SearchBar({ search, setSearch }) {
    return (
        <div
            className="w-full h-[32px] flex items-center bg-white
        border-[0.5px] border-[var(--color-border-gray)]
        rounded-[4px] px-[var(--marging-M)] gap-[10px] flex-row-reverse shadow-[inset_2px_2px_6px_rgba(0,0,0,0.1)]"
        >
            <input
                type="text"
                placeholder="Search by name, email o message..."
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

/* ----------- Main Component ----------- */
export default function ShowRequester() {
    const [search, setSearch] = useState("");
    const [requesters, setRequesters] = useState([]);
    const [filteredRequesters, setFilteredRequesters] = useState([]);
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [loading, setLoading] = useState(false); // ✅ Agregado

    // ✅ Función para eliminar dentro del componente
    const deleteRequester = async (id) => {
        if (!window.confirm("Are you sure you want to delete this requester?")) {
            return;
        }
        
        setLoading(true);
        
        try {
            const res = await fetch(`http://localhost:3000/api/users/userId/${id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (res.ok) {
                // Actualizar ambos estados
                setRequesters((prev) => prev.filter((r) => r._id !== id));
                setFilteredRequesters((prev) => prev.filter((r) => r._id !== id));
                alert("Requester deleted successfully");
            } else {
                const errorData = await res.json();
                alert("Error deleting requester: " + errorData.error);
            }
        } catch (err) {
            console.error("Error deleting requester:", err);
            alert("Error deleting requester: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // ✅ fetchRequesters con useCallback
    const fetchRequesters = useCallback(async () => {
        try {
            const res = await fetch("http://localhost:3000/api/users");
            if (!res.ok) throw new Error("Error HTTP");
            const data = await res.json();
            setRequesters(Array.isArray(data) ? data : []);
            setFilteredRequesters(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching requesters:", err);
            setRequesters([]);
            setFilteredRequesters([]);
        }
    }, []);

    // ✅ Carga inicial
    useEffect(() => {
        fetchRequesters();
    }, [fetchRequesters]);

    // ✅ Filtrado local sin parpadeos
    useEffect(() => {
        if (!search.trim()) {
            setFilteredRequesters(requesters);
        } else {
            const value = search.toLowerCase();
            const filtered = requesters.filter(
                (r) =>
                    (r.name && r.name.toLowerCase().includes(value)) ||
                    (r.surname && r.surname.toLowerCase().includes(value)) ||
                    (r.email && r.email.toLowerCase().includes(value)) ||
                    (r.message && r.message.toLowerCase().includes(value))
            );
            setFilteredRequesters(filtered);
        }
    }, [search, requesters]);

    // ✅ Botón Filters (muestra/oculta panel)
    const handleFilterClick = () => {
        setFiltersVisible((prev) => !prev);
    };

    const buttonFilter = [
        {
            id: 1,
            iconName: "filter",
            text: "Filters",
            textClass: "bodyText text-[var(--color-text-gray)]",
            showIcon: true,
            onClick: handleFilterClick,
        },
    ];

    return (
        <section className="w-full flex flex-col pt-[var(--marging-section-XL)] border-t-[0.5px] border-[var(--color-border-gray)] gap-[var(--marging-section-S)]">
            {/* Header: search + filters */}
            <div className="flex-row w-full flex items-center py-[var(--marging-M)] gap-[32px]">
                <SearchBar search={search} setSearch={setSearch} />
                {buttonFilter.map((button) => (
                    <Filter key={button.id} {...button} />
                ))}
            </div>

            {/* Panel de filtros opcional */}
            {filtersVisible && (
                <div className="p-3 mb-3 border rounded-lg bg-[var(--color-bg-light-gray)]">
                    <p className="text-sm text-[var(--color-text-gray)]">
                        Aquí irán los filtros avanzados 🔍
                    </p>
                </div>
            )}

            {/* Bloque principal */}
            <div className="w-full h-[420px] overflow-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex flex-col">
                <RequesterBlock 
                    requesters={filteredRequesters} 
                    onDelete={deleteRequester}
                />
            </div>

            {/* Indicador de carga opcional */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <p className="text-white text-lg">Eliminando...</p>
                </div>
            )}
        </section>
    );
}