<template>
  <div>
    <!--    预览文章分类-->
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button size="mini" type="primary" @click="addCateShowDialogBtnFn">添加分类</el-button>
      </div>
      <el-table :data="cateList" border stripe style="width: 100%">
        <el-table-column label="序号" type="index" width="100"></el-table-column>
        <el-table-column label="分类名称" prop="cate_name"></el-table-column>
        <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button size="mini" type="primary" @click="updateFn(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="delFn(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog :visible.sync="addVisible" title="添加文章分类" width="35%" @closed="onAddClosedFn">
      <!-- 添加的表单 -->
      <el-form :model="addForm" :rules="addRules" ref="addRef" label-width="80px">
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model="addForm.cate_name" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
          <el-input v-model="addForm.cate_alias" minlength="1" maxlength="15"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelFn">取 消</el-button>
        <el-button size="mini" type="primary" @click="addFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getArtCateListAPI, saveArtCateAPI, updateArtCateAPI, delArtCateAPI } from '@/api'

export default {
  name: 'ArtCate',
  data () {
    return {
      // 文章的分类数组
      cateList: [],
      addVisible: false,
      addForm: { // 添加表单的数据对象
        cate_name: '',
        cate_alias: ''
      },
      addRules: { // 添加表单的验证规则对象
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '分类名必须是1-10位的非空字符', trigger: 'blur' }
        ],
        cate_alias: [
          { required: true, message: '请输入分类别名', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '分类别名必须是1-15位的字母数字', trigger: 'blur' }
        ]
      },
      isEdit: false, // true为修改分类，false为添加分类
      editID: '' /// / 要修改的文章id
    }
  },
  created () {
    this.getArtCateFn()
  },
  methods: {
    // 添加分类点击事件
    addCateShowDialogBtnFn () {
      this.editID = '' // 编辑的文章分类id设置无
      this.isEdit = false // 编辑的状态关闭
      this.addVisible = true
    },
    // 获取分类列表
    async getArtCateFn () {
      const res = await getArtCateListAPI()
      // console.log(res) // 请求到的对象
      this.cateList = res.data.data
    },
    // 对话框内-确定添加按钮-点击事件
    addFn () {
      this.$refs.addRef.validate(async valid => {
        if (valid) {
          // 校验通过判断是修改还是添加
          if (this.isEdit) {
            // 调用新增接口
            this.addForm.id = this.editID
            const { data: res } = await updateArtCateAPI(this.addForm)
            // 判断修改分类，修改失败
            if (res.code !== 0) return this.$message.error(res.message)
            // 修改成功
            this.$message.success(res.message)
          } else {
            // 调用新增接口函数，传递参数
            const { data: res } = await saveArtCateAPI(this.addForm)
            // 判断添加分类，添加失败
            if (res.code !== 0) return this.$message.error(res.message)
            // 添加成功
            this.$message.success(res.message)
          }
          // 重新获取列表数据
          this.getArtCateFn()
          // 关闭对话框
          this.addVisible = false
        } else {
          return false
        }
      })
    },
    // 对话框内-取消按钮-点击事件
    cancelFn () {
      this.addVisible = false
    },
    // 关闭重置表单
    onAddClosedFn () {
      this.$refs.addRef.resetFields()
    },
    // 修改分类按钮
    updateFn (obj) {
      console.log(obj)
      this.isEdit = true // 显示修改对话框
      this.editID = obj.id // 绑定修改的id
      // 修改对话框显示
      this.addVisible = true
      // 将对象中的值回填到表单中
      // 设置数据回显,异步Dom的更新
      this.$nextTick(() => {
        // 先让对话框出现, 它绑定空值的对象, 才能resetFields清空用初始空值
        this.addForm.cate_name = obj.cate_name
        this.addForm.cate_alias = obj.cate_alias
      })
    },
    // 删除分类
    async delFn (id) {
      // 请求删除接口函数
      const { data: res } = await delArtCateAPI(id)
      // 删除失败
      if (res.code !== 0) return this.$message.error(res.message)
      // 删除成功
      this.$message.success(res.message)
      // 重新获取文章分类列表
      this.getArtCateFn()
    }
  }
}
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
