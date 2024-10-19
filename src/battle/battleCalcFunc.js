/**
 * 战斗相关计算方法
 */

import { keepTwoDecimal, roundEightNine } from "../uilts";

// 计算物理伤害
export const clacAttackDamage = (attacker, target, damageInfo, skill) => {
    let damageAddition = getDamageAddition(attacker, target);

    if (damageAddition != 1) {
        attacker.Manger.Record.pushRecord(attacker, `该次造成伤害共计${getDamageAddition(attacker, target) > 1 ? "提升" : "降低"}${roundEightNine(getDamageAddition(attacker, target) * 100 - 100)}%`, 1)
    }

    let DamageRate = damageInfo.rate;
    // 兵力基础伤害
    let armsDamage = (attacker.Arms * 373) / (7700 + attacker.Arms);
    //攻击基础伤害
    let basicDamage = attacker.Attrs.atk * getRandNum() * (DamageRate / 100) * damageAddition;
    //主要伤害
    let targetDef = target.Attrs.def;
    if (skill && skill.id == 1011) {
        targetDef = 0;
    }
    let atkdefdiff = calcAtkDefDiff(attacker.Attrs.atk, targetDef);
    let mainDamage = (((300 * attacker.Arms) / (3500 + attacker.Arms)) * (DamageRate / 100) * damageAddition) * atkdefdiff;
    console.log(attacker.Name, "兵力基础伤害:", armsDamage, "兵力:", attacker.Arms, "基础伤害:", basicDamage, "主要伤害:", mainDamage, "总伤害:", Math.round(armsDamage + basicDamage + mainDamage));
    // if (skill && skill.id == 1011) {
    //     console.log(atkdefdiff, "陈到攻防", attacker.Attrs.atk, mainDamage);
    // }
    return Math.round(armsDamage + basicDamage + mainDamage);
}

// 计算受属性影响的战法的倍率
/*
    base 基础值
    grow 每1点属性值对应增加的倍率
    value 属性值
*/
export const clacSkillAdditionRate = (base, grow, value) => {
    if (value < 80) {
        return Math.round(base * 0.4 + ((base * 0.6) * (value / 80)));
    } else {
        return Math.round(base + (grow * (value - 80)));
    }
}

// 获得伤害随机数
const getRandNum = () => {
    const rand = [0.3, 0.31, 0.32, 0.33, 0.34, 0.35, 0.36, 0.37, 0.38, 0.39];
    return rand[Math.floor(Math.random() * rand.length)];
}

// 计算伤害增减
const getDamageAddition = (attacker, target) => {
    let atkAdd = attacker.getAttackDamageAdd();
    return (atkAdd + 100) / 100
}

// 计算攻防差
const calcAtkDefDiff = (atk, def) => {
    let diff = atk - def;
    if (diff >= 0) {
        return keepTwoDecimal(3 - (500 / (250 + diff)))
    } else {
        return keepTwoDecimal(100 / (100 - diff))
    }
}

// 计算恢复
export const calcRecover = (self, rate, growRate) => {
    return Math.floor(Math.round((self.OriginAttrs.arms * 300) / (3500 + self.OriginAttrs.arms)) * calcRecoverRate(self, rate, growRate) * 1); // 1为造成的恢复效果提升值 暂无实现计算提升值
}

const calcRecoverRate = (self, rate, growRate) => {
    let int = self.OriginAttrs.int;
    // 给定的恢复率为80谋略时的值 所以减去80
    int -= 80;

    let additionRate = Math.floor(int * growRate);

    return keepTwoDecimal((rate + additionRate) / 100);
}

// let xorshift = (function() {
//     let x = 123456789;
//     let y = 362436069;
//     let z = 521288629;
//     let w = 88675123;

//     return function() {
//         let t = (x ^ (x << 11));
//         x = y;
//         y = z;
//         z = w;
//         w = (w ^ (w >>> 19)) ^ (t ^ (t >>> 8));
//         return w;
//     };
// })();

// function getRandomBool(probability){
//     return (xorshift() / 0xFFFFFFFF) < probability;
// }

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function getRandomBool(probability) {
    let results = [];
    for (let i = 0; i < 100; i++) {
        results.push(i < probability * 100);
    }
    results = shuffleArray(results);
    return results[Math.floor(Math.random() * 100)];
}

export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

