<template>
  <div>
    <section class="showcase">
      <div class="video-container">
        <video
          src="https://traversymedia.com/downloads/video.mov"
          autoplay
          muted
          loop
        ></video>
      </div>

      <div class="content">
        <h1 class="title">Excel Tool</h1>
        <div class="main-container">
          <div class="btn-group">
            <a
              href="#about"
              class="btn"
              v-for="(item, idx) in Object.keys(excel_type)"
              :key="idx"
              @click="changeStatus(excel_type[item].type,item)"
              >{{ item }}</a
            >
          </div>
          <div
            :class="[
              'upload-container',
              current.type === 0
                ? 'container-center center-background-color'
                : 'left-background-color',
            ]"
          >
            <template v-if="current.type === 0">
              <a-empty description="请选择类别开始上传" />
            </template>
            <template v-else>
              <div style="text-align:left;">
               <h3 style="color:#ffffff;">{{current.title}}</h3>
              </div>
              <div style="height:40%;padding-top:30px;">
                <a-upload
                  name="file"
                  action="/api/upload"
                  :file-list="fileList"
                  @change="handleChange"
                  :remove="handleRemove"
                  :data="{ type: current.type }"
                >
                  <a-button type="primary" :disabled="fileList.length === current.length">
                    <a-icon type="upload" /> 选择上传文件
                  </a-button>
                </a-upload>
                <div class="control-button-group">
                  <a-button
                    type="primary"
                    v-if="fileList.length === current.length"
                    @click="turn"
                    :loading="spinning"
                    >转化</a-button
                  ><a-button
                    type="primary"
                    style="margin-left:20px;"
                    v-if="
                      turnStatus &&
                        fileList.length === current.length
                    "
                    @click="download"
                    >下载</a-button
                  >
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "APP",
  data() {
    return {
      headers: {
        authorization: "authorization-text",
      },
      delayTime: 500,
      fileList: [],
      flieName: "",
      turnStatus: false,
      spinning: false,
      current:{
        type:0,
        length:0,
        color:'',
        title:'亮迪对账'
      },
      excel_type: {
        亮迪对账: {
          type: 1,
          length: 2,
        },
        导入ERP: {
          type: 2,
          length: 1,
        },
        年度统计: {
          type: 3,
          length: 1,
        },
        合并腾讯云文档: {
          type: 4,
          length: 1,
        },
      },
    };
  },
  methods: {
    changeStatus(type,key) {
      if (this.excelType !== type) this.fileList = [];
      this.current = {...this.excel_type[key],title:key};
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
      this.turnStatus && (this.turnStatus = false);
    },
    handleChange(info) {
      this.fileList = info.fileList;
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        this.$message.success(`${info.file.name} 上传成功`);
      } else if (info.file.status === "error") {
        this.$message.error(`${info.file.name} 上传失败`);
      }
    },
    turn() {
      this.spinning = true;
      axios({
        method: "post",
        url: "/api/turn",
        data: {
          type: this.current.type,
          filename:this.current.title
        },
      })
        .then((res) => {
          const { fileName, code } = res.data;
          code === 200 && (this.turnStatus = true);
          this.flieName = fileName;
          this.$message.success("转化成功");
        })
        .catch(() => {
          this.$message.error("转化失败，请确保上传正确的excel文件！");
        })
        .finally(() => {
          this.spinning = false;
        });
    },
    download() {
      window.open(`/api/download/${this.current.title}.xlsx`, "_blank");
    },
  },
};
</script>
<style lang="scss">
:root {
  --primary-color: #3a4052;
  --upload-container-color: #ffffff;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Open Sans", sans-serif;
  line-height: 1.5;
}

a {
  text-decoration: none;
  color: var(--primary-color);
}

h1 {
  font-weight: 300;
  font-size: 60px;
  line-height: 1.2;
  margin-bottom: 15px;
}

.showcase {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
  padding: 0 20px;
}

.video-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--primary-color)
    url("https://traversymedia.com/downloads/cover.jpg") no-repeat center
    center/cover;
}

.video-container video {
  min-width: 100%;
  min-height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  object-fit: cover;
}

.control-button-group {
  margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: space-round;
}

.video-container:after {
  content: "";
  z-index: 1;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
}

.content {
  z-index: 2;
  min-width: 50%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.main-container {
  margin-top: 35%;
  width: 100%;
  display: flex;
}

.btn-group {
  width: 200px;
  display: flex;
  flex-direction: column;
  margin-right: 100px;
}
.upload-container {
  width: 600px;
  height: 250px;
  padding: 10px 30px;
  color: #fff;
  border-radius: 5px;
  border: solid #fff 1px;
  opacity: 0.7;
}
.container-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.center-background-color {
  background: var(--primary-color);
}
.left-background-color {
  background: var(--primary-color);
}

.btn {
  display: inline-block;
  padding: 10px 30px;
  background: var(--primary-color);
  color: #fff;
  border-radius: 5px;
  border: solid #fff 1px;
  margin-bottom: 25px;
  opacity: 0.7;
}

.btn:hover {
  transform: scale(0.98);
}

#about {
  padding: 40px;
  text-align: center;
}

#about p {
  font-size: 1.2rem;
  max-width: 600px;
  margin: auto;
}

#about h2 {
  margin: 30px 0;
  color: var(--primary-color);
}

.social a {
  margin: 0 5px;
}
.ant-upload-list {
  color: #ffffff;
  &:hover {
    color: #000000;
    .ant-upload-list-item-info .anticon-paper-clip {
      color: #000000;
    }
  }
}
.ant-upload-list-item-info .anticon-paper-clip {
  color: #ffffff;
}

.title {
  font-family: "Arial Rounded MT Bold", "Helvetica Rounded", Arial, sans-serif;
  text-transform: uppercase;
  display: block;
  font-size: 92px;
  color: #45b97c;
  text-shadow: 0 8px 9px #77ac98, 0px -2px 1px #fff;
  font-weight: bold;
  letter-spacing: -4px;
  text-align: center;
  position: absolute;
  padding: 100px 200px;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 20px;
}
</style>
