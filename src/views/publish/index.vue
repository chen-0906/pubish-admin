<template>
  <div class="publish-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div slot="header" class="clearfix">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ $route.query.id ? '修改文章': '发布文章'}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <el-form ref="form" :model="article" label-width="40px">
        <el-form-item label="标题">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="article.content"></el-input>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="article.channel_id" placeholder="请选择频道">
            <el-option
              :label="channel.name"
              :value="channel.id"
              v-for="(channel, index) in channels"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">发表</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import { getArticleChannels, addArticle, updateArticle, getArticle } from "@/api/article";

  export default {
  name: 'PublishIndex',
  props: {},
  components: {
  },
  data () {
    return {
      channels: [],
      article: {
        title: '', // 文章标题
        content : '', // 文章内容
        cover : { // 文章封面
          type : 0, // 封面类型 -1:自动，0-无图，1-1张，3-3张
          images: [] // 封面图片的地址
        },
        channel_id: null
      },
      article_id: null
    }
  },
  computed: {
  },
  created() {
    this.loadChannels()

    // 由于我们让发布和修改使用的是 同一个组件
    // 所以这里要判断
    // 如果路由参数中有 id  则请求展示文章内容
    if (this.$route.query.id) {
      this.loadArticle()
    }
  },
  mounted() {},
  watch: {
  },
  methods: {
    onPublish(draft = false) {
      if (this.article_id){
        updateArticle(this.article_id, this.article, draft).then(res => {
          console.log(res)
          this.$message({
            message: `${draft ? '存入草稿' : '发布'}成功`,
            type: 'success'
          })
          // 跳转到内容管理页面
          this.$router.push('/article')
        })
      }else {
        // 找到数据接口
        addArticle(this.article, draft).then(res => {
          console.log(res)
          this.$message({
            message: `${draft ? '存入草稿' : '发布'}成功`,
            type: 'success'
          })
          // 跳转到内容管理页面
          this.$router.push('/article')
        })
      }
    },
    loadChannels () {
      getArticleChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },
    loadArticle () {
      // 修改文章 加载文章内容
      this.article_id = this.$route.query.id.toString()
      getArticle(this.article_id).then(res => {
        //this.article = res.data.data
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

</style>
