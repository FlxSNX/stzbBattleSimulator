/**
 * 武将配置
 * 
 * Name: 名称
 * Camp: 阵营 1=蜀 2=魏 3=吴 4=汉 5=群 6=晋
 * Star: 星级
 * Cost: 统率
 * Arm: 兵种
 * Limit: 攻击距离
 * Skill: 初始技能
 * Attrs: 初始属性
 * AttrsGrow: 属性成长率
 */

export const __HEROS__ = {
    1001:{
        name: "太史慈",
        camp: 3,
        star: 5,
        cost: 25,
        arm: 101,
        limit: 5,
        skill: 1004,
        attrs: {
            atk: 98.00,
            def: 89.00,
            int: 67.00,
            spd: 65.00,
            des: 8.00
        },
        attrs_grow: {
            atk: 1.98,
            def: 1.80,
            int: 0.62,
            spd: 1.05,
            des: 0.57
        }
    },
    1002:{
        name: "马超",
        camp: 5,
        star: 5,
        cost: 30,
        arm: 102,
        limit: 3,
        skill: 1003,
        attrs: {
            atk: 97.00,
            def: 91.00,
            int: 45.00,
            spd: 92.00,
            des: 4.00
        },
        attrs_grow: {
            atk: 2.78,
            def: 1.84,
            int: 0.52,
            spd: 1.54,
            des: 0.41
        }
    },
    1003:{
        name: "刘备",
        camp: 1,
        star: 5,
        cost: 35,
        arm: 103,
        limit: 3,
        skill: 1007,
        attrs: {
            atk: 80.00,
            def: 81.00,
            int: 80.00,
            spd: 38.00,
            des: 18.00
        },
        attrs_grow: {
            atk: 1.54,
            def: 1.83,
            int: 1.28,
            spd: 0.92,
            des: 1.73
        }
    },
    1004:{
        name: "张辽", //名称
        camp: 2, //阵营 1=蜀 2=魏 3=吴 4=汉 5=群 6=晋
        star: 5, //星级
        cost: 35, //统率
        arm: 102, //兵种
        limit: 3, //攻击距离
        skill: 1008, //初始技能
        attrs: { //初始属性
            atk: 91.00,
            def: 94.00,
            int: 83.00,
            spd: 105.00,
            des: 3.00
        },
        attrs_grow: { //属性成长率
            atk: 2.21,
            def: 2.27,
            int: 1.05,
            spd: 2.72,
            des: 0.29
        }
    }
}