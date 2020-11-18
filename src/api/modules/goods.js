import axios from '@/utils/request'

const goods = {
    //商品分类-列表
    getCateList(params) {
        return axios.get('categories/', {params: params})
    },
    //商品分类-父级分类
    getParentCateList(params) {
        return axios.get('categories', {params: params})
    },
    //商品分类-添加分类
    addCateInfo(data) {
        return axios.post('categories', data)
    },
    //分类参数-列表
    getParamsList() {
        return axios.get('categories')
    },
    //分类参数-商品分类
    getGoodsParams(id,params) {
        return axios.get(`categories/${id}/attributes`, {params:{sel: params}})
    },
    //分类参数-添加参数
    getAddParams(id, data) {
        return axios.post(`categories/${id}`, data)
    },
    //分类参数-修改动态参数
    getEditParams(id, cateId, activeName) {
        return axios.get(`categories/${id}/attributes/${cateId}`, {params: {attr_sel: activeName}})
    },
    //分类参数-确定修改参数
    getSubmitEditParams(id, attr_id, attr_name, activeName) {
        return axios.put(`categories/${id}/attributes/${attr_id}`,{attr_name: attr_name, attr_sel: activeName})
    },
    //分类参数-删除参数
    removeParams(id, attr_id) {
        return axios.delete(`categories/${id}/attributes/${attr_id}`)
    },
    //分类参数-添加属性
    getAddTagsProps(id, attr_id,attr_name,attr_sel,attr_vals) {
        return axios.put(`categores/${id}/attributes/${attr_id}`, {attr_name: attr_name, attr_sel: attr_sel,attr_vals: attr_vals})
    },


    //商品列表
    getGoodsList(params) {
        return axios.get('goods', {params: params})
    },
    removeGoodsList(id) {
        return axios.delete(`goods/${id}`)
    },
    getAddCateList() {
        return axios.get('categories')
    },
    //商品列表-商品参数
    getTabGoods(id,params) {
        return axios.get(`categories/${id}/attributes`, {params: {sel: params}})
    },
    //添加商品
    getAddGoods(data) {
        return axios.post('goods',data)
    },


    //订单列表
    getOrderList(params) {
        return axios.get('orders', {params: params})
    }
}

export default goods