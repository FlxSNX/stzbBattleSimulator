/**
 * 技能配置
 * 
 * Name: 名称
 * Desc: 描述
 * Level: 战法评级
 * Type: 类型 1=指挥 2=主动 3=追击 4=被动
 * Target: 目标数量 示例值 1=1目标 [2,3]=2-3目标
 * TargetType: 目标类型 self=自身 enemy=敌军 friend=友军(除了自己) 当类型为self时 数量强制为1
 * Limit: 距离 追击战法距离填写0,实际距离按武将攻击距离计算
 * Rate: 发动率 %
 */

import { clacAttackDamage, getRandomBool, calcRecover, getRandomInt, clacSkillAdditionRate } from "./battleCalcFunc"
import { keepTwoDecimal, makeSkillTag } from "../uilts";
import { BattleHero } from "./battleHero";


export const __SKILLS__ = [
    {
        id: 1001,
        name: "连战",
        desc: "使自身可以进行两次普通攻击，持续1回合",
        level: "B",
        type: 2,
        target: 1,
        target_type: "self",
        limit: 1,
        rate: 35,
        callskill: function (self) {

        }
    },

    {
        id: 1002,
        name: "温酒斩将",
        desc: "普通攻击后，对攻击目标再次发动猛攻(伤害率200.0%)",
        level: "A",
        type: 3,
        target: 1,
        target_type: "enemy",
        limit: 0,
        rate: 35,
        callskill: function (self, target) {
            self.Manger.Record.pushRecord(self, '的攻击发动【温酒斩将】');
            target.beHurt(self, {
                type: 2,
                rate: 200,
            });
        }
    },

    {
        id: 1003,
        name: "血践黄砂",
        desc: "以无法发动主动战法为代价，使自身进行攻击时的伤害提高120.0%",
        level: "S",
        type: 4,
        target: 1,
        target_type: "self",
        limit: 0,
        rate: -1,
        callskill: function (self) {
            let manger = self.Manger;
            if (manger.Round == "-1") {
                self.Manger.Record.pushRecord(self, '的战法【血践黄砂】生效');
                // 使自身无法发动主动战法 持续到战斗结束
                self.State.activeLimit.rounds = -1
                self.State.activeLimit.from = {
                    hero: self,
                    skille: self.Skills[1003]
                }
                self.Manger.Record.pushRecord(self, '的无法发动主动战法效果已施加', 1);
                // 增加攻击伤害120%
                self.State.attackDamageAdd.passive = {
                    value: 120,
                    rounds: -1
                }
                self.Manger.Record.pushRecord(self, '造成的攻击伤害提高120%', 1);
            }
        }
    },

    {
        id: 1004,
        name: "方阵突击",
        desc: "普通攻击后，对攻击目标再次发动攻击(伤害率200.0%)，并使其陷入混乱状态，持续1回合",
        level: "A",
        type: 3,
        target: 1,
        target_type: "enemy",
        limit: 0,
        rate: 30,
        callskill: function (self, target) {
            self.Manger.Record.pushRecord(self, '的攻击发动【方阵突击】');
            target.beHurt(self, {
                type: 2,
                rate: 200,
            });

            if (!target.isConfusion()) {
                target.State.confusion = {
                    rounds: 1,
                    from: {
                        hero: self,
                        skill: 1004
                    }
                }
                self.Manger.Record.pushActionRecord(self, target, '的【方阵突击】使', '陷入混乱1回合', 1);
            } else {
                self.Manger.Record.pushRecord(target, '已存在混乱效果', 1);
            }
        }
    },

    {
        id: 1005,
        name: "先驱突击",
        desc: "战斗开始后前3回合，使自身优先行动，每回合可进行两次普通攻击，并使攻击属性提高30.0",
        level: "A",
        type: 1,
        target: 1,
        target_type: "self",
        limit: 1,
        rate: -1,
        callskill: function (self) {
            let manger = self.Manger;
            if (manger.Round == 0) {
                manger.Record.pushRecord(self, '发动【先驱突击】');

                self.State.firstAction = {
                    rounds: 3, //因为效果的持续回合数在行动前递减+是指挥技能 所以给4回合才能实际生效3次 || ... 突然又正常了 不用给4回合了 ？？？ 有点懵逼 貌似是之前把先手效果改成持续到多少回合 而不是每回合开始减少持续回合了 ... 
                    from: {
                        hero: self,
                        skill: 1005
                    }
                }
                manger.Record.pushRecord(self, '的先手(预备)效果已施加', 1);

                self.Attrs.atk += 30
                manger.Record.pushRecord(self, `[${self.Name}] 的攻击属性提高了30(${self.Attrs.atk})`, 1);

                self.State.doubleAttack = {
                    rounds: 3,
                    from: {
                        hero: self,
                        skill: 1005
                    }
                }
                manger.Record.pushRecord(self, '的连击(预备)效果已施加', 1);
            }
        }
    },

    {
        id: 1006,
        name: "钝兵挫锐",
        desc: "普通攻击后，对攻击目标再次发动猛攻(伤害率200.0%)，并使其无法进行普通攻击，持续1回合",
        level: "A",
        type: 3,
        target: 1,
        target_type: "enemy",
        limit: 0,
        rate: 30,
        callskill: function (self, target) {
            self.Manger.Record.pushRecord(self, '的攻击发动【钝兵挫锐】');
            target.beHurt(self, {
                type: 2,
                rate: 200,
            });

            if (!target.isAttackLimit()) {
                target.State.attackLimit = {
                    rounds: 1,
                    from: {
                        hero: self,
                        skill: 1006
                    }
                }
                self.Manger.Record.pushActionRecord(self, target, '的【钝兵挫锐】使', '陷入怯战1回合', 1);
            } else {
                self.Manger.Record.pushRecord(target, '已存在怯战效果', 1);
            }
        }
    },

    {
        id: 1007,
        name: "皇裔流离",
        desc: "本场战斗中，使我军全体受到伤害时，有50.0%的几率能恢复一定兵力(恢复率68.0%，受谋略属性影响)",
        level: "S",
        type: 1,
        target: 1,
        target_type: "team",
        limit: 0,
        rate: -1,
        callskill: function (self) {
            self.Manger.Record.pushRecord(self, '发动【皇裔流离】')
            let team;

            if (self.BattleCamp == 'red') {
                team = self.Manger.RedTeam.hero;
            } else {
                team = self.Manger.BlueTeam.hero;
            }

            team.forEach(e => {
                let subskill = () => {
                    if (getRandomBool(50 / 100)) {
                        let revocer = calcRecover(self, 68, 0.6)
                        e.revocer(revocer, self, '皇裔流离');
                    }
                }
                // e.ON_HURT.push(subskill);
                e.addHook("受伤时", `${self.BattleCamp}${self.Camp} - ${self.Id}${self.Name}皇裔流离急救效果`, subskill)
                self.Manger.Record.pushRecord(e, '的急救效果已施加', 1)
            });
        },
    },

    {
        id: 1008,
        name: "其疾如风",
        desc: "战斗开始后前3回合，使我军全体速度属性提高41(受谋略属性影响)，并使其每回合有70%的几率可以进行两次普通攻击",
        level: "S",
        type: 1,
        target: 1,
        target_type: "team",
        limit: 0,
        rate: -1,
        callskill: function (self) {
            self.Manger.Record.pushRecord(self, '发动【其疾如风】')
            let team;

            if (self.BattleCamp == 'red') {
                team = self.Manger.RedTeam.hero;
            } else {
                team = self.Manger.BlueTeam.hero;
            }

            let spdadd = 41 + (Math.floor((self.Attrs.spd - 80) * 0.075));

            team.forEach(e => {
                e.Attrs.spd = keepTwoDecimal(spdadd + e.Attrs.spd);
                self.Manger.Record.pushRecord(e, `的速度属性提高了${spdadd}(${e.Attrs.spd})`, 1);

                e.BEFORE_BASEATK.push(() => {
                    if (self.Manger.Round >= 1 && self.Manger.Round <= 3) {
                        if (getRandomBool(70 / 100)) {
                            if (e.State.doubleAttack.rounds <= 0) {
                                e.State.doubleAttack = {
                                    rounds: 1,
                                    from: {
                                        hero: self,
                                        skill: 1008
                                    }
                                }
                            }
                        } else {
                            self.Manger.Record.pushRecord(e, '的其疾如风未生效', 0)
                        }
                    }
                });

                self.Manger.Record.pushRecord(e, '的连击(预备)效果已施加', 1)
            });
        },
    },

    {
        id: 1009,
        name: "奋疾先登",
        desc: "每回合行动时使自身攻击伤害提升8.0%，自身速度每高于一名武将，则攻击伤害额外提升8.0%。该效果提升至40%时，将对距离3以内的敌军群体发动一次攻击（伤害率190.0%），发动后攻击伤害提升效果消失，同时使目标速度属性降低20.0，该效果可叠加并持续直到战斗结束",
        level: "S",
        type: 1,
        target: 1,
        target_type: "self",
        limit: 0,
        rate: -1,
        callskill: function (self) {
            self.Manger.Record.pushRecord(self, '发动【奋疾先登】')
            let damageRate = 190;
            let maxAddDamageRate = 40;
            let addDamageRate = 8;
            let stateName = self.getStateName("attackDamageAdd");

            let subskill = () => {
                let attack = () => {
                    // TODO 考虑暴走
                    let targets = self.getTarget(3, 2);
                    targets.forEach(e => {
                        self.Manger.Record.pushActionRecord(self, self, '执行来自', '的【奋疾先登】效果');
                        e.beHurt(self, {
                            type: 1,
                            rate: damageRate

                        });
                        e.Attrs.spd = keepTwoDecimal(e.Attrs.spd - 20);
                        if (e.Attrs.spd < 0) e.Attrs.spd = 0;
                        self.Manger.Record.pushActionRecord(self, e, '【奋疾先登】的效果使', `的速度属性降低了20(${e.Attrs.spd})`, 1);
                    });
                    self.delState("attackDamageAdd", this);
                    self.Manger.Record.pushActionRecord(self, self, `的来自`, `【${this.name}】的${stateName}效果消失了`, 1);
                }

                self.addState("attackDamageAdd", addDamageRate, -1, this, self)
                self.Manger.Record.pushActionRecord(self, self, `【${this.name}】使`, `造成的${stateName}${self.getState("attackDamageAdd", this.type)}%`);
                if (self.State.attackDamageAdd.command.value >= maxAddDamageRate) attack()

                self.Manger.SortSpdHeros.forEach((e, i) => {
                    if (e != self && e.Arms > 0) {
                        if (self.Attrs.spd > e.Attrs.spd) {
                            self.addState("attackDamageAdd", addDamageRate, -1, this, self);
                            self.Manger.Record.pushActionRecord(e, self, '执行来自', '的【奋疾先登】效果');
                            self.Manger.Record.pushActionRecord(self, self, `【${this.name}】使`, `造成的${stateName}${self.getState("attackDamageAdd", this.type)}%`);
                            if (self.getState("attackDamageAdd", this.type) >= maxAddDamageRate) attack()
                        }
                    }
                    // TODO 敌方最高兵力施加造成伤害降低 & 自身受到攻击后洞察
                })
            }

            self.ON_ACTION.push(subskill)
        },
    },

    {
        id: 1010,
        name: "奇兵拒北",
        desc: "每回合行动时有30.0%几率对敌军大营和中军分别发动一次攻击（伤害率180.0%），同时使速度最高的友军单体对敌军大营及中军分别发动一次攻击（伤害率120.0%-180.0%）。每回合奇兵拒北未生效时可提升其5%的发动率，可叠加，生效后发动率提升效果消失",
        level: "S",
        type: 1,
        target: 1,
        target_type: "self",
        limit: 0,
        rate: -1,
        callskill: function (self) {
            self.Manger.Record.pushRecord(self, '发动【奇兵拒北】')
            let rate = 0.3;
            let addRate = 0.05;
            let damageRate = 180;
            let teamMinDamageRate = 120;
            let teamMaxDamageRate = 180;

            let subskill = () => {
                let currentRate = rate + (self.RATE_ADD[1010] ? self.RATE_ADD[1010].value : 0);
                self.Manger.Record.pushRecord(self, '的【奇兵拒北】当前发动率(' + currentRate * 100 + '%)')
                if (getRandomBool(currentRate)) {
                    self.Manger.Record.pushActionRecord(self, self, '执行来自', '的【奇兵拒北】效果');
                    let targets;
                    let team;
                    if (self.BattleCamp == 'red') {
                        targets = self.Manger.BlueTeam.hero;
                        team = self.Manger.RedTeam.hero;
                    } else {
                        targets = self.Manger.RedTeam.hero;
                        team = self.Manger.BlueTeam.hero;
                    }
                    console.log("【奇兵拒北】效果","debug",targets);
                    // 自身执行效果
                    targets.forEach(e => {
                        if ((e.Posname == '大营' || e.Posname == '中军') && e.Arms > 0) {
                            console.log("【奇兵拒北】效果","debug",e);
                            e.beHurt(self, {
                                type: 1,
                                rate: damageRate
                            });
                        }
                    })
                    let spdhero = null;
                    team.forEach(e => {
                        if (e != self && e.Arms > 0) {
                            if (spdhero == null) {
                                spdhero = e;
                            } else if (e.Attrs.spd > spdhero.Attrs.spd) {
                                spdhero = e;
                            }
                        }
                    });
                    // 速度最快友军执行效果 暂时没考虑暴走
                    self.Manger.Record.pushActionRecord(spdhero, self, '执行来自', '的【奇兵拒北】效果');
                    targets.forEach(e => {
                        if ((e.Posname == '大营' || e.Posname == '中军') && e.Arms > 0) {
                            e.beHurt(self, {
                                type: 1,
                                rate: getRandomInt(teamMinDamageRate, teamMaxDamageRate)
                            });
                        }
                    })

                    if (self.RATE_ADD[1010]) {
                        delete self.RATE_ADD[1010]
                    }
                } else {
                    self.Manger.Record.pushRecord(self, '的【奇兵拒北】没有生效')
                    if (self.RATE_ADD[1010]) {
                        self.RATE_ADD[1010].value += addRate;
                    } else {
                        self.RATE_ADD[1010] = {
                            value: addRate,
                            rounds: -1
                        }
                    }
                }
            }

            self.ON_ACTION.push(subskill)
        },
    },

    {
        id: 1011,
        name: "忠克猛烈",
        desc: "本战法造成的伤害无视兵种相克及目标的防御属性；对敌军单体发动1次攻击(伤害率280.0%)，并使其陷入犹豫状态，持续1回合；直到陈到下回合行动前，目标每受到1次攻击伤害，陈到对其发动1次攻击(伤害率80.0%)，期间最多可触发3次",
        level: "S",
        type: 2,
        target: 1,
        target_type: "enemy",
        limit: 0,
        rate: 50,
        callskill: function (self) {
            let ttt = getRandomBool(0.5);
            console.log(ttt, "忠克猛烈");
            if (ttt) {
                self.Manger.Record.pushRecord(self, '发动【忠克猛烈】')
                // 战法攻击效果
                let target = self.getTarget(4, 1);
                target[0].beHurt(self, {
                    type: 1,
                    rate: 280,
                }, this)
                // 使其陷入混乱1回合
                if (!target[0].isConfusion()) {
                    target[0].State.confusion = {
                        rounds: 1,
                        from: {
                            hero: self,
                            skill: 1011
                        }
                    }
                    self.Manger.Record.pushActionRecord(self, target[0], '的【忠克猛烈】使', '陷入混乱1回合');
                } else {
                    self.Manger.Record.pushRecord(target[0], '已存在混乱效果', 1);
                }

                let tag = `${self.BattleCamp}${self.Camp} - ${self.Id}${self.Name}忠克猛烈目标受伤效果`;

                // 施加受到伤害时陈到对其发动攻击
                let subskill = (attacker, damageInfo, skill) => {
                    // 需判处此伤害不是自己的【忠克猛烈】触发的,避免死循环
                    if (skill == this && attacker == self) return;
                    // 期间最多触发3次
                    if (self.countGet(tag + "次数") >= 3) return;
                    self.countAdd(tag + "次数");
                    self.Manger.Record.pushActionRecord(self, self, '执行来自', '的【忠克猛烈】效果');
                    target[0].beHurt(self, {
                        type: 1,
                        rate: 80,
                    }, this);

                }

                target[0].addHook("受伤时", tag, subskill)
                // 陈到行动前 清除所有人的 【忠克猛烈】施加的 "受到伤害时陈到对其发动攻击" 的效果
                let clear = () => {
                    self.Manger.SortSpdHeros.forEach(e => {
                        e.clearHook("受伤时", tag);
                    });
                    self.countRest(tag + "次数");
                }
                self.addHook("行动前", tag + "清除", clear);
            }
        },
    },

    {
        id: 1012,
        name: "愈战愈勇",
        desc: "使自身进行攻击的伤害提高10.0%，此效果每回合开始时额外叠加一次，持续直到战斗结束",
        level: "A",
        type: 4,
        target: 1,
        target_type: "self",
        limit: 0,
        rate: -1,
        callskill: function (self) {
            let manger = self.Manger;
            if (manger.Round == "-1") {
                self.Manger.Record.pushRecord(self, '的战法【愈战愈勇】生效');
                // 增加攻击伤害10%
                self.State.attackDamageAdd.passive = {
                    value: 10,
                    rounds: -1
                }
                self.Manger.Record.pushRecord(self, '造成的攻击伤害提高10%', 1);
                let subskill = () => {
                    self.State.attackDamageAdd.passive.value += 10;
                    self.Manger.Record.pushActionRecord(self, self, '的【愈战愈勇】使', '造成的攻击伤害提高' + self.State.attackDamageAdd.passive.value + '%');
                }

                self.addHook("回合开始时", makeSkillTag(self, this, "回合开始时添加攻击伤害提高"), subskill);
            }
        }
    },

    {
        id: 1013,
        name: "始计",
        desc: "战斗前4回合，在自身行动前，使我军大营下一次攻击或策略攻击时的伤害提高20.0%（受谋略属性影响），敌方兵力最多单体下一次攻击或策略攻击时的伤害降低30.0%（受谋略属性影响），并在自身受到攻击或策略攻击伤害后，于本回合内进入洞察状态，免疫混乱、犹豫、怯战、暴走和挑衅效果",
        level: "S",
        type: 1,
        target: 1,
        target_type: "self",
        limit: 0,
        rate: -1,
        callskill: function (self) {
            let manger = self.Manger;
            if (manger.Round == 0) {
                self.Manger.Record.pushRecord(self, '发动【始计】');
                let addRate = clacSkillAdditionRate(20, 0.15, self.Attrs.int);
                let subRate = clacSkillAdditionRate(30, 0.25, self.Attrs.int);

                let stateName = self.getStateName("attackDamageAdd");

                let delAddRate = (attacker) => {
                    let obj = attacker.getState("attackDamageAdd", this.type, true);
                    if (obj.from == this && obj.hero == self) {
                        attacker.delState("attackDamageAdd", this);
                        self.Manger.Record.pushActionRecord(attacker, self, `的来自`, `【${this.name}】的${stateName}效果消失了`, 1);
                    }
                }

                let subskill = () => {
                    self.Manger.SortSpdHeros.forEach(e => {
                        // TODO 考虑暴走
                        if (e.BattleCamp == self.BattleCamp && e.Posname == '大营') {
                            e.addState("attackDamageAdd", addRate, 1, this, self, 2);
                            self.Manger.Record.pushActionRecord(self, e, `【${this.name}】使`, `造成的${stateName}${e.getState("attackDamageAdd", this.type)}%`);
                            e.addHook("攻击后", makeSkillTag(self, this, "攻击后移除增伤"), delAddRate);
                        }
                    })
                }
                console.log(makeSkillTag(self, this, "行动前添加攻击伤害增加"));
                self.addHook("行动前", makeSkillTag(self, this, "行动前添加攻击伤害增加"), subskill);
            }
        }
    },
]