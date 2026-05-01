import styles from "./CarouselSkeleton.module.css";

const WIDTHS = [350, 270, 420, 295, 380, 250, 340, 300];

export function CarouselSkeleton() {
  return (
    <div className={styles.track}>
      {WIDTHS.map((w, i) => (
        <div key={i} className={styles.item} style={{ width: w }} />
      ))}
    </div>
  );
}
