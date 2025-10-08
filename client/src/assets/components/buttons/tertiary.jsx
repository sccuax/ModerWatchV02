import React from "react";
import Icon from "../sideBarLeft/icon.jsx";

export default function TertiaryButton({
  iconName,
  text,
  iconProps = {},
  showIcon = true,     // nueva prop para controlar visibilidad del icono
  onClick,
  style = {},
  ...props
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 8px",
        gap: "12px",
        border: "0.5px solid var(--color-border-gray)",
        borderRadius: "4px",
        background: "#fff",
        boxShadow: "2px 2px 4px 0 var(--shadow-middle-gray, #D1D5DB) inset, 2px 2px 6px 0 var(--shadow-gray, #9CA3AF)",
        ...style,
      }}
      {...props}
    >
      {showIcon && iconName && (
        <Icon
          name={iconName}
          {...iconProps}
          className="w-[var(--size-icon-base)] h-[var(--size-icon-base)]"
        />
      )}
      <span className="bodyText text-[var(--color-text-black)]">
        {text}
      </span>
    </button>
  );
}
