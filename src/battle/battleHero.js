/**
 * 战斗时的武将对象
 */

import { __HEROS__ as HEROS } from "./heros";
import { __ARMS__ as ARMS } from "./arms";
import { __SKILLS__ } from "./skills"
import { keepTwoDecimal } from "../uilts"
import { clacAttackDamage, getRandomBool } from "./battleCalcFunc"

const CanAddAttrsKey = ['atk', 'def', 'int', 'spd'];
export class BattleHero {
    /*
        args: 
            config: 武将配置 
            example: {
                id: 1001,//武将Id
                level: 40,//武将等级
                extraAttrsAlloc: {//属性分配
                        atk: 40,
                        def: 0,
                        int: 0,
                        spd: 0,
                }
            }

    */
    constructor(config, battlecamp, Manger) {
        // 受击时执行堆
        this.ON_HURT = {};
        // 普通攻击前执行堆
        this.BEFORE_BASEATK = [];
        // 行动时执行堆
        this.ON_ACTION = [];
        // 行动前执行堆
        this.BEFORE_ACTION = {};
        // 回合开始时执行堆
        this.ROUND_START = {};
        // 攻击前
        this.BEFORE_ATK = {}
        // 攻击后
        this.AFTER_ATK = {}
        // 准备中的战法
        this.IN_READY_SKILL = []

        // 计数器
        this.Counter = {};
        // 发动率增加效果
        this.RATE_ADD = {};

        // 一些效果已执行的标记
        this.StateFlag = {
            confusion: false,
            attackLimit: false
        }
        // 战斗时状态
        this.State = {
            attackNum: 0,//已攻击次数

            // rage: [],//暴走 无差别攻击
            // attackLimit:[],//怯战 无法普攻
            // skillLimit:[],//犹豫 无法发动主动战法
            // attackHurtRate:[],//受到的攻击伤害加减百分比
            // skillHurtRate:[],//受到的谋略伤害加成
            // attackdamageRate:[],//造成的攻击伤害加成
            // skilldamageRate:[],//造成的谋略伤害加成

            // 先手
            firstAction: {
                rounds: 0,
                from: {
                    hero: null,
                    skill: 0
                }
            },

            // 连击 任意类型不叠加
            doubleAttack: {
                rounds: 0,
                from: {
                    hero: null,
                    skill: 0
                }
            },

            // 混乱 任意类型不叠加
            confusion: {
                rounds: 0,
                from: {
                    hero: null,
                    skill: 0
                }
            },

            // 犹豫 任意类型不叠加
            activeLimit: {
                rounds: 0,
                from: {
                    hero: null,
                    skill: 0
                }
            },

            // 怯战 任意类型不叠加
            attackLimit: {
                rounds: 0,
                from: {
                    hero: null,
                    skill: 0
                }
            },

            // 攻击伤害加成
            attackDamageAdd: {
                passive: null,
                command: null,
                active: null,
                passive: null
            },

            // 策略攻击伤害加成
            inteDamageAdd: {
                passive: null,
                command: null,
                active: null,
                passive: null
            }
        },
            this.Manger = Manger;
        this.BattleCamp = battlecamp;

        // 初始化属性值
        this.initAttrs(config);
        // 初始化技能
        this.initSkills(config);
    }

    initAttrs(config) {
        let id = config.id;
        let level = config.level;

        let hero = HEROS[id];

        // 战斗中的属性
        this.Attrs = {
            atk: 0,
            def: 0,
            int: 0,
            spd: 0,
            des: 0
        }

        // 战斗开始时的属性不会变动
        this.OriginAttrs = {
            atk: 0,
            def: 0,
            int: 0,
            spd: 0,
            arms: 0
        }

        this.Id = id;
        this.Name = hero.name;
        // this.Camp = ['蜀', '魏', '吴', '汉', '群','晋'][hero.camp-1]
        this.Camp = hero.camp;
        this.BisicArm = hero.arm;
        this.Skill = hero.skill;
        this.Level = level;
        this.Arms = 5000 + level * 100;
        this.HurtArms = 0;
        this.Limit = hero.limit;

        // 属性成长
        for (let key in hero.attrs_grow) {
            this.Attrs[key] = hero.attrs[key];
            let attr = hero.attrs_grow[key];

            this.Attrs[key] = keepTwoDecimal(this.Attrs[key] + (level - 1) * attr);
        }

        // 额外属性分配
        for (const key in config.extraAttrsAlloc) {
            this.Attrs[key] = keepTwoDecimal(this.Attrs[key] + config.extraAttrsAlloc[key]);
        }

        // 四大营
        CanAddAttrsKey.forEach((key) => {
            this.Attrs[key] = keepTwoDecimal(this.Attrs[key] + 20);
        })

        // // 疾风营强化
        // this.Attrs['spd'] = keepTwoDecimal(this.Attrs['spd'] + 10);

        //保存此时的属性
        this.OriginAttrs.atk = this.Attrs.atk;
        this.OriginAttrs.def = this.Attrs.def;
        this.OriginAttrs.int = this.Attrs.int;
        this.OriginAttrs.spd = this.Attrs.spd;
        this.OriginAttrs.arms = this.Arms;
    }

    initSkills(config) {
        /* this.Skills = {};
        this.SkillsOrder = [];
        this.Skills[this.Skill] = SKILLS[this.Skill];
        this.SkillsOrder.push(this.Skill);
        if(config.equipskill != undefined && config.equipskill.length != 0){
            config.equipskill.forEach(e => {
                this.Skills[e] = SKILLS[e]; 
                this.SkillsOrder.push(e);
            })
        } */
        let SKILLS = {};
        __SKILLS__.forEach(e => {
            SKILLS[e.id] = e;
        });
        this.Skills = {};
        this.SkillsOrder = [];
        this.Skills[this.Skill] = SKILLS[this.Skill];
        this.SkillsOrder.push(this.Skill);
        if (config.equipskill != undefined && config.equipskill.length != 0) {
            config.equipskill.forEach(e => {
                this.Skills[e] = SKILLS[e];
                this.SkillsOrder.push(e);
            })
        }
        // console.log(SKILLS, this.Skills);
    }
    // 执行被动技能
    callPassiveSkill() {
        this.SkillsOrder.forEach(e => {
            if (!e) return;
            let skill = this.Skills[e];
            try {
                if (skill.type == 4) {
                    skill.callskill(this);
                }
            } catch (error) {
                console.log(this);
            }
        });
    }
    // 执行指挥技能
    callCommandSkill() {
        this.SkillsOrder.forEach(e => {
            if (!e) return;
            let skill = this.Skills[e];
            if (skill.type == 1) {
                skill.callskill(this);
            }
        });
    }
    // 执行主动技能
    callActiveSkill() {
        this.SkillsOrder.forEach(e => {
            if (!e) return;
            let skill = this.Skills[e];
            if (skill.type == 2) {
                let currentRate = skill.rate + (this.RATE_ADD[skill.id] ? self.RATE_ADD[skill.id].value : 0);
                console.log(this.canAddReadySkill(skill));
                if(this.canAddReadySkill(skill)){
                    this.Manger.Record.pushRecord(this, `的【${skill.name}】发动率为${currentRate}%`)
                    let ret = skill.callskill(this);
                    if(ret !== true)this.Manger.Record.pushRecord(this, `的【${skill.name}】未发动`);
                }else{
                    this.subReadySkillRound(skill);
                }
            }
        });
    }
    // 执行追击技能
    callPursuitSkill(target) {
        this.SkillsOrder.forEach(e => {
            if (!e) return;
            let skill = this.Skills[e];
            if (skill.type == 3) {
                if (target.Arms != 0 && getRandomBool(skill.rate / 100)) {
                    skill.callskill(this, target);
                }
            }
        });
    }

    // 获取一个攻击目标
    // TODO: 考虑暴走时的情况
    getAttackTarget() {
        let canAtk = [];

        // 先按距离顺序排列武将 这里需要颠倒红队顺序来排列 因为红队大营是RedTeam的第一个武将
        let heros = [...this.Manger.BlueTeam.hero, ...[...this.Manger.RedTeam.hero].reverse()].filter((e) => {
            return e.Arms > 0;
        });

        // console.log(heros);

        // 然后获取自身位置
        let selfindex = null;
        heros.forEach((e, i) => {
            if (e == this) {
                selfindex = (i + 1);
            }
        })

        // 获取可攻击目标
        heros.forEach((e, i) => {
            // 判断距离是否足够 且目标没有阵亡
            if (e != this && Math.abs(selfindex - (i + 1)) <= this.Limit && e.Arms > 0) {
                if (e.BattleCamp == this.BattleCamp) {
                    return
                }
                canAtk.push(e);
            }
        })

        if (canAtk.length == 0) { // 如果没有目标
            return false;
        } else if (canAtk.length == 1) {// 如果只有一个目标直接返回
            return canAtk[0];
        } else {// 如果大于一个目标 进行随机选择
            let randtarget = canAtk[Math.floor(Math.random() * canAtk.length)];
            return randtarget;
        }
    }

    // 获取目标
    getTarget(range, num) {
        let canAtk = [];

        // 先按距离顺序排列武将 这里需要颠倒红队顺序来排列 因为红队大营是RedTeam的第一个武将
        let heros = [...this.Manger.BlueTeam.hero, ...[...this.Manger.RedTeam.hero].reverse()].filter((e) => {
            return e.Arms > 0;
        });

        // 然后获取自身位置
        let selfindex = null;
        heros.forEach((e, i) => {
            if (e == this) {
                selfindex = (i + 1);
            }
        })

        // 获取可攻击目标
        heros.forEach((e, i) => {
            // 判断距离是否足够 且目标没有阵亡
            if (e != this && Math.abs(selfindex - (i + 1)) <= range && e.Arms > 0) {
                if (e.BattleCamp == this.BattleCamp) {
                    return
                }
                canAtk.push(e);
            }
        })

        if (canAtk.length < num) {
            return canAtk
        } else {
            let canAtkCopy = canAtk.slice();
            let i = canAtk.length;
            let targets = []
            while (targets.length < num) {
                let randindex = Math.floor(Math.random() * canAtkCopy.length);
                targets.push(canAtkCopy[randindex]);
                canAtkCopy.splice(randindex, 1);
            }
            return targets;
        }
    }

    callAttack() {
        let target = this.getAttackTarget();
        if (target) {
            this.basicAttack(target);
            this.State.attackNum++;

            //连击判断
            if (this.State.doubleAttack.rounds != 0) {
                if (this.State.attackNum < 2) {
                    this.callAttack();
                }
            }
        }
    }

    // 普通攻击
    basicAttack(target) {
        this.Manger.Record.pushActionRecord(this, target, '对', '发动普通攻击');
        target.beHurt(this, {
            type: 1,
            rate: 100
        });
        if (this.Manger.Over == true) return;
        this.callPursuitSkill(target);
    }

    // 受到伤害
    /*
        damageInfo {
            rate //伤害率
            type //伤害类型 暂定 1物理 2谋略
        }
    */
    beHurt(attacker, damageInfo, skill = null) {
        attacker.callHook("攻击前");
        let realDamage = 0;
        let damage = clacAttackDamage(attacker, this, damageInfo, skill);

        if (damage >= this.Arms) {
            // 如果伤害大于剩余的兵力 将兵力改为0
            realDamage = this.Arms
            this.Arms = 0;
            if (this.Posname == '大营') this.Manger.Over = true;
        } else {
            realDamage = damage;
            this.Arms -= damage;
        }

        this.Manger.Record.pushRecord(this, `损失 ${realDamage} 兵力(${this.Arms})`, 1)

        attacker.callHook("攻击后", attacker);

        // 受到伤害后 获得此次伤害95%的伤兵
        this.HurtArms += Math.floor(realDamage * 0.95);
        // console.log(this.Name, this.Manger.Round, `受伤获得伤兵${Math.floor(realDamage * 0.95)}`, this.HurtArms);
        // 如果因此次伤害阵亡 伤兵数量减少到60%
        if (this.Arms == 0) {
            // console.log(this.Name, this.Manger.Round, ` 因阵亡伤兵减少到60%`, Math.floor(this.HurtArms * 0.6));
            this.HurtArms = Math.floor(this.HurtArms * 0.6);
        }

        this.callHook('受伤时', attacker, damageInfo, skill);
    }

    // 受到恢复
    revocer(recoverNum, source, name) {
        if (this.Arms == 0) return;
        if (this.HurtArms == 0) recoverNum = 0;
        if (recoverNum >= this.HurtArms) recoverNum = this.HurtArms;
        this.Arms += recoverNum;
        this.HurtArms -= recoverNum;
        this.Manger.Record.pushActionRecord(source, this, `【${name}】的效果使`, `恢复了${recoverNum}兵力(${this.Arms})`, 1);
    }

    // 获取 "造成的攻击伤害提高"
    getAttackDamageAdd() {
        let add = 0;
        add += this.getState("attackDamageAdd", 1);
        add += this.getState("attackDamageAdd", 2);
        add += this.getState("attackDamageAdd", 3);
        add += this.getState("attackDamageAdd", 4);
        return add;
    }

    // 获取 "造成的策略伤害提高"
    getInteDamageAdd() {
        let add = 0;
        add += this.getState("inteDamageAdd", 1);
        add += this.getState("inteDamageAdd", 2);
        add += this.getState("inteDamageAdd", 3);
        add += this.getState("inteDamageAdd", 4);
        return add;
    }

    // 回合开始时清除一些效果
    clearStateRounds() {
        // 清除混乱
        this.claerSingleActionedStateRounds('confusion');

        // 清除怯战
        this.claerSingleActionedStateRounds('attackLimit');

        // 清除连击
        this.claerSingleSimpleStateRounds('doubleAttack');

        // "造成的攻击伤害提高"减少回合
        this.claerSingleSimpleStateRounds('attackDamageAdd');
    }

    // 清除已执行的效果 如混乱,怯战等
    claerSingleActionedStateRounds(name) {
        if (this.StateFlag[name] == true) {
            this.StateFlag[name] = false;
            if (this.State[name].rounds > 0) {
                this.State[name].rounds--;
                if (this.State[name].rounds == 0) {
                    this.State[name].from = { hero: null, skill: 0 }
                }
            }
        }
    }

    // 清除一些不需要确保执行的效果 如连击 妖术等
    claerSingleSimpleStateRounds(name) {
        if (this.State[name].rounds > 0) {
            this.State[name].rounds--;

            if (this.State[name].rounds == 0) {
                this.State[name].from = { hero: null, skill: 0 }
            }
        }
    }

    // 是否处于混乱状态
    isConfusion() {
        if (this.State.confusion.rounds > 0) {
            return true
        }
        return false
    }

    // 由于处于混乱跳过1个回合()
    skipRoundByConfusion() {
        // this.Manger.pushRecord(`[${this.Name}] 由于受到 [${this.State.confusion.from.hero.Name}] [${SKILLS[this.State.confusion.from.skill].name}]的混乱效果影响 无法行动`);
        this.Manger.Record.pushRecord(this, '陷入混乱无法行动');
        this.StateFlag.confusion = true;
    }

    // 是否处于怯战状态
    isAttackLimit() {
        if (this.State.attackLimit.rounds > 0) {
            return true
        }
        return false
    }

    // 由于处于怯战跳过1个回合()
    skipAttackByAttackLimit() {
        // this.Manger.pushRecord(`[${this.Name}] 由于受到 [${this.State.attackLimit.from.hero.Name}] [${SKILLS[this.State.attackLimit.from.skill].name}]的怯战效果影响 无法进行攻击`);
        this.Manger.Record.pushRecord(this, '陷入怯战无法进行攻击');
        this.StateFlag.attackLimit = true;
    }

    // (镇静)清除所有控制与恐慌 妖术 燃烧 动摇 围困 
    clearDebuff(skill,hero) {
        this.Manger.Record.pushActionRecord(this,hero,"受到了",`【${skill.name}】的镇静`);

        let clear = false;
        if(this.State.confusion.rounds > 0){
            this.State.confusion.rounds = 0;
            this.Manger.Record.pushRecord(this,"的混乱效果被消除了",1)
            clear = true;
        }

        if(this.State.activeLimit.rounds > 0){
            this.State.activeLimit.rounds = 0;
            this.Manger.Record.pushRecord(this,"的犹豫效果被消除了",1)
            clear = true;
        }

        if(this.State.attackLimit.rounds > 0){
            this.State.attackLimit.rounds = 0;
            this.Manger.Record.pushRecord(this,"的怯战效果被消除了",1)
            clear = true;
        }

        if(!clear)this.Manger.Record.pushRecord(this,"没有效果可消除",1);
        
        
        // TODO 后续添加 暴走 恐慌 妖术 燃烧 动摇 围困 时添加清除
    }

    // 获取效果对象
    getHookObj(on) {
        let obj;
        switch (on) {
            case "受伤时":
                obj = this.ON_HURT;
                break;
            case "行动前":
                obj = this.BEFORE_ACTION;
                break;
            case "回合开始时":
                obj = this.ROUND_START;
                break;
            case "攻击前":
                obj = this.BEFORE_ATK;
                break;
            case "攻击后":
                obj = this.AFTER_ATK;
                break;
        }
        return obj;
    }
    // 添加技能效果
    /* 
        type:
            buff 有益效果&普通效果
            debuff 负面效果
            other 其他 (用于在某个时机清除效果用)
    */
    addHook(on, tag, func, skill, hero, type="buff") {
        let obj = this.getHookObj(on);

        obj[tag] = {
            call: func,
            type: type,
            skill: skill,
            hero: hero
        }
    }
    // 移除技能效果
    clearHook(on, tag) {
        let obj = this.getHookObj(on);
        delete obj[tag]
    }
    // 执行技能效果
    callHook(on, ...args) {
        let obj = this.getHookObj(on);
        // console.log(obj);
        for (let key in obj) {
            // obj[key](...args)
            // console.log(obj[key]);
            obj[key].call(...args);
        }
    }

    // 计数器增加
    countAdd(tag, num = 1) {
        if (this.Counter[tag]) {
            this.Counter[tag]++;
        } else {
            this.Counter[tag] = 1;
        }
    }
    // 计数器减少
    countSub(tag, num = 1) {
        if (this.Counter[tag]) {
            this.Counter[tag]--;
        }
    }
    // 计数器重置
    countRest(tag) {
        if (this.Counter[tag]) {
            this.Counter[tag] = 0;
        }
    }
    // 计数器获取
    countGet(tag) {
        return this.Counter[tag] ? this.Counter[tag] : 0;
    }

    getSkillTypeName(value) {
        let name;
        switch (value) {
            case 1:
                name = "command"
                break;
            case 2:
                name = "active"
                break;
            case 3:
                name = "pursuit"
                break;
            case 4:
                name = "passive"
                break;
        }
        return name;
    }

    getStateName(value) {
        let name;
        switch (value) {
            case "attackDamageAdd":
                name = "攻击伤害提高"
                break;
            case "inteDamageAdd":
                name = "策略伤害提高"
                break;
        }
        return name;
    }

    // 获取效果冲突类型
    /* 
        1 = 同类型不叠加
        2 = 数值替换 取最高效果
        3 = 任意类型不叠加
    */
    getStateLimit(value) {
        let ret;
        switch (value) {
            case "attackDamageAdd":
                ret = 1;
                break;
            case "inteDamageAdd":
                ret = 1;
                break;
        }
        return ret;
    }

    // 添加状态
    /* 
        name 类型名称
        value 数值
        round 回合数
        from 来源技能
        hero 来源武将
        type 类型
    */
    addState(name, value, round, from, hero, type = 1) {
        let typename = this.getSkillTypeName(from.type);
        if (this.State[name][typename]) {
            let limit = this.getStateLimit(name);
            switch (limit) {
                case 1:
                    if (from == this.State[name][typename].from && this.State[name][typename].type == 1) {
                        this.State[name][typename].value += value;
                        this.State[name][typename].round = round;
                        return this.State[name][typename];
                    }else{
                        this.Manger.Record.pushRecord(this,`已存在来自【${this.State[name][typename].from.name}】的${this.getStateName(name)}效果`);
                    }
                    break;
            }
            
        } else {
            this.State[name][typename] = {
                type: type, //类型
                value: value, //数值
                rounds: round, //回合数 type为2时 为次数
                from: from, //效果来源技能
                hero: hero
            }
            return this.State[name][typename];
        }
    }
    getState(name, type, returnObj = false) {
        let typename = this.getSkillTypeName(type);
        if (this.State[name][typename]) {
            if (returnObj) return this.State[name][typename];
            return this.State[name][typename].value;
        }
        return 0;
    }
    // 移除状态
    /* 
        name 类型名称
        from 来源技能
    */
    delState(name, from) {
        let typename = this.getSkillTypeName(from.type);
        if (this.State[name][typename]) {
            let hero = this.State[name][typename].hero;
            delete this.State[name][typename];
            // this.Manger.Record.pushActionRecord(this, hero, `的来自`, `【${from.name}】的${this.getStateName(name)}效果消失了`);
        }
    }
    // 准备技能需被 混乱 犹豫所打断
    // TODO 需要考虑 法正 和 胜兵的准备回合跳过如何处理
    // 添加准备技能
    addReadySkill(from,round,func){
        if(this.canAddReadySkill(from)){
            let ready = {
                from,
                round,
                func
            }
            this.IN_READY_SKILL.push(ready);
            this.Manger.Record.pushRecord(this,`的战法【${from.name}】开始准备`);
            return true;
        }
        return false;
    }

    // 减少准备技能回合数
    subReadySkillRound(skill){
        this.IN_READY_SKILL.forEach(e => {
            if(skill == e.from){
                if(e.round > 0){
                    e.round -= 1;
                }

                if(e.round <= 0){
                    this.Manger.Record.pushRecord(this,`发动【${skill.name}】`);
                    e.func();
                }
            }
        });
    }

    // 获取是否可添加准备战法 因为当同一战法正在准备中 不可再次进行准备
    canAddReadySkill(skill){
        let ret = true;
        this.IN_READY_SKILL.forEach(e => {
            if(e.from == skill)ret = false;
        });
        return ret;
    }
}