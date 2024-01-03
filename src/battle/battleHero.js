/**
 * 战斗时的武将对象
 */

import { __HEROS__ as HEROS } from "./heros";
import { __ARMS__ as ARMS } from "./arms";
import { __SKILLS__ as SKILLS } from "./skills"
import { keepTwoDecimal } from "../uilts"
import { clacAttackDamage,getRandomBool } from "./battleCalcFunc"

const CanAddAttrsKey = ['atk','def','int','spd'];
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
    constructor(config,battlecamp,Manger){
        // 受击时执行的效果
        this.ON_HURT = [];

        // 一些效果已执行的标记
        this.StateFlag = {
            confusion:false,
            attackLimit:false
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
            firstAction:{
                rounds:0,
                from:{
                    hero: null,
                    skill: 0
                }
            },

            // 连击
            doubleAttack:{
                rounds:0,
                from:{
                    hero:null,
                    skill:0
                }
            },

            // 混乱
            confusion:{
                rounds:0,
                from:{
                    hero:null,
                    skill:0
                }
            },

            // 犹豫
            activeLimit:{
                rounds:0,
                from:{
                    hero:null,
                    skill:0
                }
            },

            // 怯战
            attackLimit:{
                rounds:0,
                from:{
                    hero:null,
                    skill:0
                }
            },

            // 攻击伤害加成
            attackDamageAdd:{
                // 被动加成
                passive:{
                    value:0, //数值
                    rounds:0 //持续回合
                },
                // 指挥加成
                command:{
                    value:0, //数值
                    rounds:0 //持续回合
                },
                // 主动加成
                active:{
                    value:0, //数值
                    rounds:0 //持续回合
                }
            },

            // 策略攻击伤害加成
            inteDamageAdd:{
                // 被动加成
                passive:{
                    value:0, //数值
                    rounds:0 //持续回合
                },
                // 指挥加成
                command:{
                    value:0, //数值
                    rounds:0 //持续回合
                },
                // 主动加成
                active:{
                    value:0, //数值
                    rounds:0 //持续回合
                }
            }
        },
        this.Manger = Manger;
        this.BattleCamp = battlecamp;

        // 初始化属性值
        this.initAttrs(config);
        // 初始化技能
        this.initSkills(config);
    }

    initAttrs(config){
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

    initSkills(config){
        this.Skills = {};
        this.SkillsOrder = [];
        this.Skills[this.Skill] = SKILLS[this.Skill];
        this.SkillsOrder.push(this.Skill);
        if(config.equipskill != undefined && config.equipskill.length != 0){
            config.equipskill.forEach(e => {
                this.Skills[e] = SKILLS[e]; 
                this.SkillsOrder.push(e);
            })
        }
    }

    callPassiveSkill(){
        this.SkillsOrder.forEach(e => {
            let skill = this.Skills[e];
            if(skill.type == 4){
                skill.callskill(this);
            }
        });
    }

    callCommandSkill(){
        this.SkillsOrder.forEach(e => {
            let skill = this.Skills[e];
            if(skill.type == 1){
                skill.callskill(this);
            }
        });
    }

    callActiveSkill(){

    }

    callPursuitSkill(target){
        this.SkillsOrder.forEach(e => {
            let skill = this.Skills[e];
            if(skill.type == 3){
                if(target.Arms != 0 && getRandomBool(skill.rate/100)){
                    skill.callskill(this,target);
                }
            }
        });
    }

    // 获取一个攻击目标
    // TODO: 考虑暴走时的情况
    getAttackTarget(){
        let canAtk = [];

        // 先按距离顺序排列武将
        let heros = [...[...this.Manger.BlueTeam.hero].reverse(),...this.Manger.RedTeam.hero].filter((e)=>{
            return e.Arms > 0;
        });

        // 然后获取自身位置
        let selfindex = null;
        heros.forEach((e,i) => {
            if(e == this){
                selfindex = (i+1);
            }
        })

        // 获取可攻击目标
        heros.forEach((e,i) => {
            // 判断距离是否足够 且目标没有阵亡
            if(e != this && Math.abs(selfindex - (i+1)) <= this.Limit && e.Arms > 0){
                if(e.BattleCamp == this.BattleCamp){
                    return
                }
                canAtk.push(e);
            }
        })

        if(canAtk.length == 0){ // 如果没有目标
            return false;
        }else if(canAtk.length == 1){// 如果只有一个目标直接返回
            return canAtk[0];
        }else{// 如果大于一个目标 进行随机选择
            let randtarget = canAtk[Math.floor(Math.random() * canAtk.length)];
            return randtarget;
        }
    }

    callAttack(){
        let target = this.getAttackTarget();
        if(target){
            this.basicAttack(target);
            this.State.attackNum++;

            //连击判断
            if(this.State.doubleAttack.rounds != 0){
                if(this.State.attackNum < 2){
                    this.callAttack();
                }
            }
        }
    }

    // 普通攻击
    basicAttack(target){
        this.Manger.Record.pushActionRecord(this,target,'对','发动普通攻击');
        target.beHurt(this,{
            type: 1,
            rate: 100
        });
        if(this.Manger.Over == true)return;
        this.callPursuitSkill(target);
    }

    // 受到伤害
    beHurt(attacker,damageInfo){
        let realDamage = 0;
        let damage = clacAttackDamage(attacker,this,damageInfo.rate);
        // let record = {msg:'',sub:[]};
        
        if(damage >= this.Arms){
            // 如果伤害大于剩余的兵力 将兵力改为0
            realDamage = this.Arms
            this.Arms = 0;
            if(this.Posname == '大营')this.Manger.Over = true;
        }else{
            realDamage = damage;
            this.Arms -= damage;
        }

        this.Manger.Record.pushRecord(this,`损失 ${realDamage} 兵力(${this.Arms})`,1)

        // 受到伤害后 获得此次伤害95%的伤兵
        this.HurtArms += Math.floor(realDamage * 0.95);
        console.log(this.Name,this.Manger.Round,`受伤获得伤兵${Math.floor(realDamage * 0.95)}`,this.HurtArms);
        // 如果因此次伤害阵亡 伤兵数量减少到60%
        if(this.Arms == 0){
            console.log(this.Name,this.Manger.Round,` 因阵亡伤兵减少到60%`,Math.floor(this.HurtArms * 0.6));
            this.HurtArms = Math.floor(this.HurtArms * 0.6);
        }

        this.ON_HURT.forEach(e => {
            e();
        })
    }

    // 受到恢复
    revocer(recoverNum,source,name){
        if(this.Arms == 0)return;
        if(this.HurtArms == 0)recoverNum = 0;
        if(recoverNum >= this.HurtArms)recoverNum = this.HurtArms;
        this.Arms += recoverNum;
        this.HurtArms -= recoverNum;
        this.Manger.Record.pushActionRecord(source,this,`【${name}】的效果使`,`恢复了${recoverNum}兵力(${this.Arms})`,1);
    }

    // 获取 "造成的攻击伤害提高"
    getAttackDamageAdd(){
        let add = 0;

        if(this.State.attackDamageAdd.passive.value != 0){
            add += this.State.attackDamageAdd.passive.value;
        }

        if(this.State.attackDamageAdd.command.value != 0){
            add += this.State.attackDamageAdd.command.value;
        }

        if(this.State.attackDamageAdd.active.value != 0){
            add += this.State.attackDamageAdd.active.value;
        }

        return add;
    }

    // 回合开始时清除一些效果
    clearStateRounds(){
        // 清除混乱
        this.claerSingleActionedStateRounds('confusion');

        // 清除怯战
        this.claerSingleActionedStateRounds('attackLimit');

        // 清除连击
        this.claerSingleSimpleStateRounds('doubleAttack');
    }

    // 清除已执行的效果 如混乱,怯战等
    claerSingleActionedStateRounds(name){
        if(this.StateFlag[name] == true){
            this.StateFlag[name] = false;
            if(this.State[name].rounds > 0){
                this.State[name].rounds--;
                if(this.State[name].rounds == 0){
                    this.State[name].from = {hero: null,skill:0}
                }
            }
        }
    }

    // 清除一些不需要确保执行的效果 如连击 妖术等
    claerSingleSimpleStateRounds(name){
        if(this.State[name].rounds > 0){
            this.State[name].rounds--;

            if(this.State[name].rounds == 0){
                this.State[name].from = {hero: null,skill:0}
            }
        }
    }

    // 是否处于混乱状态
    isConfusion(){
        if(this.State.confusion.rounds > 0){
            return true
        }
        return false
    }

    // 由于处于混乱跳过1个回合()
    skipRoundByConfusion(){
        // this.Manger.pushRecord(`[${this.Name}] 由于受到 [${this.State.confusion.from.hero.Name}] [${SKILLS[this.State.confusion.from.skill].name}]的混乱效果影响 无法行动`);
        this.Manger.Record.pushRecord(this,'陷入混乱无法行动');
        this.StateFlag.confusion = true;
    }

    // 是否处于怯战状态
    isAttackLimit(){
        if(this.State.attackLimit.rounds > 0){
            return true
        }
        return false
    }

    // 由于处于怯战跳过1个回合()
    skipAttackByAttackLimit(){
        // this.Manger.pushRecord(`[${this.Name}] 由于受到 [${this.State.attackLimit.from.hero.Name}] [${SKILLS[this.State.attackLimit.from.skill].name}]的怯战效果影响 无法进行攻击`);
        this.Manger.Record.pushRecord(this,'陷入怯战无法进行攻击');
        this.StateFlag.attackLimit = true;
    }
}