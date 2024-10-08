import styles from "./index.module.scss";
import MiniPagenation from "@/components/MiniPagenation";
import MemberItem from "./MemberItem";
import { getDashboardMembers } from "@/services/dashboards";
import useAsync from "@/hooks/useAsync";
import { useEffect, useState } from "react";
import { DashboardMember } from "@/types/dashboard";
import Skeleton from "@/components/Skeleton";

interface Props {
  dashboardId: number;
  sizePerPage: number;
}

export default function EditMemebrs({ dashboardId, sizePerPage }: Props) {
  const [memberList, setMemberList] = useState<DashboardMember[]>();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(-1);
  const [memberDeleteCount, setMemberDeleteCount] = useState(0);
  const [isLoadMembers, loadMembersError, loadMembers] =
    useAsync(getDashboardMembers);

  const handleLoadMembers = async (
    dashboardId: number,
    page: number,
    size: number
  ) => {
    try {
      const { members, totalCount } = await loadMembers(
        dashboardId,
        page,
        size
      );
      setTotalPage(Math.ceil(totalCount / sizePerPage));
      setMemberList(members);
    } catch (error) {
      console.error("구성원 조회 API 에러 발생: ", error);
    }
  };

  const handleClickLeft = () => {
    if (page <= 1) {
      return;
    }
    setPage(page - 1);
  };

  const handleClickRight = () => {
    if (page >= totalPage) {
      return;
    }
    setPage(page + 1);
  };

  useEffect(() => {
    if (!dashboardId) return;
    handleLoadMembers(dashboardId, page, sizePerPage);
  }, [page, memberDeleteCount]);

  if (isLoadMembers) {
    return <Skeleton mainHeight={110} textHeight={71} textCount={5} />;
  }

  return (
    <>
      <div className={styles.editMembers}>
        <div className={styles.headerWrapper}>
          <div className={styles.header}>
            <h1>구성원</h1>
            <MiniPagenation
              currentPage={page}
              totalPage={totalPage}
              onClcikLeft={handleClickLeft}
              onClickRight={handleClickRight}
            />
          </div>
          <h2>이름</h2>
        </div>
        <div className={styles.memberList}>
          {memberList?.map((member) => {
            return (
              <MemberItem
                key={member.id}
                memberId={member.id}
                email={member.email}
                name={member.nickname}
                imageUrl={member.profileImageUrl}
                setMemberDeleteCount={setMemberDeleteCount}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
