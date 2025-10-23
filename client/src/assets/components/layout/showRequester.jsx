import { useState, useEffect, useCallback } from "react";
import Filter from "../buttons/tertiary.jsx";
import Loop from "../sideBarLeft/icon.jsx";
import Icon from "../sideBarLeft/icon.jsx";
import { useUserStatus } from "../../../hooks/useUserStatus.js";

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
export function RequesterBlock({
    requesters = [],
    onDelete,
    onApprove,     // ✅ Agregado
    onReject,      // ✅ Agregado
    isUpdating,    // ✅ Agregado
    ...props
}) {
    if (!requesters.length)
        return (
            <p className="bodyText text-[var(--color-text-gray)] px-[var(--marging-M)]">
                No se encontraron usuarios.
            </p>
        );

    // Helper para obtener el badge de status
    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: {
                text: 'Pending',
                textColor: 'text-yellow-600',
                bgColor: 'bg-[var(--color-baadge--pending)]',
                borderColor: 'border-yellow-300',
            },
            approved: {
                text: 'Approved',
                bgColor: 'bg-green-100',
                textColor: 'text-green-800',
                borderColor: 'border-green-300'
            },
            rejected: {
                text: 'Rejected',
                bgColor: 'bg-red-100',
                textColor: 'text-red-800',
                borderColor: 'border-red-300'
            }
        };

        const config = statusConfig[status] || statusConfig.pending;

        return (
            <span className={`px-2 py-1 rounded microText border ${config.bgColor} ${config.textColor} ${config.borderColor}`}>
                {config.text}
            </span>
        );
    };

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

                        {/* ✅ Mostrar el status actual del usuario */}
                        <div className="flex flex-row gap-[var(--marging-M)]">
                            <p className="bodyText w-[80px] text-[var(--color-text-black)]">
                                Status:
                            </p>
                            {getStatusBadge(r.status)}
                        </div>
                    </div>

                    <div className="flex flex-row px-[var(--marging-M)] w-[268px] gap-[var(--marging-section-S)] items-end justify-end">
                        {/* ✅ CORREGIDO: Icono de Aprobar - ahora con onClick */}
                        {r.status !== 'approved' && (
                            <Icon
                                onClick={() => onApprove(r._id)}
                                name="verify"
                                className={`w-6 h-6 ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-110 transition-transform'}`}
                                title="Aprobar usuario"
                            />
                        )}

                        {/* ✅ CORREGIDO: Icono de Rechazar - ahora con onClick */}
                        {r.status !== 'rejected' && (
                            <Icon
                                onClick={() => onReject(r._id)}
                                name="deny"
                                className={`w-6 h-6 ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-110 transition-transform'}`}
                                title="Rechazar usuario"
                            />
                        )}

                        <Icon
                            name="pencil"
                            className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
                            title="Editar usuario"
                        />
                        <Icon
                            onClick={() => onDelete(r._id)}
                            name="delete"
                            className={`w-6 h-6 ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-110 transition-transform'}`}
                            title="Eliminar usuario"
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
    const [loading, setLoading] = useState(false);

    // Usa el hook personalizado para manejar cambios de status
    const {
        isUpdating,
        error: statusError,
        success: statusSuccess,
        approveUser,
        rejectUser, 
        clearMessages
    } = useUserStatus();

    // ✅ AGREGADO: Función para aprobar un usuario
    const handleApproveUser = async (userId) => {
        if (!window.confirm("Are you sure you want to approve this user?")) {
            return;
        }

        try {
            const updatedUser = await approveUser(userId);

            // Actualiza el estado local con el usuario modificado
            setRequesters((prev) =>
                prev.map((r) => (r._id === userId ? updatedUser.user : r))
            );
            setFilteredRequesters((prev) =>
                prev.map((r) => (r._id === userId ? updatedUser.user : r))
            );

            alert("User approved correctly");
        } catch (err) {
            console.error("Error aprobando usuario:", err);
            alert("Error al aprobar usuario: " + (err.message || 'Error desconocido'));
        }
    };

    // ✅ AGREGADO: Función para rechazar un usuario
    const handleRejectUser = async (userId) => {
        if (!window.confirm("Are you sure you want to reject this request?")) {
            return;
        }

        try {
            const updatedUser = await rejectUser(userId);

            // Actualiza el estado local con el usuario modificado
            setRequesters((prev) =>
                prev.map((r) => (r._id === userId ? updatedUser.user : r))
            );
            setFilteredRequesters((prev) =>
                prev.map((r) => (r._id === userId ? updatedUser.user : r))
            );

            alert("Request rejected successfully");
        } catch (err) {
            console.error("Error rechazando usuario:", err);
            alert("Error al rechazar usuario: " + (err.message || 'Error desconocido'));
        }
    };

    // Función para eliminar dentro del componente
    const deleteRequester = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) {
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
                alert("Usuario eliminado exitosamente");
            } else {
                const errorData = await res.json();
                alert("Error al eliminar usuario: " + errorData.error);
            }
        } catch (err) {
            console.error("Error eliminando usuario:", err);
            alert("Error al eliminar usuario: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // fetchRequesters con useCallback
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

    // Carga inicial
    useEffect(() => {
        fetchRequesters();
    }, [fetchRequesters]);

    // Filtrado local sin parpadeos
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

    // Botón Filters (muestra/oculta panel)
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

    useEffect (() => {
        if (statusError || statusSuccess){
            const timer = setTimeout (() => {
                clearMessages();
            }, 3000)

            return () => clearTimeout(timer);
        }
    }, [statusSuccess, statusError, clearMessages]);

    return (
        <section className="w-full flex flex-col pt-[var(--marging-section-XL)] border-t-[0.5px] border-[var(--color-border-gray)] gap-[var(--marging-section-S)]">
            {/* Header: search + filters */}
            <div className="flex-row w-full flex items-center py-[var(--marging-M)] gap-[32px]">
                <SearchBar search={search} setSearch={setSearch} />
                {buttonFilter.map((button) => (
                    <Filter key={button.id} {...button} />
                ))}
            </div>

            {/* ✅ AGREGADO: Mensaje de error del cambio de status */}
            {statusError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-300">
                    <p className="microText text-red-800">❌ {statusError}</p>
                </div>
            )}

            {/* ✅ AGREGADO: Mensaje de éxito del cambio de status */}
            {statusSuccess && (
                <div className="p-3 rounded-lg bg-green-50 border border-green-300">
                    <p className="microText text-green-800">✅ Status updated correctly</p>
                </div>
            )}

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
                    onApprove={handleApproveUser}    // ✅ AGREGADO
                    onReject={handleRejectUser}      // ✅ AGREGADO
                    isUpdating={isUpdating || loading} // ✅ AGREGADO
                />
            </div>

            {/* Indicador de carga */}
            {(loading || isUpdating) && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl">
                        <p className="text-gray-800 text-lg">
                            {loading ? 'Eliminando...' : 'Actualizando status...'}
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
}