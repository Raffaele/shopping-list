import styles from './EmptyState.module.css';

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className={styles.empty}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.text}>{text}</p>
    </div>
  );
}
