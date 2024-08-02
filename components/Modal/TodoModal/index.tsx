import ModalButton from "@/components/Button/ModalButton/ModalButton";
import styles from "./ToDoModal.module.scss";
import Close from "@/public/icons/close_icon.svg";
import More_vert from "@/public/icons/more_vert_icon.svg";
import useWindowSize from "@/hooks/useDevice";
import { TABLET_MAX_WIDTH } from "@/constants/screensize";

export default function ToDoModal() {
    const {width}=useWindowSize();
  return (
    <div className={styles["todo-modal"]}>
        {width < TABLET_MAX_WIDTH ? 
        <>
         <div className={styles["todo-top-icon"]}> 
        <More_vert width="28" height="28" />
        {/* <ul>
          <li>수정하기</li>
          <li>삭제하기</li>
        </ul> */}
        <Close width="32" height="32" alt="닫기" />
        </div>
        <h1 className={styles["todo-h1"]}>새로운 일정 관리 Taskify</h1>
        </>
        : <>
      <div className={styles["todo-top"]}>
        <h1 className={styles["todo-h1"]}>새로운 일정 관리 Taskify</h1>
        <div className={styles["todo-top-icon"]}>
        <More_vert width="28" height="28" />
        {/* <ul>
          <li>수정하기</li>
          <li>삭제하기</li>
        </ul> */}
        <Close width="32" height="32" alt="닫기" />
        </div>
      </div>
      </>
}

      <div className={styles["todo-column"]}>
        <div>
        <section className={styles["todo-chip-container"]}>
          <div className={styles["todo-chip-container-state"]}>todo</div>
          <div className={styles["todo-chip-container-line"]}></div>
          <div className={styles["todo-chip-container-tag-container"]}>
            <div className={styles["todo-chip-container-tag"]}>프로젝트</div>
            <div className={styles["todo-chip-container-tag"]}>프로젝트</div>
          </div>
        </section>

        <section className={styles["todo-description"]}>내용</section>

        <div>이미지</div>

        <div className={styles["todo-comment-input-container"]}>
        <span className={styles["todo-comment-span"]}>댓글</span>
        <input></input>
        {/* <input className={styles["todo-comment-input"]}> */}
          {/* <ModalButton isComment={true}></ModalButton> */}
          </div>

        <section className={styles["todo-comment-container"]}>
          <div>프로필 이미지</div>
          <div className={styles["todo-user-comment-container"]}>
            <div className={styles["todo-user-comment-container-name"]}>
              <span className={`${styles["todo-user-comment-auth"]} ${styles.name}`}>정만철</span>
              <span className={`${styles["todo-user-comment-auth-container"]} ${styles.date}`}>날짜</span>
            </div>
            <span className={`${styles["todo-user-comment-auth"]} ${styles.description}`}>
              댓글 내용
            </span>
            <div className={`${styles["todo-user-comment-auth-container"]} ${styles["edit-container"]}`}>
              <span>수정</span>
              <span>삭제</span>
            </div>
          </div>
        </section>
        </div>

        <section className={styles["todo-user-container"]}>
          <div className={`${styles["todo-user-container-top"]} ${styles["todo-margin"]}`}>
            <h2 className={styles["todo-user-top"]}>담당자</h2>
            <div className={styles["todo-user-img-container"]}>
              <div>프로필 이미지</div>
              <span className={styles["todo-user-name"]}>이름</span>
            </div>
          </div>
          <div className={styles["todo-user-container-top"]}>
            <h2 className={styles["todo-user-top"]}>마감일</h2>
            <div className={styles["todo-user-name"]}>날짜</div>
          </div>
        </section>
      </div>
    </div>
  );
}