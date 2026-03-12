import axiosInstance from "../plugins/axios";

export interface UserPayload {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  isActive: boolean;
  roleId: number | null;
}
export interface UserDetail {
  userId: number;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  isActive: boolean;
  roleId: number;
  roleName: string;
}
export interface User {
  userId?: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  roleId: number;
  isActive: boolean;
}
export const userService = {
  getUsers: () => axiosInstance.get("/users"),
  getUserById: (id: number) => axiosInstance.get<UserDetail>(`/users/${id}`),
  createUser: (payload: UserPayload) => axiosInstance.post('/users', payload),
  updateUser: (id: number, payload: UserPayload) => axiosInstance.put(`/users/${id}`, payload),
  deleteUser: (id: number) => axiosInstance.delete(`/users/${id}`)
};
