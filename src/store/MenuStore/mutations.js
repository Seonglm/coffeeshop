export const mutations = {
    changeData(state, data) {
        // data.key : 修改数据的名称
        // data.value : 修改的数据
        state[data.key] = data.value;
    },

    // 修改商品数据
    changeProducts(state, data) {
        // data.type:类型
        // data.value:商品数据
        state.productDataCache[data.type] = data.value;
    },
    // 修改商品种类
    changeProductType(state, data) {
        // 
        state.productType.type = data.type;
        
    }
}