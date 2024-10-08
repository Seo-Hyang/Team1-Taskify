import axios from "axios";
import instance from "./axios";
import { headers } from "next/headers";

interface RequestOptions {
  method: string;
  headers?: Record<string, string>;
  data?: string | object;
}

const fetchRequest = async (url: string, options: RequestOptions) => {
  try {
    const response = await instance(url, options);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "요청에 실패했습니다.");
    } else {
      throw new Error("요청에 실패했습니다.");
    }
  }
};

// 대시보드 생성 - O
export function postDashboardAdd(title: string, color: string) {
  const url = "/dashboards";
  const options = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    data: {
      title,
      color,
    },
  };
  return fetchRequest(url, options);
}

// 대시보드 목록 조회
export function getDashboardList() {
  const url = "/dashboards?navigationMethod=infiniteScroll&page=1&size=10";
  const options = {
    method: "GET",
  };
  return fetchRequest(url, options);
}

// 칼럼 목록 조회 (같은 title 있는지) - O
export function getColumnAdd(dashboardId: number) {
  const url = `/columns?dashboardId=${dashboardId}`;
  const options = {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  };
  return fetchRequest(url, options);
}

// 새로운 칼럼 생성 - O
export function postColumnAdd(title: string, dashboardId: number) {
  const url = "/columns";
  const options = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    data: { title, dashboardId },
  };
  return fetchRequest(url, options);
}

// 칼럼 수정 - O
export function putColumnEdit(columnId: number, title: string) {
  const url = `/columns/${columnId}`;
  const options = {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    data: { columnId, title },
  };
  return fetchRequest(url, options);
}

// 칼럼 삭제 - O
export function putcolumnDelete(columnId: number) {
  const url = `/columns/${columnId}`;
  const options = {
    method: "DELETE",
    headers: {},
    data: { columnId },
  };
  return fetchRequest(url, options);
}

// 초대하기 칼럼 - O
export function postcolumnInvite(dashboardId: number, email: string) {
  const url = `/dashboards/${dashboardId}/invitations`;
  const options = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    data: { dashboardId, email },
  };
  return fetchRequest(url, options);
}
