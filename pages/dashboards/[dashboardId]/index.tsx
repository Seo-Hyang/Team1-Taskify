// 기본 import
import styles from "./index.module.scss";
import Header from "@/components/Header/Header";
import SideMenu from "@/components/SideMenu/SideMenu";
import Head from "next/head";
import { useRouter } from "next/router";
import instance from "@/lib/axios";
import React, { useEffect, useState } from "react";
import { useDashboard } from "@/contexts/DashboardContext";

// 컴포넌트 import
import DashboardColumn from "@/components/DashboardColumns/DashboardColumns";
import AddButton from "@/components/Button/AddButton/AddButton";
import Column from "@/components/DashboardColumns/DashboardColumns";
import { getDashboard } from "@/services/dashboards";

export type Column = {
  id: number;
  title: string;
  teamId: string;
  dashboardId: number;
  createdAt: string;
  updatedAt: string;
};

export default function DashBoard() {
  //대시보드 id에 따라 페이지 이동
  //이거 아닌듯...?
  const router = useRouter();
  const { setDashboard } = useDashboard();
  const { dashboardId } = router.query;

  //칼럼 목록
  const [columsList, setColumnList] = useState<Column[]>([]);

  async function getColumnList() {
    const res = await instance.get(
      `https://sp-taskify-api.vercel.app/7-1/columns?dashboardId=11370`
      // "https://sp-taskify-api.vercel.app/7-1/columns?dashboardId=11419"
    );
    const nextColumnList = res.data;
    const { result, data } = nextColumnList;

    setColumnList(data);
  }

  async function setDashboardContext() {
    const dashboard = await getDashboard(Number(dashboardId));
    setDashboard({ id: Number(dashboardId), title: dashboard.title });
  }

  /*To-do
    -dashboard Id에 따라 칼럼 불러오기
    현재의 대시보드 Id를 알아야 하는데,,, 로컬 스토리지에서 관리해야하나?
  */

  useEffect(() => {
    setDashboardContext();

    getColumnList();
  }, []);

  return (
    <>
      <div>
        <Head>
          <title>Taskify-대시보드</title>
        </Head>
      </div>
      <section>
        <SideMenu />
        <Header>내 대시보드</Header>
      </section>
      <section className={styles.dashboardContainer}>
        <section className={styles.dashboardColumns}>
          {columsList.map((item) => (
            <section key={item.id} className={styles.dashboardColumns}>
              <DashboardColumn columnId={item.id}>{item.title}</DashboardColumn>
            </section>
          ))}
        </section>
        <div className={styles.add_newColumn}>
          <AddButton addColumn={true}>새로운 칼럼 추가하기</AddButton>
        </div>
      </section>
    </>
  );
}