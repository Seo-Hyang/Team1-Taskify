import { useEffect, useRef, useState } from "react";
import styles from "./Dropdown.module.scss";
import More_vert from "@/public/icons/more_vert_icon.svg";
import useModalStore from "@/hooks/useModalStore";
import ToDoEdit from "../Modal/ToDoEdit";
import CardDelete from "../Column/CardDelete";
import useEditModalStore from "@/hooks/useEditModalStore";

interface Assignee {
  userId?: number;
  id?: number;
  nickname?: string;
  profileImageUrl?: string | null;
}

interface CardData {
  title: string;
  description: string;
  dueDate: string;
  tags: string[];
  imageUrl: string;
  assignee: Assignee;
  columnId?: number;
}

interface Props {
  cardId: number;
  columnId: number;
  dashboardId: number;
  onCardDeleted: (cardId: number) => void;
  onUpdate?: (updatedCard: CardData) => void;
}

export default function Dropdown({
  cardId,
  columnId,
  dashboardId,
  onCardDeleted,
  onUpdate,
}: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeButton, setActiveButton] = useState<"edit" | "delete">();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { editopenModal } = useEditModalStore();

  const toggleDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setActiveButton("edit");
    editopenModal("editcard");
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setActiveButton("delete");
    editopenModal("deletecard");
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div ref={dropdownRef} className={styles["dropdown-container"]}>
      {/* <ToDoEdit cardId={cardId} columnId={columnId} dashboardId={dashboardId} /> */}
      <CardDelete cardId={cardId} onCardDeleted={onCardDeleted} />
      <button className={styles["dropdown-button"]} onClick={toggleDropdown}>
        <More_vert width="28" height="28" />
      </button>
      {isDropdownOpen && (
        <>
          <div className={styles["dropdown-menu-container"]}>
            <button
              className={`${styles["dropdown-menu"]} ${
                activeButton === "edit" ? styles["dropdown-menu-active"] : ""
              }`}
              onClick={handleEditClick}
            >
              수정하기
            </button>
            <button
              className={`${styles["dropdown-menu"]} ${
                activeButton === "delete" ? styles["dropdown-menu-active"] : ""
              }`}
              onClick={handleDeleteClick}
            >
              삭제하기
            </button>
          </div>
        </>
      )}
    </div>
  );
}
