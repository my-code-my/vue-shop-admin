<template>
  <div>
    <el-breadcrumb-item :to="{ path: path }">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="item in breadlist" :key="item.id">{{item.name}}</el-breadcrumb-item>
  </div>
  </template>

  <script>
  export default {
    name: "BreadCrumbItem",
    props: {
      path: {
        type: String,
        default: '/home'
      },
      breadlist: {
        type: Array,
        default: []
      }
    }
  }
  </script>

  <style scoped>

  </style>