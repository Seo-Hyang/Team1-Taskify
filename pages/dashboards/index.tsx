//기본 import
import Header from "@/components/Header/Header";
import SideMenu from "@/components/SideMenu/SideMenu";
import Head from "next/head";
import styles from "@/pages/dashboards/style.module.scss";
import { useEffect, useState } from "react";
import { Dashboard, DashboardInvitation } from "@/types/dashboard";
import instance from "@/lib/axios";

//컴포넌트 import
import DashboardListButton from "@/components/Button/DashboardListButton/DashboardListButton";
import AddButton from "@/components/Button/AddButton/AddButton";
import PageButton from "@/components/Button/PageButton/PageButton";
import ArrowButton from "@/components/Button/ArrowButton/ArrowButton";
import EnvelopSVG from "@/public/icons/envelop.svg";

/**
 * To do
 * 초대 받은 목록 검색기능
 *
 * 대시보드 id 로컬스토리지로 관리 -> currentDashboardId
 * 초기 세팅 : currentDashboardId = null
 * 버튼 클릭시 이동
 */

export default function DashBoards() {
  const [dashboardList, setDashboardList] = useState<Dashboard[]>([]); //대시모드 목록
  const [dashboardTotalCount, setDashboardTotalCount] = useState(0); //대시보드 전체 개수
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); //페이지 이동에 따라 변경
  const [invitedList, setInvitedList] = useState<DashboardInvitation[]>([]); //초대받은 대시보드 목록
  const [invitedCount, setInvitedCount] = useState(0);

  const firstPageSize = 5;
  const pageSize = 6;

  async function getDashboardList() {
    const res = await instance.get(
      `/dashboards?navigationMethod=pagination&page=1&size=${firstPageSize}`
    );
    const nextDashboardList = res.data;
    const { dashboards, totalCount, cursorId } = nextDashboardList;

    const pageCnt = Math.trunc(totalCount / pageSize) + 1;

    setDashboardList(dashboards);
    setDashboardTotalCount(totalCount);
    setPageCount(pageCnt);
  }

  async function getInvitedList() {
    const res = await instance.get(`/invitations?size=${pageSize}`);
    const nextDashboardList = res.data;
    const { invitations, cursorId } = nextDashboardList;
    const invitationCount = invitations.length;

    setInvitedList(invitations);
    setInvitedCount(invitationCount);
  }

  //대시보드 목록, 페이지 수, 현재 페이지
  useEffect(() => {
    getDashboardList();
    getInvitedList();
  }, []);

  return (
    <div>
      <section>
        <Head>
          <title>Taskify-대시보드</title>
        </Head>
        <section>
          <SideMenu />
          <Header>내 대시보드</Header>
        </section>
      </section>
      <section className={styles.dashboardContainer}>
        <section className={styles.dashboard_inner}>
          <section className={styles.dashboard_myListContainer}>
            <section className={styles.dashboard_myList}>
              <AddButton>새로운 대시보드</AddButton>
              {dashboardList.map((item) => (
                <DashboardListButton
                  key={item.id}
                  isOwn={item.createdByMe}
                  color={item.color}
                >
                  {item.title}
                </DashboardListButton>
              ))}
            </section>
            {dashboardTotalCount === 0 ? (
              <></>
            ) : (
              <div className={styles.dashboard_pageCursor}>
                {pageCount} 페이지 중 {currentPage}
                <div>
                  <ArrowButton leftArrow={true} />
                  <ArrowButton rightArrow={true} />
                </div>
              </div>
            )}
          </section>
          <section className={styles.dashboard_invitedList}>
            <section className={styles.invited_inner}>
              <section className={styles.dashboard_invitedTitle}>
                초대받은 대시보드
              </section>
              {invitedCount === 0 ? (
                <section className={styles.invited_empty}>
                  <EnvelopSVG className={styles.invited_emptySVG} />
                  <p className={styles.invited_emptyText}>
                    아직 초대받은 대시보드가 없어요
                  </p>
                </section>
              ) : (
                <section>
                  <input type="text" />
                  <section className={styles.invited_list}>
                    <div className={styles.dashboard_invitedColumnTitle}>
                      <p className={styles.column_title}>이름</p>
                      <p className={styles.column_inviter}>초대자</p>
                      <p className={styles.column_button}>수락여부</p>
                    </div>
                    {invitedList.map((item) => (
                      <section
                        key={item.id}
                        className={styles.dashboard_invitedContainer}
                      >
                        <div className={styles.invited_title}>
                          {item.dashboard.title}
                        </div>
                        <div className={styles.invited_inviter}>
                          {item.inviter.nickname}
                        </div>
                        <div className={styles.dashboard_invitedButtons}>
                          <PageButton>수락</PageButton>
                          <PageButton isCancled={true}>거절</PageButton>
                        </div>
                      </section>
                    ))}
                  </section>
                </section>
              )}
            </section>
          </section>
        </section>
      </section>
    </div>
  );
}