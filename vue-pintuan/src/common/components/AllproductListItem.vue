<template>
    <div>
      <SpellListItem v-if="data.activityType == 2"  :data="data" :unit="unit"></SpellListItem>
      <PreferentialListItem v-else-if="data.activityType == 1"  :data="data" :unit="unit"></PreferentialListItem>
      <GroupBuyListItem v-else-if="data.activityType == 3"  :data="data" :unit="unit"></GroupBuyListItem>
      <ProductListItem v-else  :data="data" :unit="unit"></ProductListItem>
    </div>
</template>
<script type='text/javascript'>
  import  ProductListItem from '@/common/components/ProductListItem'
  import  PreferentialListItem from '@/common/components/PreferentialListItem'
  import  SpellListItem from '@/common/components/spellListItem'
  import  GroupBuyListItem from '@/common/components/GroupBuyListItem'
    export default {
      props:['data', 'unit'],
        data() {
            return {}
        },
        methods: {},
        components :{
          ProductListItem,PreferentialListItem,SpellListItem,GroupBuyListItem
        }
    }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>

</style>
