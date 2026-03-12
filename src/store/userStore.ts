import {defineStore} from 'pinia';
import {userService,type UserPayload} from '../services/userService';

export const useUserStore = defineStore('user', {
    state: () => ({
        users: [],
        isLoading: false,
    }),
    actions:{
        async fetchUsers(){
            this.isLoading = true;
            try {
                const response = await userService.getUsers();
                this.users = response.data.items;
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                this.isLoading = false;
            }
        },
    async fetchUserById(id: number) {
    const res = await userService.getUserById(id);
      return res.data;
    },
    async addUser(payload: UserPayload) {
      await userService.createUser(payload);
      await this.fetchUsers();
    },
    async editUser(id: number, payload: UserPayload) {
      await userService.updateUser(id, payload);
      await this.fetchUsers();
    },
    async removeUser(id: number) {
      await userService.deleteUser(id);
      await this.fetchUsers();
    }
    }
})