import ModalButton from "@/components/Button/ModalButton/ModalButton";
import styles from "./Dashboard.module.scss";
import { ChangeEvent, useEffect, useState } from "react";
import { TwitterPicker } from "react-color";
import Input from "@/components/Input/ModalInput";
import { getDashboardList, postDashboardAdd } from "@/lib/columnApi";
import Dialog from "@/components/Modal/modal";
import useModalStore from "@/hooks/useModalStore";
import { useRouter } from "next/router";

export default function ColumnDashboard() {
  const router = useRouter();
  const { closeModal } = useModalStore();
  const [isDisabled, setIsDisabled] = useState(true);
  const [values, setValues] = useState({
    title: "",
    color: "#000000",
  });
  const [dashboardId, setDashboardId] = useState<string>();

  // title 없으면 버튼 비활성화
  useEffect(() => {
    setIsDisabled(!values.title);
  }, [values.title]);

  // title input
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // color input
  const handleColorChangeComplete = (color: any) => {
    setValues((prevValues) => ({
      ...prevValues,
      color: color.hex,
    }));
  };

  useEffect(() => {
    const fetchIdData = async () => {
      try {
        const response = await getDashboardList();
      } catch {
        console.error("id를 가져올 수 없습니다.");
      }
    };
    fetchIdData();
  }, []);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const data = await postDashboardAdd(values.title, values.color);
      setDashboardId(data.id);
      setValues({
        title: "",
        color: "#000000",
      });
      closeModal("column");
      router.push(`/dashboards/${data.id}`);
    } catch (err) {
      console.error("대시보드 생성에 실패했습니다.");
    }
  };
  console.log(dashboardId);

  const handleCancel = () => {
    setValues({
      title: "",
      color: "#000000",
    });
    closeModal("column");
  };

  return (
    <Dialog id="column" className={styles["dialog-container"]}>
      <div className={styles["column-dashboard"]}>
        <div className={styles["column-dashboard-container"]}>
          <h1 className={styles["column-dashboard-h1"]}>새로운 대시보드</h1>
          <div className={styles["column-dashboard-name-container"]}>
            <div className={styles["column-dashboard-input-container"]}>
              <label className={styles["column-dashboard-label"]}>
                대시보드 이름
              </label>
              <Input
                name="title"
                value={values.title}
                placeholder="이름을 입력해 주세요"
                className={styles["column-dashboard-input"]}
                type="text"
                onChange={handleInputChange}
              />
            </div>
            <TwitterPicker
              color={values.color}
              onChangeComplete={handleColorChangeComplete}
              className={styles["column-dashboard-color-picker"]}
            />
          </div>
          <div className={styles["column-dashboard-button-container"]}>
            <ModalButton isCancled={true} onClick={handleCancel}>
              취소
            </ModalButton>
            <ModalButton onClick={handleSubmit} isDisabled={isDisabled}>
              생성
            </ModalButton>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
