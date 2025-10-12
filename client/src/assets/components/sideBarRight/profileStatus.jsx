function ProfileStatus({ status = "offline", size = 10 }) {
    const statusVar = {
    Active: "bg-[var(--color-status-active)]",
    offline: "bg-[var(--color-status-disconnected)]",
    away: "bg-[var(--color-status-away)]",
}[status] || "bg-[var(--color-status-disconnected)]";

return (
    <span
        className={`inline-block rounded-full ${statusVar}`}
        style={{
        width: `${size}px`,
        height: `${size}px`,
        }}
        ></span>
    );
}


export default ProfileStatus;