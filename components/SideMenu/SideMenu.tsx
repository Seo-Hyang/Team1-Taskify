// 기본 import
import React, { useEffect, useState } from "react";
import styles from "./_SideMenu.module.scss";
import instance from "@/lib/axios";

// 컴포넌트 import
import ArrowButton from "../Button/ArrowButton/ArrowButton";
import DashboardButton from "@/components/Button/DashboardButton/DashboardButton";
//대시보드 인터페이스
import { Dashboard } from "@/types/dashboard";

// 이미지 import
import Logo from "@/public/images/logo/large.svg";
import LogoSmall from "@/public/images/logo/small.svg";
import AddIcon from "@/public/images/addIcon.svg";
import { it } from "node:test";
import { useRouter } from "next/router";
import useModalStore from "@/hooks/useModalStore";
import Link from "next/link";

export default function SideMenu() {
  const [dashboardList, setDashboardList] = useState<Dashboard[]>([]); //대시모드 목록
  const router = useRouter(); //라우터를 이용하여 페이지 이동(로컬스토리지의 현재대시보드 아이디에 따라)
  const { openModal } = useModalStore();
  //페이지 스테이트
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState<number>(0);
  const pageSize = 10;
  const [prevPageState, setPrevPageState] = useState(true);
  const [nextPageState, setNextPageState] = useState(false);

  async function getDashboardList() {
    try {
      const res = await instance.get(
        `/dashboards?navigationMethod=pagination&page=${page}&size=${pageSize}`
      );
      const nextDashboardList = res.data;
      const { dashboards, totalCount, cursorId } = nextDashboardList;

      const pageCnt = Math.trunc(totalCount / pageSize) + 1;
      setPageCount(pageCnt);
      setDashboardList(dashboards);
    } catch (err) {
      console.log("목록 조회에 실패했습니다.");
    }
  }

  //이전 페이지로
  const handlePagePrevClick = (e: React.MouseEvent) => {
    setPage((page) => page - 1);
    setNextPageState(false);
    if (page === 2) {
      setPrevPageState(true);
    }
  };

  //다음 페이지로
  const handlePageNextClick = (e: React.MouseEvent) => {
    setPage((page) => page + 1);
    setPrevPageState(false);

    if (page === pageCount - 1) {
      setNextPageState(true);
    }
  };

  useEffect(() => {
    getDashboardList();
    const currentDashboardId = router.query.dashboardId;
    if (currentDashboardId) {
    }
  }, [router.asPath, page]);

  const handleDashboardClick = (id: number) => {
    localStorage.setItem("currentDashboardId", id.toString());
    router.push(`/dashboards/${id}`);
  };

  // 대시보드 생성 칼럼
  const handleAddDashboardClick = (e: React.MouseEvent) => {
    openModal("column");
  };

  const removeCurrentDashboardId = () => {
    localStorage.removeItem("currentDashboardId");
  };

  return (
    <>
      <div className={styles.sideMenuContainer}>
        <div className={styles.sideMenuContentBox}>
          <div className={styles.sideMenuContentHeader}>
            <a href="../../">
              <Logo className={styles.sideMenuLogo} />
              <LogoSmall className={styles.sideMenu_LogoSmall} />
            </a>
          </div>
          <div className={styles.addDashBoard}>
            <button
              onClick={removeCurrentDashboardId}
              className={styles.dashboard_link}
            >
              <Link href={"/dashboards"}>Dash Boards</Link>
            </button>
            <div className={styles.dashboard_add}>
              <AddIcon onClick={handleAddDashboardClick} />
            </div>
          </div>
          <section className={styles.dashboard_list}>
            {dashboardList.map((item) => (
              <section key={item.id} className={styles.sideMenuContent}>
                <DashboardButton
                  isOwn={item.createdByMe}
                  color={item.color}
                  onClick={() => {
                    localStorage.setItem(
                      "currentDashboardId",
                      item.id.toString()
                    );
                    router.push(
                      `/dashboards/${localStorage.getItem(
                        "currentDashboardId"
                      )}`
                    );
                  }}
                  isCursorNow={
                    item.id.toString() ===
                    localStorage.getItem("currentDashboardId")
                  }
                >
                  {item.title}
                </DashboardButton>
              </section>
            ))}
          </section>
          <section className={styles.arrowButtons}>
            <ArrowButton
              leftArrow
              onClick={handlePagePrevClick}
              disabled={prevPageState}
            />
            <ArrowButton
              rightArrow
              onClick={handlePageNextClick}
              disabled={nextPageState}
            />
          </section>
        </div>
      </div>
    </>
  );
}
