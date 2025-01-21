export interface User {
  email: string,
  name: string,
  password: string,
  phone_number: string,
  role: string,
}

export enum Role {
  ROLE_CUSTOMER = "customer",
  ROLE_ADMIN = "admin", 
}

export const roles = [
  { id: "customer", text: "ユーザ" },
  { id: "admin", text: "管理者" },
  { id: "dummy", text: "エラー確認" },
]
