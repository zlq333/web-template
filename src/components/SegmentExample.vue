<template>
  <div class="segment-example-page">
    <div class="font-size26 text-c">Segment使用示例</div>
    <div class="item-header">纯html用法示例</div>
    <div class="fe-segment example-segment">
      <div class="fe-segment-header">我是标题</div>
      <div class="fe-segment-area flex-area" :span="3">
        <div class="fe-segment-item">
          <div class="fe-segment-label">文案超长</div>
          <div class="fe-segment-content" title="文案超长自动省略文案超长自动省略文案超长自动省略文案超长自动省略">
            文案超长自动省略文案超长自动省略文案超长自动省略文案超长自动省略
          </div>
        </div>
        <div class="fe-segment-item">
          <div class="fe-segment-label">红色</div>
          <div class="fe-segment-content font-red">请输入帐号密码</div>
        </div>
        <div class="fe-segment-item">
          <div class="fe-segment-label">绿色</div>
          <div class="fe-segment-content font-green">操作成功</div>
        </div>
        <div class="fe-segment-item">
          <div class="fe-segment-label">橘色</div>
          <div class="fe-segment-content font-orange">12975.32</div>
        </div>
        <div class="fe-segment-item">
          <div class="fe-segment-label">主题色</div>
          <div class="fe-segment-content font-default">跟随主题的颜色</div>
        </div>
        <div class="fe-segment-item">
          <div class="fe-segment-label">其他信息</div>
          <div class="fe-segment-content">{{ loginTime }}</div>
        </div>
        <div class="fe-segment-line"></div>
        <div class="fe-segment-item">
          <div class="fe-segment-label">label色</div>
          <div class="fe-segment-content font-label">我是label色</div>
        </div>
        <div class="fe-segment-item">
          <div class="fe-segment-label">文字灰色</div>
          <div class="fe-segment-content font-gray">我是灰色文字</div>
        </div>
        <div class="fe-segment-item row-width">
          <div class="fe-segment-label">占满整行</div>
          <div class="fe-segment-content">
            占满整行占满整行占满整行占满整行占满整行占满整行占满整行占满整行占满整行占满整行占满整行占
          </div>
        </div>
        <div class="fe-segment-item">
          <div class="fe-segment-label">当前时间</div>
          <div class="fe-segment-content">{{ loginTime }}</div>
        </div>
        <div class="fe-segment-item" colspan="2">
          <div class="fe-segment-label">跨域两列</div>
          <div class="fe-segment-content">跨域两列跨域两列跨域两列跨域两列跨域两列</div>
        </div>
        <div class="fe-segment-item">
          <div class="fe-segment-label">当前时间</div>
          <div class="fe-segment-content">{{ loginTime }}</div>
        </div>
        <div class="fe-segment-item">
          <div class="fe-segment-label">当前时间</div>
          <div class="fe-segment-content">{{ loginTime }}</div>
        </div>
        <div class="fe-segment-item">
          <div class="fe-segment-label">当前时间</div>
          <div class="fe-segment-content">{{ loginTime }}</div>
        </div>

        <div class="fe-segment-item warp">
          <div class="fe-segment-label">超长换行</div>
          <div class="fe-segment-content">
            超长换行超长换行超长换行超长换行超长换行超长换行超长换行超长换行超长换行超长换行超长换行超长换行超长换行超长换行超长换行
          </div>
        </div>
        <div class="fe-segment-item">
          <div class="fe-segment-label">当前时间</div>
          <div class="fe-segment-content">{{ loginTime }}</div>
        </div>
        <div class="fe-segment-item">
          <div class="fe-segment-label">当前时间</div>
          <div class="fe-segment-content">{{ loginTime }}</div>
        </div>
        <div class="fe-segment-item has-link">
          <div class="fe-segment-label">营业资质</div>
          <div class="fe-segment-content">武汉物易云通网络科技有限公司</div>
          <div class="fe-segment-link">
            <div class="the-link" @click="showViewer(imgSrc3)">查看</div>
          </div>
        </div>

        <div class="fe-segment-item">
          <div class="fe-segment-label">当前时间</div>
          <div class="fe-segment-content">{{ loginTime }}</div>
        </div>
        <div class="fe-segment-item">
          <div class="fe-segment-label">当前时间</div>
          <div class="fe-segment-content">{{ loginTime }}</div>
        </div>
        <div class="fe-segment-item is-image">
          <div class="fe-segment-label">图片展示</div>
          <div class="fe-segment-content">
            <img class="img-preview-item" :src="imgSrc1.src" @click="showViewer(imgSrc1)" />
            <img class="img-preview-item" :src="imgSrc2.src" @click="showViewer(imgSrc2)" />
            <br />
            <el-button type="primary" @click="showViewerAll">多图查看</el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="item-header">使用示例</div>
    <fe-segment :flexAreaSpan="2" title="InlineHeader" :showExpand="true">
      <div>内容区域自定义</div>
    </fe-segment>

    <fe-segment :flexAreaSpan="2" title="OutlineHeader" headerType="outline" :showExpand="true" labelWidth="200px">
      <fe-segment-item :items="segmentData">
        <!-- 字段key1的Label插槽 -->
        <template #key1Label="{ scope }">
          <span class="font-red">{{ scope.label }}</span>
        </template>
        <!-- 字段key4 带查看链接 -->
        <template #key4Link="{ scope }">
          <span class="font-blue pointer" @click="showLink(scope)">点我查看</span>
        </template>
        <!-- 字段key5 用content插槽自定义图片预览 -->
        <template #key6="{ scope }">
          <fe-image-preview :imageList="scope.content"></fe-image-preview>
        </template>
        <!-- 字段key7 用content插槽自定义任何内容 -->
        <template #key7="{ scope }">
          {{ scope.content }}
          <span class="font-red">哈哈哈</span>
        </template>
      </fe-segment-item>
    </fe-segment>

    <div class="item-header">支持属性</div>
    <el-table :data="segmentAttr" style="width: 1000px" border>
      <el-table-column prop="attr" label="参数" min-width="150"> </el-table-column>
      <el-table-column prop="memo" label="说明" min-width="280"> </el-table-column>
      <el-table-column prop="type" label="类型" min-width="180"> </el-table-column>
      <el-table-column prop="impossible" label="可选值" min-width="150"> </el-table-column>
      <el-table-column prop="default" label="默认值" min-width="150"> </el-table-column>
    </el-table>

    <div class="item-header">SegmentItem属性</div>
    <el-table :data="segmentItemAttr" style="width: 1000px" border>
      <el-table-column prop="attr" label="参数" min-width="150"> </el-table-column>
      <el-table-column prop="memo" label="说明" min-width="280"> </el-table-column>
      <el-table-column prop="type" label="类型" min-width="180"> </el-table-column>
      <el-table-column prop="impossible" label="可选值" min-width="150"> </el-table-column>
      <el-table-column prop="default" label="默认值" min-width="150"> </el-table-column>
    </el-table>

    <div class="item-header">ImagePreview属性</div>
    <el-table :data="imagePreviewAttr" style="width: 1000px" border>
      <el-table-column prop="attr" label="参数" min-width="150"> </el-table-column>
      <el-table-column prop="memo" label="说明" min-width="280"> </el-table-column>
      <el-table-column prop="type" label="类型" min-width="180"> </el-table-column>
      <el-table-column prop="impossible" label="可选值" min-width="150"> </el-table-column>
      <el-table-column prop="default" label="默认值" min-width="150"> </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { reactive, ref, defineComponent } from 'vue';
import { useGlobalStore } from '@/store/globalStore';
import { thousands, valueToLabel } from '@fe/filter';

export default defineComponent({
  setup() {
    const globalStore = useGlobalStore();
    const loginTime = ref('2021-02-20 16:32:23');
    const imgSrc1 = reactive({
      src: 'https://scpic.chinaz.net/files/pic/pic9/202010/hpic3089.jpg',
      title: '凭证1'
    });
    const imgSrc2 = reactive({
      src: 'https://scpic.chinaz.net/files/pic/pic9/202007/hpic2733.jpg',
      title: '凭证2'
    });
    const imgSrc3 = reactive({
      src: 'https://scpic.chinaz.net/files/pic/pic9/202008/bpic21095.jpg',
      title: '营业资质'
    });

    const showViewer = (item: any) => {
      globalStore.showViewer({ data: [{ url: item.src, title: item.title }] });
    };
    const showViewerAll = () => {
      globalStore.showViewer({
        data: [
          { url: imgSrc1.src, title: imgSrc1.title },
          { url: imgSrc2.src, title: imgSrc2.title }
        ]
      });
    };

    const showLink = (item: SegmentItem) => {
      console.log(item, 'call');
      showViewer(imgSrc3);
    };
    const stateDict = [
      { label: '已完成', value: 1 },
      { label: '未完成', value: 0 }
    ];
    const segmentData = reactive([
      {
        prop: 'key1',
        label: '自定义label插槽',
        content: '总有刁民想害朕',
        showTitle: true
      },
      {
        prop: 'key2',
        label: 'content为金额数字',
        content: '12353.2171',
        contentClass: 'font-orange',
        unit: '元',
        filter: thousands,
        showTitle: true
      },
      {
        prop: 'key3',
        label: '字典过滤器',
        content: 1,
        contentClass: 'font-green',
        filter: valueToLabel,
        filterParams: [stateDict]
      },
      {
        prop: 'key4',
        label: '查看凭证(需自定义slot)',
        hasLink: true,
        content: '武汉物易云通网络科技有限公司'
      },
      {
        prop: 'key5',
        label: '图片内容 fill填充',
        isImage: true,
        showNoImage: false,
        colspan: 2,
        content: [
          'https://scpic.chinaz.net/files/pic/pic9/202008/error.jpg',
          'https://scpic.chinaz.net/files/pic/pic9/202008/bpic21095.jpg',
          'https://scpic.chinaz.net/files/pic/pic9/201908/bpic13137.jpg',
          'https://scpic.chinaz.net/files/pic/pic9/201903/bpic10909.jpg'
        ]
        // content:'https://scpic.chinaz.net/files/pic/pic9/202008/bpic21095.jpg' // content支持字符串单图
      },
      {
        prop: 'key6',
        label: '图片内容 slot自己控制',
        isImage: true,
        content: [
          { url: 'https://scpic.chinaz.net/files/pic/pic9/202004/zzpic24622.jpg', title: '看我的标题', fit: 'contain' },
          'https://scpic.chinaz.net/files/pic/pic9/202008/error.jpg',
          { url: 'https://scpic.chinaz.net/files/pic/pic9/202007/hpic2663.jpg', fit: 'cover' },
          'https://scpic.chinaz.net/files/pic/pic9/202001/zzpic22950.jpg'
        ]
      },
      {
        label: '自定义content',
        prop: 'key7',
        content: '我是自定义内容'
      },
      {
        // label: '无label',
        prop: 'key8',
        isImage: true,
        colspan: 3,
        content: [],
        hidden: true
      }
    ]);

    const segmentAttr = [
      { attr: 'showExpand', memo: '是否启用展开收起', type: 'Boolean', impossible: '-', default: false },
      { attr: 'isExpand', memo: '控制展开收起', type: 'Boolean', impossible: '-', default: 'true展开' },
      { attr: 'title', memo: 'header标题', type: 'String', impossible: '-', default: '' },
      {
        attr: 'headerType',
        memo: 'segment-header展示类型 inline内联 outline外部',
        type: 'String',
        impossible: 'inline/outline',
        default: 'inline'
      },
      { attr: 'flexAreaSpan', memo: '内容区域分多少等分', type: 'Number', impossible: '1/2/3/4', default: 2 },
      { attr: 'labelWidth', memo: 'segment-label的宽度', type: 'String', impossible: '-', default: '120px' },
      { attr: 'segmentClass', memo: 'segment的自定义类名', type: 'String', impossible: '-', default: '' },
      { attr: 'headerClass', memo: 'segment-header的自定义类名', type: 'String', impossible: '-', default: '' },
      { attr: 'areaClass', memo: 'segment-area的自定义类名', type: 'String', impossible: '-', default: '' }
    ];

    const segmentItemAttr = [
      { attr: 'items', memo: 'SegmentItem配置项', type: 'SegmentItem[]', impossible: '-', default: '[]' },
      { attr: 'items.itemClass', memo: 'segment-item的自定义类名', type: 'String', impossible: '', default: '' },
      { attr: 'items.label', memo: 'label 支持slot', type: 'String', impossible: '', default: '' },
      { attr: 'items.labelClass', memo: 'segment-label的自定义类名', type: 'String', impossible: '', default: '' },
      { attr: 'items.labelSlot', memo: 'label slot名称', type: 'String', impossible: '', default: '' },
      { attr: 'items.content', memo: '内容content 支持slot', type: 'any', impossible: '-', default: '' },
      { attr: 'items.contentClass', memo: 'segment-content的自定义类名', type: 'String', impossible: '', default: '' },
      { attr: 'items.contentSlot', memo: 'content slot名称', type: 'String', impossible: '', default: '' },
      { attr: 'items.colspan', memo: '跨列 列数', type: 'Number', impossible: '-', default: '1' },
      {
        attr: 'items.isImage',
        memo: 'content内容是否是图片 为true时content必须是一个url数组。预览默认多图模式 fill填充，若有其他需求请使用contentSlot',
        type: 'Boolean',
        impossible: '-',
        default: 'false'
      },
      {
        attr: 'items.showNoImage',
        memo: 'content是图片时  是否显示暂无图片',
        type: 'Boolean',
        impossible: '-',
        default: 'true'
      },
      { attr: 'items.hasLink', memo: 'content内容有查看凭证 支持slot', type: 'Boolean', impossible: '-', default: '' },
      { attr: 'items.linkTitle', memo: '查看凭证文字按钮的文案', type: 'String', impossible: '-', default: '查看' },
      {
        attr: 'items.linkCallback',
        memo: '查看凭证点击回调  入参当前item',
        type: 'Function',
        impossible: '-',
        default: ''
      },
      { attr: 'items.linkSlot', memo: 'link slot名称', type: 'String', impossible: '', default: '' }
    ];

    const imagePreviewAttr = [
      { attr: 'imageList', memo: '预览数据源', type: 'ImagePreivew[]或者string[]', impossible: '-', default: '[]' },
      { attr: 'lazy', memo: '是否开启懒加载', type: 'Boolean', impossible: '', default: 'false' },
      {
        attr: 'fit',
        memo: '图片显示模式 参考element-plus fit',
        type: 'String',
        impossible: 'fill/contain/cover/none/scale-down',
        default: 'fill'
      },
      { attr: 'multiple', memo: '开启多图预览', type: 'Boolean', impossible: '', default: 'true' },
      { attr: 'showNoImage', memo: '是否显示暂无图片', type: 'Boolean', impossible: '', default: 'true' }
    ];
    return {
      loginTime,
      imgSrc1,
      imgSrc2,
      imgSrc3,
      showViewer,
      showViewerAll,
      segmentData,
      thousands,
      segmentAttr,
      segmentItemAttr,
      imagePreviewAttr,
      showLink
    };
  }
});
</script>
<style lang="postcss">
.segment-example-page {
  padding: 20px;
  .fe-segment.example-segment {
    .fe-segment-label {
      width: 100px;
    }
  }
}
</style>
