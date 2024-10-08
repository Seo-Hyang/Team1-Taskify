import { ChangeEvent, useEffect, useState } from "react";
import styles from "../FileImage/FileImage.module.scss";
import File_input from "@/public/icons/file_input.svg";
import File_input_img from "@/public/icons/file_input_img.svg";
import { postImage } from "@/lib/modalApi";

interface Props {
  onImageUpload: (columnId: number, url: string) => void;
  initialImageUrl?: string;
  columnId: number;
}

export default function FileInput({
  onImageUpload,
  initialImageUrl,
  columnId,
}: Props) {
  const [currentImage, setCurrentImage] = useState<File | null>(null);

  const handleFileInput = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const objectURL = URL.createObjectURL(file);
      setCurrentImage(file);

      try {
        const response = await postImage(columnId, file); // postImage 함수 호출
        onImageUpload(columnId,response.imageUrl); // 업로드된 이미지 URL을 부모 컴포넌트로 전달
      } catch (err) {
        console.error("Image upload failed.");
      }
    } else {
      setCurrentImage(null);
    }
  };

  return (
    <>
    {JSON.stringify(initialImageUrl)}
    <div className={styles["file-input-container"]}>
      <input
        type="file"
        className={styles["file-input"]}
        onChange={handleFileInput}
        id="file-input"
      />
      <label htmlFor="file-input" className={styles["file-input-button"]}>
        {initialImageUrl ? (
          <div className={styles["file-input-preview-input"]}>
            <img
              src={initialImageUrl}
              alt="Selected"
              width="30"
              height="30"
              className={styles["file-input-img-already"]}
            />
          </div>
        ) : (
          <File_input width="28" height="28" />
        )}
      </label>
      {initialImageUrl && (
        <div className={styles["file-input-preview"]}>
          <img
            src={initialImageUrl}
            alt="Selected"
            className={styles["file-input-img"]}
          />
        </div>
      )}
    </div>
    </>
  );
}
