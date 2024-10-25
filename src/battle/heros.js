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
    },
    1005:{
        name: "乐进", //名称
        camp: 2, //阵营 1=蜀 2=魏 3=吴 4=汉 5=群 6=晋
        star: 5, //星级
        cost: 30, //统率
        arm: 103, //兵种
        limit: 2, //攻击距离
        skill: 1009, //初始技能
        attrs: { //初始属性
            atk: 96.00,
            def: 87.00,
            int: 67.00,
            spd: 46.00,
            des: 14.00
        },
        attrs_grow: { //属性成长率
            atk: 2.13,
            def: 1.95,
            int: 0.73,
            spd: 0.64,
            des: 1.21
        }
    },
    1006:{
        name: "魏延", //名称
        camp: 1, //阵营 1=蜀 2=魏 3=吴 4=汉 5=群 6=晋
        star: 5, //星级
        cost: 30, //统率
        arm: 103, //兵种
        limit: 2, //攻击距离
        skill: 1010, //初始技能
        attrs: { //初始属性
            atk: 93.00,
            def: 90.00,
            int: 69.00,
            spd: 50.00,
            des: 14.00
        },
        attrs_grow: { //属性成长率
            atk: 2.13,
            def: 1.95,
            int: 0.73,
            spd: 0.64,
            des: 1.21
        }
    },
    1007:{
        name: "陈到", //名称
        camp: 1, //阵营 1=蜀 2=魏 3=吴 4=汉 5=群 6=晋
        star: 5, //星级
        cost: 30, //统率
        arm: 103, //兵种
        limit: 2, //攻击距离
        skill: 1011, //初始技能
        attrs: { //初始属性
            atk: 86.00,
            def: 70.00,
            int: 86.00,
            spd: 41.00,
            des: 13.00
        },
        attrs_grow: { //属性成长率
            atk: 2.36,
            def: 1.75,
            int: 1.20,
            spd: 0.74,
            des: 1.12
        }
    },
    1008:{
        name: "张机", //名称
        camp: 4, //阵营 1=蜀 2=魏 3=吴 4=汉 5=群 6=晋
        star: 5, //星级
        cost: 30, //统率
        arm: 101, //兵种
        limit: 3, //攻击距离
        skill: 1016, //初始技能
        attrs: { //初始属性
            atk: 81.00,
            def: 90.00,
            int: 88.00,
            spd: 55.00,
            des: 12.00
        },
        attrs_grow: { //属性成长率
            atk: 1.17,
            def: 1.79,
            int: 1.63,
            spd: 0.87,
            des: 0.85
        }
    },
    1009:{
        name: "吕蒙", //名称
        camp: 3, //阵营 1=蜀 2=魏 3=吴 4=汉 5=群 6=晋
        star: 5, //星级
        cost: 35, //统率
        arm: 101, //兵种
        limit: 3, //攻击距离
        skill: 1021, //初始技能
        attrs: { //初始属性
            atk: 86.00,
            def: 92.00,
            int: 93.00,
            spd: 54.00,
            des: 9.00
        },
        attrs_grow: { //属性成长率
            atk: 1.66,
            def: 2.23,
            int: 1.64,
            spd: 0.87,
            des: 0.87
        }
    }
}