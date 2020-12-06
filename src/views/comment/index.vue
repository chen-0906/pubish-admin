<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!--
      1. 把数据列表当顶给表格data
      2. 设计表格列
      3. 给表格列绑定要渲染的数据字段
          -->
      <el-table
        class="table-list"
        :data="articles"
        style="width: 100%"
        stripe
      >
        <el-table-column
          prop="title"
          label="标题">
        </el-table-column>
        <el-table-column
          prop="total_comment_count"
          label="总评论数">
        </el-table-column>
        <el-table-column
          label="粉丝评论数据"
          prop="fans_comment_count">
        </el-table-column>
        <el-table-column
          label="评论状态">
          <template slot-scope="scope">
            {{ scope.row.comment_status ? '正常' : '关闭'}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <!-- 开关组件绑定的数据是一个布尔值，它会根据布尔值的真假来决定开关状态 -->
            <el-switch
              v-model="scope.row.comment_status"
              :disabled="scope.row.statusDisabled"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="onStatusChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <!--
       绑定页码
       绑定每页大小
       current-page 控制激活的页码，初始肯定是第 1 页
       page-sizes 控制可选的每页大小
      -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  import { getArticles, updateCommentStatus } from "@/api/article";

  export default {
  name: 'CommentIndex',
  props: {},
  components: {
  },
  data () {
    return {
      articles: [], // 文章数据列表
      totalCount : 0,// 总数据条数
      pageSize : 10,
      page : 1  // 当前激活的页码默认是1
    }
  },
  computed: {
  },
  created() {
    this.loadArticles()
  },
  mounted() {},
  watch: {
  },
  methods: {
    handleSizeChange(val) {
      this.loadArticles(1, val)
    },
    handleCurrentChange(page) {
      // 页码给变 加载指定数据
      this.loadArticles(page)
    },
    loadArticles(page = 1){
      this.page = page
      getArticles({
        response_type : 'comment',
        page,
        per_page : this.pageSize
      }).then(res => {
        const results = res.data.data.results
        results.forEach(item => {
          item.statusDisabled = false
        })
        this.articles  = results
        this.totalCount = res.data.data.total_count
      })
    },
    onStatusChange (article) {
      // 禁用开关
      article.statusDisabled = true

      // 请求提交修改
      updateCommentStatus(article.id.toString(), article.comment_status).then(res => {
        // 启用开关
        article.statusDisabled = false
        this.$message({
          type: 'success',
          message: article.comment_status ? '开启文章评论状态' : '关闭文章评论状态'
        })
      }).catch(err => {
        article.statusDisabled = false
        this.$message({
          type: 'warning',
          message: article.comment_status ? '开启文章评论状态失败' : '关闭文章评论状态失败'
        })
        article.comment_status = !article.comment_status
      })
    }
  },
  filters: {
    fnName: function (value) {
      return value
    }
  }
}
</script>

<style scoped lang="less">
  .table-list{
    margin-bottom: 30px;
  }
</style>
