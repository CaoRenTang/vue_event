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
            <el-button size="small" type="primary" @click="choseFn">筛选</el-button>
            <el-button size="small" type="info" @click="resetFn">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button class="btn-pub" size="small" type="primary" @click="showPubDialogFn">发表文章</el-button>
      </div>
      <!-- 文章表格区域 -->
      <el-table :data="artList" border stripe style="width: 100%;">
        <el-table-column label="文章标题" prop="title">
          <template v-slot="scope">
            <el-link type="primary" @click="showDetailFn(scope.row.id)">{{ scope.row.title }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="分类" prop="cate_name"></el-table-column>
        <el-table-column label="发表时间" prop="pub_date">
          <template v-slot="scope">
            <span>{{ $formatDate(scope.row.pub_date) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="state"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button size="mini" type="danger" @click="removeFn(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        :current-page.sync="q.pagenum"
        :page-size.sync="q.pagesize"
        :page-sizes="[2, 3, 5, 10]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChangeFn"
        @current-change="handleCurrentChangeFn"
      >
      </el-pagination>
    </el-card>
    <!-- 发表文章的 Dialog 对话框，fullscreen控制对话框全屏显示 -->
    <el-dialog
      :before-close="handleClose"
      :visible.sync="pubDialogVisible"
      fullscreen
      title="发表文章"
      @closed="onDialogClosedFn"
    >
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
          <quill-editor v-model="pubForm.content" @blur="onEditorChangeFn"></quill-editor>
        </el-form-item>
        <!--文章封面-->
        <el-form-item label="文章封面" prop="cover_img">
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
    <!-- 查看文章详情的对话框 -->
    <el-dialog
      :visible.sync="detailVisible"
      title="文章预览"
      width="60%">
      <h1 class="title">{{ artDetail.title }}</h1>
      <div class="info">
        <span>作者：{{ artDetail.nickname || artDetail.username }}</span>
        <span>发布时间：{{ $formatDate(artDetail.pub_date) }}</span>
        <span>所属分类：{{ artDetail.cate_name }}</span>
        <span>状态：{{ artDetail.state }}</span>
      </div>
      <!-- 分割线 -->
      <el-divider></el-divider>
      <!-- 文章的封面 -->
      <img v-if="artDetail.cover_img" :src=" baseURL + artDetail.cover_img" alt=""/>
      <!-- 文章的详情 -->
      <div class="detail-box" v-html="artDetail.content"></div>
    </el-dialog>
  </div>
</template>

<script>
// 引入接口封装的方法
import { getArtCateListAPI, uploadArticleAPI, getArtListAPI, getArtDetailAPI, delArticleAPI } from '@/api'
// 导入默认的封面图片
import defaultImg from '@/assets/images/cover.jpg'
import { baseURL } from '@/utils/request'

export default {
  name: 'ArtList',
  data () {
    return {
      // 查询参数对象
      q: {
        pagenum: 1, // 默认第一页数据
        pagesize: 2, // 默认当前页显示数据条数
        cate_id: '',
        state: ''
      },
      // 控制对话框显示隐藏
      pubDialogVisible: false,
      // 控制文章详情对话框的显示和隐藏
      detailVisible: false,
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
        // 富文本验证规则
        content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
        cover_img: [{ required: true, message: '请选择封面', trigger: 'blur' }]
      },
      cateList: [], // 保存分类表单数据
      artList: [], // 文章的列表数据
      total: 0, // 总数据条数
      artDetail: {}, // 文章的详情信息对象
      baseURL // 服务器基地址
    }
  },
  // 在页面创建调用
  created () {
    // 请求分类数据，调用函数
    this.getCateListFn()
    // 获取所有的文章列表，调用函数
    this.getArtListFn()
  },
  methods: {
    // 获取所有的文章列表
    async getArtListFn () {
      const { data: res } = await getArtListAPI(this.q)
      this.artList = res.data// 保存获取的当前文章列表
      this.total = res.total// 保存总数
      // console.log(this.artList)
    },
    // done调用放行，关闭对话框，对话框关闭前的回调 发表文章
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
      // 让表单单独校验文章封面
      this.$refs.pubFormRef.validateField('cover_img')
    },
    // 表单里面点击发布存为草稿按钮的点击事件
    pubArticleFn (str) {
      // 设置发布状态
      this.pubForm.state = str
      // 校验表单如果没有内容，则提示
      this.$refs.pubFormRef.validate(async valid => {
        if (valid) {
          console.log(this.pubForm)
          const fd = new FormData()
          // 向 FormData 中追加数据
          Object.keys(this.pubForm).forEach((key) => {
            fd.append(key, this.pubForm[key])
          })
          // 发起请求
          const { data: res } = await uploadArticleAPI(fd)
          if (res.code !== 0) return this.$message.error('发布文章失败！')
          this.$message.success('发布文章成功！')
          // 关闭对话框
          this.pubDialogVisible = false
          // 重新获取列表数据
          await this.getArtListFn()
          // console.log(res)
        } else {
          return false
        }
      })
    },
    // 通过查阅文档，给富文本标签绑定change事件,利用elementUI中的Api进行部分字段的校验（validateField）
    onEditorChangeFn () {
      // 获取el-from的表单对象，部分校验字段
      this.$refs.pubFormRef.validateField('content')
    },
    // 发布完成之后清空对话框的内容
    onDialogClosedFn () {
      // 清空关键数据
      this.$refs.pubFormRef.resetFields()
      // 因为这2个变量对应的标签不是表单绑定的, 所以需要单独控制
      this.$refs.imgRef.setAttribute('src', defaultImg)
    },
    // 分页，每页条数改变触发
    // 核心思想：改变每页的条数，根据选择的页码/条数，影响q对象对应属性的值，再重新发重新返回数据
    handleSizeChangeFn (size) {
      this.q.pagesize = size
      this.q.pagenum = 1
      this.getArtListFn()
    },
    // 当前页码改变时触发
    handleCurrentChangeFn (newPage) {
      this.q.pagenum = newPage
      this.getArtListFn()
    },
    // 筛选点击事件
    choseFn () {
      this.q.pagesize = 2
      this.q.pagenum = 1
      this.getArtListFn()
    },
    // 重置
    resetFn () {
      this.q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      }
      this.getArtListFn()
    },
    // 文章标题的点击事件
    async showDetailFn (artID) {
      this.detailVisible = true // 出现详情对话框
      const { data: res } = await getArtDetailAPI(artID)
      this.artDetail = res.data
      // console.log(this.artDetail)
    },
    // 删除文章内容
    async removeFn (delID) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 2. 取消了删除
      if (confirmResult === 'cancel') return
      // 执行删除
      const { data: res } = await delArticleAPI(delID)
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      // 重新获取列表数据
      await this.getArtListFn()
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

.el-pagination {
  margin-top: 15px;
}

.title {
  font-size: 24px;
  text-align: center;
  font-weight: normal;
  color: #000;
  margin: 0 0 10px 0;
}

.info {
  font-size: 12px;

  span {
    margin-right: 20px;
  }
}

// 修改 dialog 内部元素的样式，需要添加样式穿透
::v-deep .detail-box {
  img {
    width: 500px;
  }
}
</style>
