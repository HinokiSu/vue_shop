<template>
  <div>
    <!-- 面包屑导航区域 -->
    <GenCrumbs toPath="/home" firLev="首页" secoLev="数据统计" thirLev="数据报表"/>


    <el-card>
      <!-- 未ECharts 准备一个具备大小 （宽高）的Dom -->
      <div id="main" style="width: 750px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import GenCrumbs from '../general/GenCrumbs.vue'
// 导入echarts
import * as echarts from 'echarts'
import _ from 'lodash'
export default {
  name: 'ReportCompt',
  components: {
    GenCrumbs
  },
  data () {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  methods: {
     getReportList() {
     
    }
  },
  created() {
    this.getReportList(
      
    )
  },
  // 此时页面上的元素，已被渲染完成
  async mounted() {
    // 基于准备好的DOM，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))
    // 指定图表的配置项和数据
     const { data: res } = await this.$http.get('reports/type/1')
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败!')
      }
      console.log(res);
    const result = _.merge(res.data, this.options)

    // 展示数据
    myChart.setOption(result)
  }
}
</script>

<style lang="less" scoped></style>
