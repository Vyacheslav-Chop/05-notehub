import css from "./Loader.module.css";

interface LoaderProps {
  size?: number;
  thickness?: number;
  color?: string;
  borderColor?: string;
  shadowColor?: string;
}

export default function Loader({
  size = 40,
  thickness = 4,
  color = "#ffffff",
  borderColor = "rgba(255, 255, 255, 0.3)",
  shadowColor = "rgba(255, 255, 255, 0.6)",
}: LoaderProps) {
  const shadowLayers = [10, 20, 30, 40]
    .map((radius) => `0 0 ${radius}px ${shadowColor}`)
    .join(", ");

  const style = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "50%",
    borderWidth: `${thickness}px`,
    borderTopColor: color,
    borderRightColor: borderColor,
    borderBottomColor: borderColor,
    borderLeftColor: borderColor,
    boxShadow: shadowLayers,
  };
  return (
    <div className={css.backdrop}>
      <span className={css.spinner} style={style}></span>
    </div>
  );
}
