import type React from "react";
import classNames from "classnames";
import styles from "./glass-card.module.css";

interface GlassCardProps extends React.ComponentProps<"div"> {
  /**
   * Whether the card is interactive (clickable)
   * @important
   */
  interactive?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ className, interactive = false, children, ...props }) => {
  return (
    <div className={classNames(styles.card, interactive && styles.interactive, className)} {...props}>
      {children}
    </div>
  );
};
