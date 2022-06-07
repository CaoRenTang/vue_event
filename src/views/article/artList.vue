<template>
  <div>
    <!--    内容区域-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form
          :inline="true"
          :model="q">
          <el-form-item label="文章分类">
            <el-select v-model="q.cate_id" placeholder="请选择分类" size="small">
              <el-option v-for="obj in cateList" :key="obj.id" :label="obj.cate_name" :value="obj.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px;">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary">筛选</el-button>
            <el-button size="small" type="info">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button class="btn-pub" size="small" type="primary" @click="showPubDialogFn">发表文章</el-button>
        <!-- 发表文章的 Dialog 对话框 -->
        <el-dialog :before-close="handleClose" :visible.sync="pubDialogVisible" fullscreen title="发表文章">
          <!-- 发布文章的对话框 -->
          <el-form ref="pubFormRef" :model="pubForm" :rules="pubFormRules" label-width="100px">
            <el-form-item label="文章标题" prop="title">
              <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="文章分类" prop="cate_id">
              <el-select v-model="pubForm.cate_id" placeholder="请选择分类" style="width: 100%;">
                <el-option v-for="obj in cateList" :key="obj.id" :label="obj.cate_name"
                           :value="obj.id"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </el-card>
    <!-- 发表文章的 Dialog 对话框 -->
    <el-dialog
      :before-close="handleClose"
      :visible.sync="pubDialogVisible"
      fullscreen
      title="发表文章">
      <!-- 发布文章的对话框 -->
      <el-form ref="pubFormRef" :model="pubForm" :rules="pubFormRules" label-width="100px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="cate_id">
          <el-select v-model="pubForm.cate_id" placeholder="请选择分类" style="width: 100%;">
            <el-option v-for="obj in cateList" :key="obj.id" :label="obj.cate_name" :value="obj.id"></el-option>
          </el-select>
        </el-form-item>
        <!--富文本编辑器-->
        <el-form-item label="文章内容" prop="content">
          <!-- 使用 v-model 进行双向的数据绑定 -->
          <quill-editor v-model="pubForm.content"></quill-editor>
        </el-form-item>
        <!--文章封面-->
        <el-form-item label="文章封面">
          <!-- 用来显示封面的图片 -->
          <img ref="imgRef" alt="" class="cover-img" src="../../assets/images/cover.jpg"/>
          <br/>
          <!-- 文件选择框，默认被隐藏 -->
          <input ref="iptFileRef"
                 accept="image/*"
                 style="display: none;"
                 type="file"
                 @change="onCoverChangeFn"
          />
          <!-- 选择封面的按钮 -->
          <el-button type="text" @click="chooseImgFn">+ 选择封面</el-button>
        </el-form-item>
        <!--发布草稿按钮-->
        <el-form-item>
          <el-button type="primary" @click="pubArticleFn('已发布')">发布</el-button>
          <el-button type="info" @click="pubArticleFn('草稿')">存为草稿</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// 引入接口封装的方法
import { getArtCateListAPI } from '@/api'
// 导入默认的封面图片
import defaultImg from '@/assets/images/cover.jpg'

export default {
  name: 'ArtList',
  data () {
    return {
      // 查询参数对象
      q: {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      },
      // 控制对话框显示隐藏
      pubDialogVisible: false,
      // 表单的数据对象
      pubForm: {
        title: '', // 文章标题
        cate_id: '', // 分类id
        content: '', // 文章内容
        cover_img: null, // 保存的文件
        state: '' // 文章的发布状态，可选值有两个：草稿、已发布
      },
      // 表单的验证规则对象
      pubFormRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 1, max: 30, message: '文章标题的长度为1-30个字符', trigger: 'blur' }
        ],
        cate_id: [{ required: true, message: '请选择文章分类', trigger: 'change' }],
        content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }]
      },
      // 保存分类表单数据
      cateList: []
    }
  },
  // 生命周期在组件获取文章分类
  created () {
    this.getCateListFn()
  },
  methods: {
    // 对话框关闭前的回调 发表文章
    // done调用放行，关闭对话框
    async handleClose (done) {
      // 询问用户是否确认关闭对话框
      const confirmResult = await this.$confirm('此操作将导致文章信息丢失, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 取消了关闭-阻止住, 什么都不干
      if (confirmResult === 'cancel') return
      // 确认关闭
      done()
    },
    // 发表文章点击事件
    showPubDialogFn () {
      // 让发表文章对话框显示
      this.pubDialogVisible = true
    },
    // 获取文章分类接口方法
    async getCateListFn () {
      const { data: res } = await getArtCateListAPI()
      if (res.code === 0) {
        this.cateList = res.data
        // console.log(this.cateList)
      }
    },
    // 点击选择文件，文件选择窗口出现，
    chooseImgFn () {
      this.$refs.iptFileRef.click()
    },
    // 封面选择改变的事件
    onCoverChangeFn (e) {
      // 获取用户选择的文件列表
      const files = e.target.files
      if (files.length === 0) {
        // 用户没有选择封面
        this.pubForm.cover_img = null
        this.$refs.imgRef.setAttribute('src', defaultImg)
      } else {
        // 用户选择了封面
        this.pubForm.cover_img = files[0]
        // 把图片文件显示到img标签里
        const url = URL.createObjectURL(files[0])
        this.$refs.imgRef.setAttribute('src', url)
      }
    },
    // 表单里面点击发布存为草稿按钮的点击事件
    pubArticleFn (str) {
      // 设置发布状态
      this.pubForm.state = str
      // 校验表单如果没有内容，则提示
      this.$refs.pubFormRef.validate(valid => {
        // 表单预检验
        if (!valid) return this.$message.error('请完善文章信息')
        // 文章封面检验
        if (!this.pubForm.cover_img) return this.message.error('请选择文章封面')
      })
      console.log(this.pubForm)
    }
  }
}
</script>

<style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .btn-pub {
    margin-top: 5px;
  }
}

::v-deep .ql-editor {
  min-height: 300px;
}

// 设置图片封面的宽高
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}
</style>
