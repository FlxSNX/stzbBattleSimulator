/**
 * 兵种配置
 * 
 * Name: 兵种名称
 * Basic: 基础兵种
 * Counter: 克制的兵种(array)
 */

export const __ARMS__ = {
    101:{
        name: "弓兵",
        basic: 101,
        Counter: [102]
    },
    102:{
        name: "骑兵",
        basic: 102,
        Counter: [103]
    },
    103:{
        name: "步兵",
        basic: 103,
        Counter: [101]
    }
}