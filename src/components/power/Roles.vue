<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-button type="primary" @click="showAddRoleDialog">添加角色</el-button>

      <!-- 角色表格区域 -->
      <el-table :data="rolesList" broder stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 柵格化 -->
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过 for 循环 嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 列 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      closable
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="250px">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="showEditDialog(scope.row)"
              >编辑</el-button
            >
            <el-button type="danger" size="mini" @click="removeRole(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRigthDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        node-key="id"
        show-checkbox
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="50%"
      @close="addRoleDialogClosed"
    >
      <!-- 表单 -->
      <el-form
        :model="addRoleFormInfo"
        label-width="80px"
        :rules="addRoleRules"
        ref="addRoleFormRef"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleFormInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRoleFormInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoleDialogVisible"
      width="50%"
      @close="editRoleDialogClosed"
    >
      <el-form
        :model="editRoleFormInfo"
        label-width="80px"
        :rules="editRoleRules"
        ref="editRoleFormRef"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleFormInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRoleFormInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  created() {
    this.getRolesList()
  },
  data() {
    return {
      // 角色列表
      rolesList: [],
      // 控制设置权限对话框的显示/隐藏
      setRightDialogVisible: false,
      // 所有权限列表
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      // 默认选中的节点ID值
      defKeys: [],
      // 当前即将分配权限的ID
      roleId: '',
      // 控制添加角色对话框的显示/隐藏
      addRoleDialogVisible: false,
      // 暂存添加角色的信息
      addRoleFormInfo: {
        roleName: '',
        roleDesc: '',
      },
      // 添加角色的规则
      addRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
      },
      // 控制编辑对话框的显示/隐藏
      editRoleDialogVisible: false,
      // 选中的编辑角色的信息
      editRoleFormInfo: {
        id: '',
        roleName: '',
        roleDesc: '',
      },

      // 编辑角色的规则
      editRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败!')
      }
      this.rolesList = res.data
    },
    // 根据ID 删除对应的权限
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限,是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败!')
      }
      // 使用this.getRolesList() 会引起 模板的重新渲染
      role.children = res.data
      this.$message.success('删除成功!')
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      // 保存该角色的id 到 data中， 分配权限时会用到
      this.roleId = role.id
      // 获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取所有权限失败!')
      }
      // 获取到的权限数据保存在 data 中
      this.rightsList = res.data

      // 递归获取三级节点的ID
      this.getLeafKeys(role, this.defKeys)

      this.setRightDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的ID，并保存到defkeys数组中
    getLeafKeys(node, arr) {
      if (!node.children) {
        // 若当前node节点不包含，children属性，则是三级节点
        return arr.push(node.id)
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听分配权限对话框的关闭事件
    setRigthDialogClosed() {
      // 重置
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights(id) {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      // 将选中的值，转换成以,号分隔的字符串（这是后端要求的格式）
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: idStr,
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败!')
      }
      this.$message.success('分配权限成功!')
      this.getRolesList()
      this.setRightDialogVisible = false
    },

    // 点击显示添加角色对话框
    showAddRoleDialog() {
      this.addRoleDialogVisible = true
    },

    // 点击添加角色
    addRole() {
      // 校验
      this.$refs.addRoleFormRef.validate(async (valid) => {
        if (!valid) return
        // 校验通过，发起添加角色的post请求
        const { data: res } = await this.$http.post(
          'roles',
          this.addRoleFormInfo
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败!')
        } else {
          this.$message.success('添加角色成功!')
          // 隐藏添加角色对话框
          this.addRoleDialogVisible = false
          // 重新获取角色列表
          this.getRolesList()
        }
      })
    },

    // 监听关闭添加角色对话框
    addRoleDialogClosed() {
      this.addRoleFormInfo = {}
    },

    // 点击显示 编辑角色对话框
    showEditDialog(role) {
      // 将 传递过来的role解构，去除 children ，减少内存占用
      const { id, roleName, roleDesc } = role
      this.editRoleFormInfo = {
        id,
        roleName,
        roleDesc,
      }
      this.editRoleDialogVisible = true
    },

    // 编辑角色对话框 确认事件
    editRole() {
      this.$refs.editRoleFormRef.validate(async (valid) => {
        if (!valid) return
        else {
          const { data: res } = await this.$http.put(
            'roles/' + this.editRoleFormInfo.id,
            {
              roleName: this.editRoleFormInfo.roleName,
              roleDesc: this.editRoleFormInfo.roleDesc,
            }
          )
          if (res.meta.status !== 200) {
            return this.$message.error('编辑角色失败!')
          }
          this.$message.success('编辑角色成功!')
          this.getRolesList()
          this.editRoleDialogVisible = false
        }
      })
    },

    // 监听 关闭编辑对话框事件
    editRoleDialogClosed() {
      this.editRoleFormInfo = {}
    },

    // 删除角色
    removeRole(id) {
      this.$confirm('此操作将永久删除该角色,是否继续?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then( async () => {
        const {data: res} = await this.$http.delete('roles/' + id)
        if (res.meta.status !== 200) {
          return this.$message.error('删除角色失败!')
        }
        this.$message.success('删除角色成功!')
        this.getRolesList()
      })
    }
  },
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

/* 展开列 */
.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
