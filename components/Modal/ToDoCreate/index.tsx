import ModalButton from "@/components/Button/ModalButton/ModalButton";
import styles from "../ToDoCreate.module.scss";
import FileInput from "@/components/FileInput";
import Arrow_drop from "@/public/icons/arrow_drop.svg";
import { ChangeEvent, useState } from "react";

interface Tag {
  text: string;
  backgroundColor: string;
  color: string;
}

export default function ToDoCreate() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTag, setIsTag] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleTagInput = (e: ChangeEvent<HTMLInputElement>) => {
    setIsTag(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newTag = isTag.trim();
      if (newTag && !tags.some((tag) => tag.text === newTag)) {
        const { background, color } = getRandomColor();
        setTags([
          ...tags,
          { text: newTag, backgroundColor: background, color: color }]);
        setIsTag("");
      }
    }
  };

  const getRandomColor = () => {
    const colors = [
      { background: "#f9eee3", color: "#d58d49" },
      { background: "#e7f7db", color: "#89d549" },
      { background: "#f7dbf0", color: "#d549b6" },
      { background: "#dbe6f7", color: "#4981d5" },
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  return (
    <div className={styles["todo-create"]}>
      <h1 className={styles["todo-create-h1"]}>할일 생성</h1>
      <div className={styles["todo-create-input-section"]}>
        <div className={styles["todo-create-input-auth"]}>
          <label className={styles["todo-create-label"]}>담당자</label>
          <input></input>
          <Arrow_drop onClick={toggleDropdown} />
          {isOpen && <div>assignee-id</div>}
        </div>
        <div className={styles["todo-create-input-auth"]}>
          <label className={styles["todo-create-auth-label"]}>제목 *</label>
          <input></input>
        </div>
        <div className={styles["todo-create-input-auth"]}>
          <label className={styles["todo-create-auth-label"]}>설명 *</label>
          <input></input>
        </div>
        <div className={styles["todo-create-input-auth"]}>
          <label className={styles["todo-create-auth-label"]}>마감일</label>
          <input></input>
        </div>
        <div className={styles["todo-create-input-auth"]}>
          <label className={styles["todo-create-auth-label"]}>태그</label>
          <input
            name="tag"
            value={isTag}
            onChange={handleTagInput}
            onKeyDown={handleKeyDown}
          ></input>
          <div className={styles["tag-list"]}>
            {tags.map((tag, index) => (
                <span
                  key={index}
                  className={styles.tag}
                  style={{
                    backgroundColor: tag.backgroundColor,
                    color: tag.color,
                  }}
                >
                  {tag.text}
                </span>
            ))}
          </div>
        </div>
        <div className={styles["todo-create-input-img"]}>
          <label className={styles["todo-create-auth-label"]}>이미지</label>
          <FileInput />
        </div>
      </div>

      <div className={styles["todo-create-button-container"]}>
        <ModalButton className={styles["todo-create-button"]} isCancled={true}>
          취소
        </ModalButton>
        <ModalButton className={styles["todo-create-button"]} isComment={true}>
          생성
        </ModalButton>
      </div>
    </div>
  );
}
