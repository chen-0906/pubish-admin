<template>
  <div class="image-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
          <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
        </el-breadcrumb>
        <!-- /面包屑路径导航 -->
      </div>
      <div class="action-head">
        <el-radio-group v-model="collect" @change="loadImages(1)" size="mini">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button size="mini" type="success" @click="dialogUploadVisible = true">上传素材</el-button>
      </div>
      <!-- 素材列表 -->
      <el-row :gutter="20">
        <el-col
          class="image-item"
          :xs="12" :sm="6" :md="6" :lg="4"
          v-for="(img, index) in images"
          :key="index"
        >
          <el-image
            style="height: 100px"
            :src="img.url"
            fit="cover"
          ></el-image>
          <div class="image-action">
            <el-button
              type="warning"
              :icon="img.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
              size="mini"
              circle
              @click="onCollect(img)"
              :loading="img.loading"
            >
            </el-button>
            <el-button
              size="small"
              type="danger"
              icon="el-icon-delete-solid"
              circle
              :loading="img.loading"
              @click="onDelete(img)"
            ></el-button>
<!--            <i :class="{-->
<!--              'el-icon-star-on' : img.is_collected,-->
<!--              'el-icon-star-off' : !img.is_collected-->
<!--            }"-->
<!--               @click="onCollect(img)"-->
<!--            ></i>-->
<!--            <i class="el-icon-delete-solid"></i>-->
          </div>
        </el-col>
      </el-row>
      <el-pagination
        :current-page.sync="page"
        style="margin-top: 30px"
        background
        layout="prev, pager, next"
        :total="totalCount"
        :page-size="pageSize"
        @current-change = "onPageChange"
      >
      </el-pagination>
    </el-card>

    <el-dialog title="上传素材"
               :visible.sync="dialogUploadVisible"
               :append-to-body="true"
    >
        <!--
             upload 组件本身就支持请求上传操作，不用自己发 自动会发
             请求方法： POST
             请求路劲： action 必须写完整路劲
             请求头： headers
             -->
      <el-upload
        class="upload-demo"
        drag
        :headers="uploadHeaders"
        name="image"
        :show-file-list="false"
        :on-success="opUploadSuccess"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>

  </div>
</template>

<script>
  import { getImages, collectImage, deleteImage } from '@/api/image'
export default {
  name: 'ImageIndex',
  props: {},
  components: {
  },
  data () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      collect : false, // 默认查询全部素材列表
      radio1: '全部',
      images : [],  // 图片素材列表
      dialogUploadVisible : false, //上传可见性
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`
      },
      totalCount : 0,
      pageSize: 24,
      page: 1 //当前页码
    }
  },
  computed: {
  },
  created() {
    this.loadImages(1)
  },
  mounted() {},
  watch: {
  },
  methods: {
    loadImages(page) {
      // 重置 高亮页码
      this.page = page
      getImages({
        collect: this.collect,
        page,
        per_page :this.pageSize
      }).then(res => {
        const results = res.data.data.results
        results.forEach(img => {
          // img 对象本来没有 loading 数据
          // 我们这里收到的往里面添加该数据是用来控制每个收藏按钮的 loading 状态
          img.loading = false
        })
        this.images = results
        this.totalCount = res.data.data.total_count
      })
    },
    opUploadSuccess(){
      // 关闭对话框
      this.dialogUploadVisible = false
      // 更新素材列表
      this.loadImages()
      this.$message({
        type: 'success',
        message: '上传成功'
      })
    },
    onPageChange(page) {
      this.loadImages(page)
    },
    onCollect (img) {
      // 已收藏， 取消收藏
      // 没有收藏，添加收藏
      img.loading = true
      collectImage(img.id, !img.is_collected).then(res => {
        img.is_collected = !img.is_collected
        img.loading = false
      })
    },
    onDelete(img) {
      img.loading = true
      this.$confirm('是否确认删除？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '放弃'
      })
        .then(() => {
          deleteImage(img.id).then(res => {
            this.loadImages(this.page)
          })
          this.$message({
            type: 'info',
            message: '删除成功'
          });
        })
        .catch(action => {
          this.$message({
            type: 'info',
            message: "已取消"
          })
        });
      img.loading = false
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
  .action-head{
    padding-bottom: 30px;
    display: flex;
    justify-content: space-between;
  }

  .image-item {
    position: relative;
  }

  .image-action{
    font-size: 25px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    color: #fff;
    height: 40px;
    background-color: rgba(204, 204, 204, .5);
    position: absolute;
    bottom: 4px;
    left: 10px;
    right: 10px;
  }
</style>
