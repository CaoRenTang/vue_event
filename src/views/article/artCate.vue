<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button size="mini" type="primary">添加分类</el-button>
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
  </div>
</template>

<script>
import { getArtCateListAPI } from '@/api'

export default {
  name: 'ArtCate',
  data () {
    return {
      // 文章的分类数组
      cateList: []
    }
  },
  created () {
    this.getArtCateFn()
  },
  methods: {
    async getArtCateFn () {
      const res = await getArtCateListAPI()
      console.log(res) // 请求到的对象
      this.cateList = res.data.data
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
