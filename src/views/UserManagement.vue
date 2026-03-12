<template>
<v-container >
     <v-row class="mb-4 align-center">
        <v-col>
            <h2 class="page-title">จัดการผู้ใช้งาน</h2>
        </v-col>
        <v-col class="d-flex justify-end">
            <v-btn color="primary" prepend-icon="mdi-plus" @click = "openDialog()">เพิ่มผู้ใช้งาน</v-btn>
        </v-col>
    </v-row>
    <UserTable :headers="headers" :users="UserStore.users" :isLoading="isLoading" @edit="openDialog" @delete="deleteUser"/>
   <v-dialog v-model="dialog" max-width="600px">
        <v-card class="rounded-lg">
            <v-card-title class="pa-4 bg-primary text-white">{{isEdit ? 'แก้ไขผู้ใช้งาน' : 'เพิ่มผู้ใช้งาน'}}</v-card-title>
            <v-card-text class="pt-6">
                <v-form>
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-text-field label="ชื่อ" v-model="formData.firstname" required></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field label="นามสกุล" v-model="formData.lastname" required></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field label="Username" v-model="formData.username" required></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field label="Email" v-model="formData.email" required></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-select label="บทบาท" v-model="formData.roleId" :items="roleList" item-title="name" item-value="id" required></v-select>
                        </v-col>
                        <v-col>
                            <v-switch label="สถานะใช้งาน" v-model="formData.isActive"></v-switch>
                        </v-col>
                    </v-row>
                </v-form>
                <v-card-action class="pa-4">
                    <v-btn color="gray" variant="text" @click="dialog = false">ยกเลิก</v-btn>
                    <v-btn color="primary" variant="text"@click="saveUser">บันทึก</v-btn>
                </v-card-action>
               </v-card-text>
        </v-card>
    </v-dialog>
</v-container>
</template> 

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import UserTable from '../components/UserTable.vue';
import { useUserStore } from '../store/userStore';
import type {User,UserPayload} from '../services/userService';
const isEdit = ref(false)
const dialog = ref(false);
const isLoading = ref(false);
const UserStore = useUserStore();
let editId : number;
const headers = [
    { title: 'ชื่อ', value: 'name' },
    { title: 'อีเมล', value: 'email' },
    { title: 'บทบาท', value: 'role' },
    { title: 'สถานะ', value: 'isActive' },
    { title: 'จัดการ', value: 'actions'},
]
const defaultForm: UserPayload = { firstname: '', lastname: '', username: '', email: '', roleId: null, isActive: true };
const formData = ref<UserPayload>({ ...defaultForm });
const roleList = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'User' }
]
 const openDialog = async (item?: any) => 
 {
  if (item) {
    isEdit.value = true
    editId = item.userId!;
    try{
        const userData = await UserStore.fetchUserById(editId)
        formData.value = {
            firstname: userData.firstname,
            lastname: userData.lastname,
            username: userData.username,
            email: userData.email,
            roleId: userData.roleId,
            isActive: userData.isActive
        }
    }catch(error){
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้งาน');
    }
    
  } else {
    isEdit.value = false
    editId = null!
    formData.value = {
      firstname: '',
      lastname: '',
      username: '',
      email: '',
      roleId: null,
      isActive: true
    }
  }

  dialog.value = true
}
onMounted(() => {
    UserStore.fetchUsers();
})
 const saveUser = async () => {
   if(isEdit.value){
        await UserStore.editUser(editId, formData.value);
   }else{
        await UserStore.addUser(formData.value);
   }
    dialog.value = false;
 }
 const deleteUser = async (id: number) => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้?')) {
        await UserStore.removeUser(id);
    }
 }
</script>

<style scoped> 
</style>