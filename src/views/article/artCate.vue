<template>
  <div>
    <!--    预览文章分类-->
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button size="mini" type="primary" @click="addVisible = true">添加分类</el-button>
      </div>
      <el-table :data="cateList" border stripe style="width: 100%">
        <el-table-column label="序号" type="index" width="100"></el-table-column>
        <el-table-column label="分类名称" prop="cate_name"></el-table-column>
        <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
        <el-table-column label="操作">
          <el-button size="mini" type="primary">修改</el-button>
          <el-button size="mini" type="danger">删除</el-button>
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
import { getArtCateListAPI, saveArtCateAPI } from '@/api'

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
      }// 添加分类-对话框是否显示
    }
  },
  created () {
    this.getArtCateFn()
  },
  methods: {
    async getArtCateFn () {
      const res = await getArtCateListAPI()
      // console.log(res) // 请求到的对象
      this.cateList = res.data.data
    },
    // 对话框内-添加按钮-点击事件
    addFn () {
      this.$refs.addRef.validate(async valid => {
        if (valid) {
          // 校验通过
          // 调用接口函数，传递参数
          const { data: res } = await saveArtCateAPI(this.addForm)
          // 判断添加分类，添加失败
          if (res.code !== 0) return this.$message.error(res.message)
          // 添加成功
          this.$message.success(res.message)
          // 重新获取列表数据
          this.getArtCateFn()
        } else {
          return false
        }
      })
      this.addVisible = false
    },
    // 对话框内-取消按钮-点击事件
    cancelFn () {
      this.addVisible = false
    },
    // 关闭重置表单
    onAddClosedFn () {
      this.$refs.addRef.resetFields()
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
