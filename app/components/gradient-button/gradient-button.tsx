import type React from "react";
import classNames from "classnames";
import styles from "./gradient-button.module.css";

interface GradientButtonProps extends React.ComponentProps<"button"> {
  /**
   * Button variant
   * @important
   * @enum primary,secondary
   */
  variant?: "primary" | "secondary";
  /**
   * Button size
   * @important
   * @enum default,large,small
   */
  size?: "default" | "large" | "small";
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  className,
  variant = "primary",
  size = "default",
  children,
  ...props
}) => {
  return (
    <button
      className={classNames(
        styles.button,
        variant === "secondary" && styles.secondary,
        size === "large" && styles.large,
        size === "small" && styles.small,
        className,
      )}
      {...props}
    >
      <span>{children}</span>
    </button>
  );
};
