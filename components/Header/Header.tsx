import styles from "@/components/Header/style.module.scss";
import HeaderButton from "@/components/Button/HeaderButton/HeaderButton";
import CROWNSVG from "@/public/icons/crown_icon.svg";
import { TABLET_MAX_WIDTH, MOBILE_MAX_WIDTH } from "@/constants/screensize";
import useWindowSize from "@/hooks/useDevice";
import { useRouter } from "next/router";
import { useDashboard } from "@/contexts/DashboardContext";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { getHeader, getMyPage } from "@/lib/headerApi";
import { generateProfileImageUrl } from "@/lib/avatarsApi";
import useInviteStore from "@/hooks/useInviteStore";
import instance from "@/lib/axios";
import Image from "next/image";
import Link from "next/link";

const getRandomPastelColor = () => {
  const randomValue = () => Math.floor(Math.random() * 56 + 200);
  const red = randomValue();
  const green = randomValue();
  const blue = randomValue();
  return `rgb(${red}, ${green}, ${blue})`;
};

interface Assignee {
  userId: string;
  email: string;
  nickname: string;
  profileImageUrl: string;
  isOwner: boolean;
}

interface My {
  email: string;
  nickname: string;
  profileImageUrl: string | null;
}

interface CreateProps {
  createdByMe: boolean;
}

interface Props {
  dashboardId: number;
  isAccountEdit?: boolean;
}

export default function Header({ dashboardId, isAccountEdit = false }: Props) {
  const randomBackgroundColor = getRandomPastelColor();
  const { width } = useWindowSize();
  const router = useRouter();
  const { dashboard } = useDashboard();
  const { setIsShowModal } = useInviteStore();
  const [nonOwners, setNonOwners] = useState<Assignee[]>([]);
  const [values, setValues] = useState<My>({
    email: "",
    nickname: "",
    profileImageUrl: null,
  });

  const firstPageSize = 5;
  const [createdByMe, setCreatedByMe] = useState<boolean>(false);

  const clickSetting = () => {
    router.push(`/dashboards/${dashboard?.id}/edit`);
  };

  // 초대 받은 사람 조회
  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await getHeader(dashboardId);
        const nonOwners = response.members.filter(
          (member: Assignee) => !member.isOwner
        );
        setNonOwners(nonOwners.reverse());
      } catch (err) {
        console.error("멤버 조회에 실패했습니다.");
      }
    };
    fetchMember();
  }, []);

  // 내가 만든건지 아닌지
  useEffect(() => {
    const fetchCreatedByMe = async () => {
      try {
        const res = await instance.get(
          `/dashboards?navigationMethod=pagination&page=1&size=${firstPageSize}`
        );
        const CreatedByMe = res.data.dashboards.some(
          (dashboards: CreateProps) => dashboards.createdByMe
        );
        setCreatedByMe(CreatedByMe);
      } catch {
        console.error("대시보드 목록 조회에 실패하였습니다.");
      }
    };
    fetchCreatedByMe();
  });

  const displayedMembers = nonOwners.slice(0, 3); // 보여지는 멤버 (3명만) - 수정 가능
  const remaininCount = nonOwners.length - 3; //숨기는 멤버

  const removeCurrentDashboardId = () => {
    localStorage.removeItem("currentDashboardId");
  };

  // 내 정보 조회
  useEffect(() => {
    const fetchMyData = async () => {
      try {
        const response = await getMyPage();
        values.nickname = response.nickname;
        values.email = response.email;
        values.profileImageUrl = response.profileImageUrl;
      } catch (err) {
        console.error("내 정보 조회에 실패했습니다.");
      }
    };
    fetchMyData();
  }, []);

  return (
    <header className={styles.Header}>
      <section className={styles.header_container}>
        <div>
          {width >= TABLET_MAX_WIDTH ? (
            <div>
              {localStorage.getItem("currentDashboardId") !== null ? (
                <div className={styles.header_titleContainer}>
                  <div className={styles.header_title}>{dashboard?.title}</div>
                  {createdByMe ? (
                    <CROWNSVG className={styles.crown_icon} />
                  ) : (
                    <></>
                  )}
                </div>
              ) : (
                <>
                  {isAccountEdit ? (
                    <div className={styles.header_title}>계정 관리</div>
                  ) : (
                    <div className={styles.header_title}>내 대시보드</div>
                  )}
                </>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>

        <div className={styles["header-button-member-container"]}>
          <div className={styles.header_buttons}>
            <HeaderButton setting={true} onClick={clickSetting}>
              관리
            </HeaderButton>
            <HeaderButton
              isInvitation={true}
              onClick={() => setIsShowModal(true)}
            >
              초대하기
            </HeaderButton>
          </div>
          <div className={styles["dashboard-members-container"]}>
            {displayedMembers.map((member, index) => (
              <img
                key={member.userId}
                src={
                  member.profileImageUrl
                    ? member.profileImageUrl
                    : generateProfileImageUrl(member.nickname)
                }
                alt={member.nickname}
                className={styles["dashboard-members"]}
                style={{
                  zIndex: nonOwners.length + index,
                  marginLeft: index > 0 ? "-8px" : "0",
                }}
                width="38"
                height="38"
              />
            ))}
            {remaininCount > 0 && (
              <div
                className={styles["header-remain-incount"]}
                style={{
                  zIndex: nonOwners.length + displayedMembers.length,
                  marginLeft: "-10px",
                  background: randomBackgroundColor,
                }}
              >
                +{remaininCount}
              </div>
            )}
          </div>
        </div>
      </section>
      <button
        className={styles.header_userButton}
        onClick={removeCurrentDashboardId}
      >
        <Link href="/MyPage">
          <section className={styles.header_usersContainer}>
            <img
              src={
                values.profileImageUrl
                  ? values.profileImageUrl
                  : generateProfileImageUrl(values.nickname)
              }
              alt="프로필"
              width="38"
              height="38"
              className={styles["header-user-img"]}
            />
            <div className={styles.header_userNickname}>{values.nickname}</div>
          </section>
        </Link>
      </button>
    </header>
  );
}
