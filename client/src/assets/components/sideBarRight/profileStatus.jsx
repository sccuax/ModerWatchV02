function ProfileStatus({ status = "offline", size = 10 }) {
    const statusVar = {
    Active: "--color-status-active",
    offline: "--color-status-disconnected",
    away: "--color-status-away",
}[status] || "--color-status-disconnected";

return (
    <span
        className={`inline-block rounded-full bg-[var(${statusVar})]`}
        style={{
        width: `${size}px`,
        height: `${size}px`,
        }}
        title={status}
        ></span>
    );
}


export default ProfileStatus;