import styles from "@/components/Button/DashboardButton/style.module.scss";
import CrownSVG from "@/public/icons/crown_icon.svg";

export default function DashboardButton({
  children = "",
  isOwn = false,
  color = "",
}) {
  return (
    <button className={styles.container}>
      <section className={styles.contents}>
        <div
          className={styles.contents_color}
          style={{ backgroundColor: `${color}` }}
        ></div>
        <div className={styles.contents_detailContainer}>
          <section className={styles.contents_details}>
            <div className={styles.contents_name}>{children}</div>
            <CrownSVG
              className={`${styles.crownIcon} ${
                isOwn ? styles.contents_isOwn : ""
              }`}
            />
          </section>
        </div>
      </section>
    </button>
  );
}
