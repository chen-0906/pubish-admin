<template>
  <div class="article-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form ref="form" :model="form" label-width="50px" size="mini">
        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channelId" placeholder="请选择频道">
            <el-option
              label="全部"
              :value="null"
            >
            </el-option>
            <el-option
              :label="channel.name"
              :value="channel.id"
              v-for="(channel, index) in channels"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="rangeDate"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <!--button按钮的 click事件有个默认参数
          当不指定参数时 会传递一个默认的没用的参数-->
          <el-button
            type="primary"
            @click="loadArticles(1)"
            :disabled="loading"
          >查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据列表 -->
    <!--
      Table 表格组件
      1、把需要展示的数组列表数据绑定给 table 组件的 data 属性
        注意：你不用去 v-for 遍历，它自己会遍历
      2、设计表格列 el-table-column
        width 可以设定表格列的宽度
        label 可以设定列的标题
        prop  用来设定要渲染的列表项数据字段，只能展示文本

      3、表格列默认只能渲染普通文本，如果需要展示其它内容，例如放个按钮啊、放个图片啊，那就需要自定义表格列模板了：https://element.eleme.cn/#/zh-CN/component/table#zi-ding-yi-lie-mo-ban
     -->

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        根据筛选条件共查询到 {{totalCount}} 条结果：
      </div>
      <!-- 数据列表 -->
      <el-table
        v-loading = "loading"
        :data="articles"
        stripe
        style="width: 100%"
        class="list-table"
        size="mini"
      >
        <el-table-column
          prop="date"
          label="封面">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.cover.images[0]"
              lazy
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题">
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <el-tag
              :type="articleStatus[scope.row.status].type">
              {{ articleStatus[scope.row.status].text}}
            </el-tag>
<!--            <el-tag v-if="scope.row.status === 0" type="warning">草稿</el-tag>-->
<!--            <el-tag v-else-if="scope.row.status === 1">待审核</el-tag>-->
<!--            <el-tag v-else-if="scope.row.status === 2" type="success">审核通过</el-tag>-->
<!--            <el-tag v-else-if="scope.row.status === 3" type="danger">审核失败</el-tag>-->
<!--            <el-tag v-else-if="scope.row.status === 4" type="info">已删除</el-tag>-->
          </template>
        </el-table-column>
        <el-table-column
          prop="pubdate"
          label="发布时间">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              circle
              icon="el-icon-edit"
              type="primary"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="onDeleteArticle(scope.row.id)"
              circle
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- /数据列表 -->

      <!-- 列表分页 -->
      <el-pagination
        @current-change="onCurrentChange"
        layout="prev, pager, next"
        background
        :current-page.sync="page"
        :disabled="loading"
        :page-size="pageSize"
        :total="totalCount">
      </el-pagination>
      <!-- /列表分页 -->
    </el-card>
  </div>
</template>

<script>
  import { getArticles, getArticleChannels, deleteArticle } from '@/api/article'
export default {
  name: 'ArticleIndex',
  props: {},
  components: {
  },
  data () {
    return {
      form: {
        des : ''
      },
      articles: [],
      articleStatus: [
        { status: 0, text: '草稿', type: 'info' }, // 0
        { status: 1, text: '待审核', type: '' }, // 1
        { status: 2, text: '审核通过', type: 'success' }, // 2
        { status: 3, text: '审核失败', type: 'warning' }, // 3
        { status: 4, text: '已删除', type: 'danger' } // 4
      ],
      totalCount : 0,
      pageSize : 20,
      status : null, // 文章的状态 不传就是全部
      channels: [], //文章的频道列表
      channelId : null, // 查询文章的频道
      rangeDate : null, // 筛选的范围日期
      loading : true, // 表单中数据加载中 loading
      page : 1 // 当前页码
    }
  },
  computed: {
  },
  created() {
    this.loadArticles(1)
    this.loadChannels()
  },
  mounted() {

  },
  watch: {
  },
  methods: {
    loadArticles (page = 1) {
      //展示加载中 loading
      this.loading = true
      this.$message({
        type: 'success',
        message : '查询成功'
      })
      getArticles({
        page,
        per_page : this.pageSize,
        status : this.status,
        channel_id : this.channelId,
        begin_pubdate : this.rangeDate ? this.rangeDate[0] : null,
        end_pubdate : this.rangeDate ? this.rangeDate[1] : null
      }).then(res => {
        // 解构  前面是真正的数据名称 后面是我们定义的
        const { results, total_count : totalCount } = res.data.data
        this.articles = results
        this.totalCount = totalCount
        this.loading = false
      })
    },
    onCurrentChange(page) {
      this.loadArticles(page)
    },
    loadChannels () {
      getArticleChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },

    onDeleteArticle(articleId){
      this.$confirm('确认删除吗？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确认执行这里
        deleteArticle(articleId.toString()).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.loadArticles(this.page)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
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
  .filter-card {
    margin-bottom: 30px;
  }

  .list-table {
    margin-bottom: 20px;
  }
</style>
