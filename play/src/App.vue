<template>
  <!-- If you want to apply a custom namespace, uncomment the following and apply the css configuration in `vite.config.ts`. -->
  <!-- <el-config-provider namespace="ep"> -->
  <div
    class="play-container"
    style="
      padding: 10px;
      border-bottom: 1px solid;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      min-height: 300px;
    "
  >
    <el-button plain @click="dialogVisible = true"> Dialog </el-button>

    <el-dialog
      v-model="dialogVisible"
      title="Tips"
      width="500"
      :before-close="handleClose"
    >
      <span>This is a message</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-tooltip
      class="box-item"
      effect="dark"
      content="Top Left prompts info"
      placement="top-start"
    >
      <el-button>tooltip</el-button>
    </el-tooltip>

    <el-popover
      placement="top-start"
      title="Title"
      :width="200"
      trigger="hover"
      content="this is content, this is content, this is content"
    >
      <template #reference>
        <el-button class="m-2">popover</el-button>
      </template>
    </el-popover>

    <el-button plain @click="open1"> 通知 </el-button>

    <el-popconfirm title="Are you sure to delete this?">
      <template #reference>
        <el-button>popconfirm</el-button>
      </template>
    </el-popconfirm>

    <el-button type="primary" style="margin-left: 16px" @click="drawer = true">
      抽屉
    </el-button>

    <el-dropdown>
      <el-button> Dropdown List </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>Action 1</el-dropdown-item>
          <el-dropdown-item>Action 2</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-dropdown :tooltip-props="{ showArrow: false, offset: 0 }">
      <el-button> Dropdown List </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>Action 1</el-dropdown-item>
          <el-dropdown-item>Action 2</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-select v-model="value" placeholder="Select" style="width: 240px">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />

      <template #footer> footer </template>
    </el-select>

    <el-image
      style="width: 100px; height: 100px"
      :src="url"
      :zoom-rate="1.2"
      :max-scale="7"
      :min-scale="0.2"
      :preview-src-list="srcList"
      :initial-index="4"
      fit="cover"
    />
  </div>
  <el-drawer v-model="drawer" title="I am the title" :with-header="false">
    <span>Hi there!</span>
  </el-drawer>
  <!-- </el-config-provider> -->
</template>

<script setup lang="ts">
import { getCurrentInstance, h, ref } from 'vue'
import { ElMessageBox, ElNotification } from '@element-plus/components'
import { useAppRoot } from '@element-plus/hooks'
const drawer = ref(false)
const { appContext } = getCurrentInstance()!

const appRoot = useAppRoot()

const dialogVisible = ref(false)

const handleClose = (done: () => void) => {
  ElMessageBox(
    {
      title: 'title',
      message: 'Are you sure to close this dialog?',
      appendTo: appRoot,
    },
    appContext
  )
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}

const open1 = () => {
  ElNotification({
    title: 'Title',
    message: h('i', { style: 'color: teal' }, 'This is a reminder'),
    appendTo: appRoot,
    appContext,
  })
}

const value = ref('')

const options = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]

const url =
  'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'
const srcList = [
  'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
  'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
  'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
  'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
  'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
  'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
  'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
]
</script>

<style lang="scss">
html,
body {
  width: 100vw;
  height: 100vh;
  margin: 0;

  #play {
    height: 100%;
    width: 100%;

    .play-container {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
