<script setup>
import { ref, toRefs, computed } from 'vue'
import { __HEROS__ } from '../battle/heros';
import { __SKILLS__ } from '../battle/skills';
import { keepTwoDecimal } from "../uilts"

let SKILLS = {};
let SKILL_LIST = {1:[],2:[],3:[],4:[]};
__SKILLS__.forEach(e => {
    SKILLS[e.id] = e;
    if(e.study == true)SKILL_LIST[e.type].push(e);
});
// 定义 level 的排序顺序
const levelOrder = { "S": 1, "A": 2, "B": 3, "C": 4 };

// 对每个数组进行排序
for (let key in SKILL_LIST) {
    SKILL_LIST[key].sort((a, b) => levelOrder[a.level] - levelOrder[b.level]);
}
let HEROS = {};
__HEROS__.forEach(e => {
    HEROS[e.id] = e;
});

const props = defineProps(['show', 'team']);
const emit = defineEmits(['update:show', 'update:team']);

const { show, team } = toRefs(props);
const camp = ref('blue');
const testt = ref({
    red: {
        name: '马云潞'
    },
    blue: {
        name: '木鹿大王'
    },
})
const showHeroList = ref(false);
const showSkillList = ref(false);
const showHeroInfo = ref(false);
console.log(team.value[camp.value][0]);

const heroCampclass = ['shu', 'wei', 'wu', 'han', 'qun', 'jin'];
const skilltypeclass = ['zh', 'zd', 'zj', 'bd'];
const posname = ['大营', '中军', '前锋'];

var s_camp;
var s_hindex;
var s_sindex;

const selectSkill = (camp, hindex, sindex) => {
    if (sindex == 0) return;
    s_camp = camp;
    s_hindex = hindex;
    s_sindex = sindex;
    // console.log(camp, hindex, sindex);
    // team.value[camp][hindex].equipskill[sindex - 1] = 1002
    showSkillList.value = true;
}

const saveSkill = (id) => {
    team.value[s_camp].heros[s_hindex].equipskill[s_sindex - 1] = id;
    showSkillList.value = false;
    console.log('team save',team.value);
}

const selectHero = (camp, hindex) => {
    showHeroList.value = !showHeroList.value
    c_camp = camp;
    c_hindex = hindex;
}

const ConfigHeroId = ref(0);
const HeroConfig = ref({})
var c_camp;
var c_hindex;

const ConfigHeroInfo = (id) => {
    console.log(id,HEROS[id]);
    // ConfigHeroId.value = id;
    showHeroInfo.value = true;
    HeroConfig.value = {
        id: id,//武将Id
        level: 40,//武将等级
        extraAttrsAlloc: {//属性分配
            atk: 0,
            def: 0,
            int: 0,
            spd: 0
        },
        up: 5
    }
}

const saveConfig = () =>{
    console.log(team.value[c_camp].heros[c_hindex]);
    team.value[c_camp].heros[c_hindex].id = HeroConfig.value.id;
    team.value[c_camp].heros[c_hindex].level = HeroConfig.value.level;
    team.value[c_camp].heros[c_hindex].extraAttrsAlloc.atk = HeroConfig.value.extraAttrsAlloc.atk;
    team.value[c_camp].heros[c_hindex].extraAttrsAlloc.def = HeroConfig.value.extraAttrsAlloc.def;
    team.value[c_camp].heros[c_hindex].extraAttrsAlloc.int = HeroConfig.value.extraAttrsAlloc.int;
    team.value[c_camp].heros[c_hindex].extraAttrsAlloc.spd = HeroConfig.value.extraAttrsAlloc.spd;
    team.value[c_camp].heros[c_hindex].up = HeroConfig.value.up;
    team.value[c_camp].heros[c_hindex].animation = false;
    console.log(team.value[c_camp].heros[c_hindex],"save");
    console.log('team save',team.value);
    // alert("保存成功");
    showHeroInfo.value = false;
    showHeroList.value = false;
}

var IntervalInst = {};

const addAttrChange = (type,act) => {
    IntervalInst[type] = setInterval(() => {
        changeConfig(type,act)
    }, 50);
}

const attrnum = computed(() => {
    return Math.floor(HeroConfig.value.level / 10) * 10 + 50 - (HeroConfig.value.extraAttrsAlloc.atk + HeroConfig.value.extraAttrsAlloc.def + HeroConfig.value.extraAttrsAlloc.int + HeroConfig.value.extraAttrsAlloc.spd);
})

const clearAttrChange = (type) => {
    clearInterval(IntervalInst[type]);
}

const changeConfig = (type,act) => {
    if(type == "level"){
        if(act == 1 && HeroConfig.value.level < 50){
            HeroConfig.value.level++
        }else if(act == 2 && HeroConfig.value.level > 1){
            HeroConfig.value.level--;
        }
    }else if(type == "up"){
        if(act == 1 && HeroConfig.value.up < 5){
            HeroConfig.value.up++
        }else if(act == 2 && HeroConfig.value.up > 0){
            HeroConfig.value.up--;
        }
    }else{
        if(act == 1 && attrnum.value > 0){
            HeroConfig.value.extraAttrsAlloc[type]++
        }else if(act == 2 && HeroConfig.value.extraAttrsAlloc[type] > 0){
            HeroConfig.value.extraAttrsAlloc[type]--;
        }
    }
}
</script>

<template>
    <div class="team-config-warp" v-show="props.show">
        <div class="box">
            <div class="header">
                <div class="title">阵容配置</div>
                <div class="close" @click="emit('update:show', !show)"></div>
            </div>
            <div class="tabs">
                <div :class="[{ 'click': camp == 'blue' }]" @click="camp = 'blue'">攻方</div>
                <div></div>
                <div :class="[{ 'click': camp == 'red' }]" @click="camp = 'red'">守方</div>
            </div>
            <div class="h"></div>
            <div class="cards">
                <div class="card" v-for="(hero, index) in team[camp].heros">
                    <div class="posname">{{ posname[index] }}</div>
                    <div class="name" :class="heroCampclass[HEROS[hero.id].camp - 1]">{{ HEROS[hero.id].name }}</div>
                    <div class="image" @click="selectHero(camp, index)">
                        <img :src="`/assets/card/${hero.id}_long.jpg`">
                    </div>
                    <div class="skills">
                        <div class="skill" v-for="(skill, skillIndex) in [HEROS[hero.id].skill, ...hero.equipskill]"
                            @click="selectSkill(camp, index, skillIndex)">
                            <div class="skill-icon" :class="SKILLS[skill].level" v-if="skill">
                                <div class="skill-type" :class="skilltypeclass[SKILLS[skill].type - 1]"></div>
                            </div>
                            <div class="skill-name" v-if="skill">
                                {{ SKILLS[skill].name }}
                            </div>

                            <div class="skill-icon" v-if="!skill">
                                <div class="skill-type"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="herolist-warp" v-show="showHeroList">
        <div class="herolist-header">
            <div class="title">武将卡</div>
            <div class="close" @click="showHeroList = false"></div>
        </div>
        <div class="herolist-box">
            <div class="card" v-for="hero in [...__HEROS__]" @click="ConfigHeroInfo(hero.id)">
                <img :src="`/assets/card/${hero.id}.jpg`" class="card-img">
                <img src="/assets/ui/card.png" class="card-border">
                <div class="camp">
                    <img :src="`/assets/ui/camp${hero.camp}.png`">
                </div>
                <div class="hero-name">
                    {{ hero.name }}
                </div>
                <div class="level">
                    Lv<span>.{{40}}</span>
                </div>
                <div class="juexing"></div>
                <div class="stars">
                    <div class="star up" v-for="s in hero.star"></div>
                </div>
                <div class="range">
                    <div class="army"><img :src="`https://cbg-stzb.res.netease.com/mvvm/rc6f73b651ed47551555446b20/images/bz/${hero.army}.png`"></div>
                    <span class="icon-text">{{ hero.limit  }}</span>
                </div>
                <div class="cost">
                    <div class="cost-icon"></div>
                    <div>{{ hero.cost / 10 }}</div>
                </div>
            </div>
        </div>
    </div>
    <div class="heroinfo-warp" v-if="showHeroInfo">
        <div class="heroinfo-header">
            <div class="title">武将配置</div>
            <div class="close" @click="showHeroInfo = false"></div>
        </div>
        <div class="heroinfo-box">
            <div class="card" v-for="hero in [HEROS[HeroConfig.id]]">
                <img :src="`/assets/card/${hero.id}.jpg`" class="card-img">
                <img src="/assets/ui/card.png" class="card-border">
                <div class="camp">
                    <img :src="`/assets/ui/camp${hero.camp}.png`">
                </div>
                <div class="hero-name">
                    {{ hero.name }}
                </div>
                <div class="level">
                    Lv<span>.{{ HeroConfig.level }}</span>
                </div>
                <div class="juexing"></div>
                <div class="stars">
                    <div class="star" :class="{'up': HeroConfig.up >= (i+1)}" v-for="(s,i) in hero.star"></div>
                </div>
                <div class="range">
                    <div class="army"><img :src="`https://cbg-stzb.res.netease.com/mvvm/rc6f73b651ed47551555446b20/images/bz/${hero.army}.png`"></div>
                    <span class="icon-text">{{ hero.limit  }}</span>
                </div>
                <div class="cost">
                    <div class="cost-icon"></div>
                    <div>{{ hero.cost / 10 }}</div>
                </div>
            </div>
            <div class="heroinfo">
                <div class="star-box">
                    <div class="sub-btn" @click="changeConfig('up',2)"></div>
                    <div class="stars">
                        <div class="star" :class="{'up': HeroConfig.up >= (i+1)}" v-for="(s,i) in HEROS[HeroConfig.id].star"></div>
                    </div>
                    <div class="add-btn" @click="changeConfig('up',1)"></div>
                </div>
                <div class="level-box">
                    <div class="left">等级</div>
                    <div class="right">
                        <div class="sub-btn" @click="changeConfig('level',2)"></div>
                        <input type="text" :value="HeroConfig.level" disabled>
                        <div class="add-btn" @click="changeConfig('level',1)"></div>
                    </div>
                </div>
                <div class="atk-box">
                    <div class="left"><div class="attr-icon atk"></div>攻击</div>
                    <div class="right">
                        <!-- <div class="stbtn" style="margin-right: .2vw;">MIN</div> -->
                        <div class="sub-btn" @mousedown="addAttrChange('atk',2)" @mouseup="clearAttrChange('atk')" @touchstart="addAttrChange('atk',2)" @touchend="clearAttrChange('atk')"></div>
                        <div class="attr-num">
                            {{ keepTwoDecimal(HEROS[HeroConfig.id].attrs.atk + HEROS[HeroConfig.id].attrs_grow.atk * (HeroConfig.level - 1)).toFixed(2) }} + {{ HeroConfig.extraAttrsAlloc.atk }}
                        </div>
                        <div class="add-btn" @mousedown="addAttrChange('atk',1)" @mouseup="clearAttrChange('atk')" @touchstart="addAttrChange('atk',1)" @touchend="clearAttrChange('atk')"></div>
                        <!-- <div class="stbtn" style="margin-left: .2vw;">MAX</div> -->
                    </div>
                </div>
                <div class="def-box">
                    <div class="left"><div class="attr-icon def"></div>防御</div>
                    <div class="right">
                        <!-- <div class="stbtn" style="margin-right: .2vw;">MIN</div> -->
                        <div class="sub-btn" @mousedown="addAttrChange('def',2)" @mouseup="clearAttrChange('def')" @touchstart="addAttrChange('def',2)" @touchend="clearAttrChange('def')"></div>
                        <div class="attr-num">
                            {{ keepTwoDecimal(HEROS[HeroConfig.id].attrs.def + HEROS[HeroConfig.id].attrs_grow.def * (HeroConfig.level - 1)).toFixed(2) }} + {{ HeroConfig.extraAttrsAlloc.def }}
                        </div>
                        <div class="add-btn" @mousedown="addAttrChange('def',1)" @mouseup="clearAttrChange('def')" @touchstart="addAttrChange('def',1)" @touchend="clearAttrChange('def')"></div>
                        <!-- <div class="stbtn" style="margin-left: .2vw;">MAX</div> -->
                    </div>
                </div>
                <div class="int-box">
                    <div class="left"><div class="attr-icon int"></div>谋略</div>
                    <div class="right">
                        <!-- <div class="stbtn" style="margin-right: .2vw;">MIN</div> -->
                        <div class="sub-btn" @mousedown="addAttrChange('int',2)" @mouseup="clearAttrChange('int')" @touchstart="addAttrChange('int',2)" @touchend="clearAttrChange('int')"></div>
                        <div class="attr-num">
                            {{ keepTwoDecimal(HEROS[HeroConfig.id].attrs.int + HEROS[HeroConfig.id].attrs_grow.int * (HeroConfig.level - 1)).toFixed(2) }} + {{ HeroConfig.extraAttrsAlloc.int }}
                        </div>
                        <div class="add-btn" @mousedown="addAttrChange('int',1)" @mouseup="clearAttrChange('int')" @touchstart="addAttrChange('int',1)" @touchend="clearAttrChange('int')"></div>
                        <!-- <div class="stbtn" style="margin-left: .2vw;">MAX</div> -->
                    </div>
                </div>
                <div class="spd-box">
                    <div class="left"><div class="attr-icon spd"></div>速度</div>
                    <div class="right">
                        <!-- <div class="stbtn" style="margin-right: .2vw;">MIN</div> -->
                        <div class="sub-btn" @mousedown="addAttrChange('spd',2)" @mouseup="clearAttrChange('spd')" @touchstart="addAttrChange('spd',2)" @touchend="clearAttrChange('spd')"></div>
                        <div class="attr-num">
                            {{ keepTwoDecimal(HEROS[HeroConfig.id].attrs.spd + HEROS[HeroConfig.id].attrs_grow.spd * (HeroConfig.level - 1)).toFixed(2) }} + {{ HeroConfig.extraAttrsAlloc.spd }}
                        </div>
                        <div class="add-btn" @mousedown="addAttrChange('spd',1)" @mouseup="clearAttrChange('spd')" @touchstart="addAttrChange('spd',1)" @touchend="clearAttrChange('spd')"></div>
                        <!-- <div class="stbtn" style="margin-left: .2vw;">MAX</div> -->
                    </div>
                </div>
                <div class="num-box">
                    <div class="left">剩余点数: {{ attrnum }}</div>
                    <div class="right">
                        <div class="stbtn" @click="saveConfig">保存上阵</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="skilllist-warp" v-if="showSkillList">
        <div class="skilllist-header">
            <div class="title">学习战法</div>
            <div class="close" @click="showSkillList = false"></div>
        </div>
        <div class="skilllist-box">
            <div class="skill-group" v-for="g in 4">
                <div class="title">{{ ["","指挥","主动","追击","被动"][g] }}</div>
                <div class="content">
                    <div class="skill" v-for="s in SKILL_LIST[g]" @click="saveSkill(s.id)">
                        <div class="skill-container">
                            <img :src="`/assets/ui/skill_${s.level.toLowerCase()}.png`" alt="" class="skill-border">
                            <img :src="`/assets/ui/skill_${skilltypeclass[s.type - 1]}.png`" alt="" class="skill-type">
                            <div :class="`skill-name ${s.level.toLowerCase()}`">
                                {{ s.name }}
                            </div> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.team-config-warp {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0vh;
    left: 0;
    background-color: rgba(0, 0, 0, .4);
    z-index: 2;

    &>.box {
        position: relative;
        width: 160vh;
        height: 80%;
        background-color: black;
        background-image: url(/assets/ui/bg2.png);
        background-position: right;
        background-size: cover;
        background-repeat: no-repeat;
        display: flex;
        flex-direction: column;

        &>.header {
            height: 10%;
            background-color: rgb(255, 0, 43);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
            color: #e4dd9e;


            &>.title {
                letter-spacing: 0.1vw;
                font-family: "FZLBJW_B";
                font-size: 2.2vw;
                margin: auto;
            }

            &>.close {
                width: 5%;
                height: 100%;
                background-image: url(data:image/png;base64,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);
                background-position: center;
                background-size: contain;
                background-repeat: no-repeat;
                transform: scale(.7);
                cursor: pointer;

                &:active {
                    transform: scale(.6)
                }
            }
        }

        &>.tabs {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 1.6vw;
            width: 20%;
            height: 9%;
            /* background-color: aliceblue; */
            color: #a6a6a6;
            font-family: "FZLBJW_B";
            flex-shrink: 0;

            &>div:nth-child(1),
            &>div:nth-child(3) {
                cursor: pointer;
                width: 45%;
                flex-shrink: 0;
                text-align: center;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: hidden;

                &.click {
                    color: #fff;
                    box-shadow: inset 0px -20px 20px 0px rgba(140, 22, 22, .15)
                }
            }

            &>div:nth-child(2) {
                width: 0;
                height: 30%;
                border-left: #535353 solid .15vw;
            }
        }

        &>.h {
            border-bottom: #505050 solid 0.2vw;
        }

        &>.cards {
            width: 100%;
            height: 100%;
            /* background-color: blue; */
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            align-items: center;
            padding: 1vw 0 1vw 1vw;

            &>.card {
                position: relative;
                display: flex;
                background-color: rgba(0, 0, 0, .3);
                height: 30%;
                width: 90%;
                font-family: "FZLBJW_B";

                &>.posname {
                    position: absolute;
                    color: #8f8f8f;
                    font-size: 1.4vw;
                    width: 1.4vw;
                    left: -2.1vw;
                    top: .1vw;
                    background-color: rgba(41, 43, 43);
                    padding: .2vw;
                    border-radius: 2px;
                }

                &>.name {
                    color: #e4dd9e;
                    font-size: 1.25vw;
                    background: rgba(0, 0, 0, .7);
                    width: 1.25vw;
                    background-color: rgba(41, 43, 43);
                    padding: .2vw;

                    &.shu {
                        background: linear-gradient(150deg, rgb(26, 175, 37, .4) 10%, hsla(0, 0%, 100%, 0));
                    }

                    &.wu {
                        background: linear-gradient(150deg, rgb(200, 9, 9, .4) 10%, hsla(0, 0%, 100%, 0));
                    }

                    &.wei {
                        background: linear-gradient(150deg, rgb(10, 50, 200, .4) 10%, hsla(0, 0%, 100%, 0));
                    }

                    &.han {
                        background: linear-gradient(150deg, rgb(160, 0, 200, .4) 10%, hsla(0, 0%, 100%, 0));
                    }

                    &.jin {
                        background: linear-gradient(150deg, rgb(0, 80, 90, .4) 10%, hsla(0, 0%, 100%, 0));
                    }

                    &.qun {
                        background: linear-gradient(150deg, rgb(125, 125, 125, .4) 10%, hsla(0, 0%, 100%, 0));
                    }
                }

                &>.image {
                    position: relative;
                    width: 31%;
                    cursor: pointer;

                    &>img {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        /* object-position: 0 -5vh; */
                    }
                }

                &>.skills {
                    position: relative;
                    display: flex;
                    width: 45%;
                    /* background-color: aqua; */
                    justify-content: space-evenly;
                    /* align-items: center; */

                    &>:nth-child(1)>.skill-icon>.skill-type {
                        background-image: url(/assets/ui/skill_none.png);
                    }

                    &>:nth-child(2)>.skill-icon>.skill-type,
                    &>:nth-child(3)>.skill-icon>.skill-type {
                        background-image: url(/assets/ui/skill_add.png);
                    }

                    &>.skill {
                        display: flex;
                        position: relative;
                        width: 25%;
                        height: 100%;
                        /* background-image: url(/assets/ui/skill_s.png); */
                        background-repeat: no-repeat;
                        /* background-position: 10vw 10vw; */
                        background-position: center;
                        background-size: contain;
                        align-items: center;
                        /* justify-content: center; */
                        transform: scale(.92);
                        cursor: pointer;
                        flex-direction: column;
                        margin-top: -.3vw;

                        &>.skill-icon {
                            display: flex;
                            position: relative;
                            width: 100%;
                            height: 80%;
                            /* background-image: url(/assets/ui/skill_s.png); */
                            background-repeat: no-repeat;
                            /* background-position: 10vw 10vw; */
                            background-position: center;
                            background-size: contain;
                            align-items: center;
                            justify-content: center;
                            /* transform: scale(.8); */
                            cursor: pointer;

                            &>.skill-type {
                                width: 100%;
                                height: 100%;
                                background-repeat: no-repeat;
                                background-position: center;
                                background-size: 78%;
                                /* background-size: contain; */
                                /* transform: scale(.89); */

                                &.zh {
                                    background-image: url(/assets/ui/skill_zh.png);
                                }

                                &.bd {
                                    background-image: url(/assets/ui/skill_bd.png);
                                }

                                &.zj {
                                    background-image: url(/assets/ui/skill_zj.png);
                                }

                                &.zd {
                                    background-image: url(/assets/ui/skill_zd.png);
                                }
                            }

                            &.S {
                                background-image: url(/assets/ui/skill_s.png);

                                &~.skill-name {
                                    display: flex;
                                    color: #fff;
                                    background-image: url(/assets/ui/skill_s_b.png);
                                }
                            }

                            &.A {
                                background-image: url(/assets/ui/skill_a.png);

                                &~.skill-name {
                                    display: flex;
                                    color: #fff;
                                    background-image: url(/assets/ui/skill_a_b.png);
                                }
                            }

                            &.B {
                                background-image: url(/assets/ui/skill_b.png);

                                &~.skill-name {
                                    display: flex;
                                    color: #fff;
                                    background-image: url(/assets/ui/skill_b_b.png);
                                }
                            }
                        }

                        &>.skill-name {
                            width: 95%;
                            height: 20%;
                            display: none;
                            background-size: contain;
                            background-repeat: no-repeat;
                            background-position: center;
                            align-items: center;
                            justify-content: center;
                            font-size: 1.45vw;
                            /* margin-top: -.2vw; */
                        }
                    }
                }
            }
        }
    }
}

.herolist-warp {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background-image: url(/assets/ui/bg.png);
    background-position: right;
    background-size: cover;
    background-repeat: no-repeat;
    z-index: 100;

    &>.herolist-header {
        display: flex;
        justify-content: space-between;
        /* align-items: center; */
        position: relative;
        width: 100%;
        height: 11vh;
        /* background-color: #505050; */

        &>.title {
            display: flex;
            width: 30%;
            // height: 80%;
            font-family: "FZLBJW";
            font-size: 2.2vw;
            color: #d9c721;
            background-image: url(/assets/ui/title_bg.png);
            background-position: left;
            background-size: contain;
            background-repeat: no-repeat;
            /* justify-content: center; */
            align-items: center;
            padding-left: 5%;
            box-sizing: border-box;
            /* align-self: flex-start; */
        }

        &>.close {
            width: 5%;
            height: 80%;
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAA5wSURBVGhD7VoLcFTVGb77zmazm5BsNgkkEUhIhCAihGR3qUCto2PtOFOtHUfHcWwp06FjKx2R0T6kUkXCQ6lQnaoz1qLitFLfL1B5CIGEhQRCEkJC3pvHJrvZJJvNvvt/Z+8Nm2Q3u3nQ0hm+mT/3nHNvzr3f+R/nP+csdx3XcR3XcR3/BWw3GnUvFxXN46sxQ8xfw+LFpUuT+OI1AxDFVebx3OgTiV7fVliYT1Up2mKBiL+GRYnRmCMNBNZ6Oe4Lh9tdHi+VJsdJpQsCgUDu4ydOvMY/xm1buVK96fjxAb56VbF16dK5cqXyeQnHLRGJRAWeQIALcJyFbj21sbT0jeBTkTEh4V1G43qR37+XCPItHBcQXfkXsUi0Y0Np6cb7MzOVqP+zrc3JblxdyHcbjS6+zIGwAPrOAxtPnryPr4bFhCZN1P4SLIQfF38g8MSfli3bCKIQaJq/9T8BafzeF4qLL1AxIdgyHhEJw5z5IjMD6ozJWCTFxZXs0OvPoQyzfiw3V8FuXCXs1Os38sWwUEgki3YaDO1UjAu2jAa5wni8pNcXS3y+B8SBwGq/mMYERHkRiAsCg6Jr2sq0tLxvOzo+KbNa3ehj/aJFCeUWCyvPFEr0+i0SkWgz3ikIU0aI+EkIiuWpqRnfdXZ+RWUKQVeAZ8Zhd3Excwz6U0eE81hjGIy8mPyIPoQbdLvf8QUCbyRpNGfYA4QNhw/38cVpYYfReIRixirOz1OKgNC7NTbbQ2/U1r7DVxnCmnTA738YVxqNPCLkJxG4jQJGCx2ALJAglz+oVii+7h8cfPRSd7cXZLcVF2c+M83prcRgeIuRnSRmq1QP0WVOsBZEWMKPl5fva3c4KlAmKjyd8NYQDiqZbFdafPwvULa7XNojfX3D7MYUAM1KxWKmgMnA4/d3JMrlP7wvJ2cFVTXB1shBK66kqmqt2es1kb2SozKB7fK3w4OitpdGxYNO1UT6uRUr3r9ks9kPNzVx6/LytCUrVqQHn4wNO4qLz1IcCZqxIFEgI/VA4iWSDLfPZ3+/oWGImuXBu5EJK386f/4svhwzyOxGZTxKqfTehVrtm/ffcEPGdzZbzFpGhrdLrw9Qf0v5pkmDLPTi02Vl26kIdxqJ2JHMlJEl0ssLdbrPicUVIoKBxwjSCSPa73aXPWsy3XmPVitbmZ+PKQzJw7goDrKBuDgbX530+xBPbC5X52aTaQ9VrSQtJCaSTpKJCfPQZ6tU+Vlqdf492dmPyCQSllXFCoGwgN6hoZu3VlY2UFHwj1F2Cs3yxSBiIIx/EJ7y+/2uJ06d2kJFvPcSCXIEMwkb3EgmjRGGsH9qcTjqjnd2ntlUVvabnuFhM0ZRkGigF8SFilKhQPaG+V/68sqVo3yakUWfoRINPh8nIsHV6Xb376+vxzQEcjUk1STQ7IglhU08QoDBc5D0k/SQ2I91dn6brlTmZMTHs3A/cRgbD7FEkn1rRoaBLOYTs9Ppq+zpYfn3zuLiDkpgEmIiycPh8djkIhGzOJvb3f7M2bMvUZ9dVIVGodl6kuiJRwQIjj+bZPEdmZkP352d/RNKNFhjqFmFA0VwUgNdxWJ2BZ48cUK9d80a+fDwcAf9bzD/jZEwJTvMFWhxIwbZLRUV+6jaRnKZpJfkFMk4TIawAIT4TJJsnVK5YtPSpS9QJ5FcYwQgTP7l5aTSUe+U+v0jUwZDDIQpKLXPUiiYhV3u6yvbU1PzIbsRNOPzJNBsWEyFMABXSCXJJpm7ubDwZY1CwRbmUVO/QMBDpiuJZZCAsb15fT64GMPXZvOBg21tlVT0kMCMkdLCpEeeGYtoPhwJsGAENJiO57DZfHqOWq0ljc+LlpyALF0okwlWg5fICO3tvYaGvUqJREHaTf2jyfTwJbsd4wFy0Cq0C5MWvCvsyE+VMIAOMbLYbeDOWiwtark8kKVSFaA+Eehr8EFRyQIC4SoyXbqIeoeH2/9WU/MqxY4sqiOQlpJg+sG8jqwKGBWoQjEdwqFgpKtttmpvINCbl5hoZK0zABD+xmz+4GBzcwXl6B1HOzoOUhOIgSxMGGtfkB0kASb0qZkiDGBPy9o4MDBIdtucm5S0mgWgKCYeDRe7ug7tb2r6etjvH2hzOEAQg9tK0kiCTArvjajRsZhJwngpJviWhv5+rn5goLlIp1s9HcKl3d2ff9re/pUTiUXQR+tImkmgTZAdSShiRUyRchIQ5tijDX19R357/PjtfH3KsLpc3GqtFkWQRUoKjU55h3SmCYfi6PqCgtV8eUow6HR3rZs3L+9IT8+H63Jz+dbpYSZNWgCChn+HXr+OpqmS6Xkwx2lVqsJbUlNrdldXH9uwaNHckxYLTHnKuBqEsbP4Z5lYvA3lMYRRjTodUUrmdvl8A9QHS2fpmrNSp5v/wvnzB7YbjckHW1sjJhbRMOOEQVYqFv+Or4YSRvhCwhGVMC38JSDr8noHqeyViMVpfS6X6tY5c7zPlJcfwXHLHVlZqqkQn1HCO43G16Qi0eN8lSGEMCYpEa1wrHa320xzajLfHhFEVmx3udpkHKdIjovLUkqlP1qg0Rx77syZqny1uliiUHS29ffHPCUBUUc7VrxkNO4mU/w1pY6sHs52sec15HLZUU6Uy1Nw9YnFzOknip7dTudFtVSqU8pks9w0RdGAfW9rRUVZpkajJsKT8ukZidK7DIYqkOWrDJFGEkQh56zW0n0NDTvRJnxEpBSJgl8+rXMrnbT+RZ3+/7v7c3MXcP39wlkWGUFsmDZhInuI1qYT5s9Yu0KETb6WwcG6Y93dH5f39LSctVrfZw8RJvqYHI1mzYDX2+31+63UmXN5cvIFWikI5oycPiZMy4eJ7GUisoyvMggmLYCWcy6QpcDDtFDV21u6t7b2370uF5KHxnO9veU6lUqZoVQuwv2JQH6vHfB4KkSBgIz60xQkJSWcsliO0i0YR0i4iIwpEd5eVDSPomQ9vWE2aY2RFCQUCFAuv3+YVlEaPHd5YODCq7W1n9KtDhKkipAWIt0wT6PJ1iqV88elomP6TBCLsz5qbf27jtbf2SrVXWvmzDEcam/HPha4QGZ28QCynFiMbZR41EEkEoZpLk3mNwY+a2l59536+m+oiAU6kv+LJN0k2C8bOm2xXJinVmenKBTzqX4FIf1jKMQ0IKTZ4i2VlY/Y3O6e/KSk++ar1SJTT8+x4FMzTJg0+zZdFgRr4QnTWtVL7WKFRKLCfZD9sq3tJN1Cst9EgmMcLNYFH8Ryj5FOkMsVpLmbgs2EkP5RAmHg++npd/+joWEHJe8Ny7Xap+cmJBw709uLPeiZIbxLr7/9ztmztwZEIgQoNqUAHp9vkBINti9FRD02mjeFORbE99fX7zna2QmSWNZheYfdxHBLOka6xmZrohsDeRqNnrWOGVCBMA2k4pbk5IQ3L116r3FwcF+OWr2KIy3DVwhj/OIKYiK83WD4Ob34XwGxuEAiEqVAayFCuUbwq6gskZFWqSpxeL19z54792JzP60Vg/tNcAOczoNspKiK1dZQY39/R5fT2bgsNfU2CnjBOzzoG9jPLiA0L+fPSUio+6a9/RyZdAuRxWE8rGjkJxFjEZUwyBKb1/nquPkVZGmaYEeqjDgJJQdDfygvL5FIJDYKMv0UuLAhjgCFs+KIo08AYaSL1k6n09k5NNR4c0rKbeyOgODYjiAjPv4HX7S24qQBfYMsBjMi4bHfPwrPFxWlUE57jDgs5JvCzpVk1i7SLPupg4fMetPJk7+n4jARbvb5fFjHYjsGmh117DIBVPw1N0EmW/Xs8uXstyZuyq3lMtmo32/g9INmg+any8tx8Aa3ACcMXNiUM6KGSwyGH1PQeZciQDb1MJLJhI7QoMfTS/NpW6JCkYY6ovJTp049R0W8uI3MEVuoiMow65iTAwKehQy6aVr7tqPjc71Ot4ZMOHmshuFWcokkKVkmqzpvs8GSELTCkgUiEr4zPf0uSosepCLIekmzYrzKTy+ATZIM97hcrVlxcQsRSA6bzR/9tboacyxMC+c5CE6IxEj/JoycEwCku6UU/A51dJQSMa+SYoRcJJJTWQ6yPnwPiVIuX3LUbN5Pz8MlIrpNWMI7Cgs3UOT9GZmyjr4UZkg8g2khdY66l5ZrllSlMldCZA80Nr75pdmMCIx72IbB8STIRvSlSQBnMxb4S7Xd3kUf4qTcOlMjl7OZAGSBDoejvKy7G1Mf5vbYCW9fsoRmFdleIrgYdeoQUZiRvdTXd9pksVTkJCYWxEmliU0DA6Vv1dW9UtnXh5dAswhM0Cx8NlZ/jQaEDT+RthNpf9PgYNfxrq6P2x2O+mVa7W0CYZg6zeE99I1VVIs40OFikBAwRgFkX6mt/WixVst+v0Uabt1TVfV2k8OB0wfsJJ4lgc/CnOHDMwk24MQCAfA0TfqdDXa7aYvJ9CTagVkKRS4lIOsfu+mmIr4pLEZFgF1FRYUU9R6lOTSRlmKzBny+bIvLVf12fT3MVb3DYGA7GbsqK9eah4aw/QItIk3EZjiSC2FauJoAeURqvB/ny8t/eeONDyxMTDTU2O2llKv/itowMGExyqTJVP2pCoX/s/b2U/DJQ2Zz3XmrFcnL5Xvmzl2sEIsTNptMa2nFgnUpzAZkccyBlI75OsnVBt6Bd8GK8B2O0z09rXPV6jSQXpOevrrGaj1MyoLljcPoGB8Ekn2cCgqmLaWkXkla7+12OpEeZpAgYGAgUIf/TnlTbQaAnyRBCijVzF+VlqafHR/PbTKZMMOMw1jC8GnseieyGgUKEmF3H6aEKQoH4hhZbK1gpGcqOE0XOLPGAVtaUUoKN1ujqf6gsXGcaY8ljDpmACwG4IuhPwcWMhzcQ3vovWsBUAiWrPBrWCcUgalx1ClFOJOOBOGkXtD4tQZYJyxQ+E6Qh59PmfD/E6BtYcq9VhV0HVcBHPcfMQLBUsmMS2oAAAAASUVORK5CYII=);
            background-position: center;
            background-size: contain;
            background-repeat: no-repeat;
            transform: scale(.6);
            cursor: pointer;
            margin-right: 3%;

            &:active {
                transform: scale(.55)
            }
        }
    }

    &>.herolist-box {
        display: flex;
        flex-wrap: wrap;
        position: relative;
        align-content: flex-start;
        width: 85%;
        height: 80%;
        overflow-y: auto;

        &::-webkit-scrollbar{
            display: none;
        }

        .card {
            position: relative;
            width: 12vw;
            height: 17vw;
            background-color: #555;
            background-image: url(assets/card/02.png);
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center;
            margin: 0.9vw 1vw 1.1vw 1vw;
            cursor: pointer;

            .card-img,
            .card-border {
                position: absolute;
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: left;
            }

            .card-border {
                object-fit: fill;
            }

            .camp {
                position: absolute;
                width: 20%;
                height: 15%;
                display: flex;
                align-items: center;
                justify-content: center;

                img {
                    width: 90%;
                    height: 90%;
                    object-fit: contain;
                }
            }

            .hero-name {
                position: absolute;
                width: 12%;
                top: 18%;
                left: 4%;
                text-align: center;
                color: #e4dd9e;
                font-size: 0.95vw;
            }

            &>.level {
                position: absolute;
                color: #e4dd9e;
                bottom: 2%;
                left: 4%;
                font-size: 0.95vw;
                letter-spacing: 0.08vw;

                span {
                    color: #fff;
                }
            }

            .juexing {
                transform: scale(1.15);
                position: absolute;
                right: -9%;
                top: -5%;
                width: 20%;
                height: 20%;
                background-image: url(data:image/png;base64,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);
                background-size: contain;
                background-repeat: no-repeat;
            }

            .arms {
                position: absolute;
                color: #fff;
                font-size: 0.7vw;
                left: 22%;
                top: 2%;
            }

            .hurtarms {
                position: absolute;
                color: red;
                font-size: 0.7vw;
                left: 22%;
                top: 7%;
            }

            .stars{
                display: flex;
                position: absolute;
                top: 3%;
                right: 10%;
                transform: scale(1.1);
                &>.star{
                    width: 1vw;
                    height: 1vw;
                    background: url(data:image/png;base64,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) no-repeat;
                    background-size: 100% 100%;

                    &.up{
                        background-image: url(data:image/png;base64,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);
                    }
                }
            }

            .range{
                display: flex;
                position: absolute;
                bottom: 1.3%;
                right: 2%;
                color: #fff;
                text-shadow: 0 .2vw .2vw #000;
                white-space: nowrap;

                &>span{
                    display: block;
                    position: absolute;
                    right: 10%;
                    bottom: 1%;
                    font-size: 1vw;
                }

                &>.army{
                    position: relative;
                    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAApVBMVEUAAAAREREICAgVFRUTExMREREZGRkXFxcNDQ0SEhIQEBAUFBQgICAeHh4QEBAVFRUWFhYfHx8VFRUcHBwLCwsWFhYWFhYKCgoODg4UFBQdHR0RERENDQ0MDAwICAgHBwciIiIgICAfHx8eHh4hISEMDAwSEhIeHh4hISEiIiIUFBQPDw8XFxcbGxsfHx8JCQkwMDAlJSU0NDQrKys3NzcoKCg6OjoMbVbWAAAAKnRSTlMAFuaKIhzj2dAoCgb28MWqnnEt692YkmUPtoSAd29cVEpDPDX52Lx6Z2EQI/wwAAABrElEQVRYw93N6VLCMBSG4aCggiiIggsuuGu2Nl24/0vzNJPMmdKmhtM/jt9h+AHzvGF/fpOefnHw1NMnSZ/CGDwWaF7rJHns440hF4bWC4EFkk8SW7je3185TyyM0FMK1psSvC8YKNA9FEqTiId4/+69sLdvYeA9OFxpRGRhcCIEeLd64T7W57wZ4DkWCB4LNI+Fdae/QR8ukD13hcOwPxeirDxvO5uQeYmFkA/N/iPTYGHS+b7l8O0KIZ9KERxgO1tYhT3vOMGryTTnfLXrPzhvvs8bw8Ky4fNUBsDvhdNb9PGFOdVjgeixsHaBGTFwPGAxBdk2laay8liQ8Evs0ONmEgqK7LEQ70dsZ/Pogsq8bxYyFeePwEcW1O5ZP2StW9pCDdUbMPRdBUTO2bn3FfjgVkqlmVbBaecJBfRj1rlDWwj7S/ThQlboVl9k1hMK6BcsYneuUH3w0EcXwNffP0MfXfBn/SuL3qcvKG1nikyjjyponRUGKM3DLnzB+xfGqAWzzfQUPKWwNehJhWJrzLbQ02fGyAX0hH1BAT2xoN82rMe+DXpiYcP+/X4AX3AhFMcnM/MAAAAASUVORK5CYII=) no-repeat;
                    background-size: 100% 100%;
                    height: 2.8vw;
                    width: 2.8vw;

                    img{
                        width: 100%;
                        height: 100%;
                        transform: scale(.85);
                    }
                }
            }

            .cost{
                display: flex;
                position: absolute;
                bottom: 1%;
                left: 35%;
                color: #fff;
                text-shadow: 0 .2vw .2vw #000;
                white-space: nowrap;
                font-size: .8vw;
                align-items: center;

                .cost-icon{
                    background: url(data:image/png;base64,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) no-repeat;
                    background-size: 100% 100%;
                    width: 2.8vw;
                    height: 1.3vw;
                    margin-bottom: 0.2vw;
                }
            }
        }
    }
}

.heroinfo-warp {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background-image: url(/assets/ui/bg.png);
    background-position: right;
    background-size: cover;
    background-repeat: no-repeat;
    z-index: 100;

    &>.heroinfo-header {
        display: flex;
        justify-content: space-between;
        /* align-items: center; */
        position: relative;
        width: 100%;
        height: 11vh;
        /* background-color: #505050; */

        &>.title {
            display: flex;
            width: 30%;
            // height: 80%;
            font-family: "FZLBJW";
            font-size: 2.2vw;
            color: #d9c721;
            background-image: url(/assets/ui/title_bg.png);
            background-position: left;
            background-size: contain;
            background-repeat: no-repeat;
            /* justify-content: center; */
            align-items: center;
            padding-left: 5%;
            box-sizing: border-box;
            /* align-self: flex-start; */
        }

        &>.close {
            width: 5%;
            height: 80%;
            background-image: url(data:image/png;base64,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);
            background-position: center;
            background-size: contain;
            background-repeat: no-repeat;
            transform: scale(.6);
            cursor: pointer;
            margin-right: 3%;

            &:active {
                transform: scale(.55)
            }
        }
    }

    &>.heroinfo-box {
        display: flex;
        flex-wrap: wrap;
        position: relative;
        width: 85vw;
        height: 85vh;
        justify-content: space-between;
        align-items: center;

        .card {
            position: relative;
            width: 18vw;
            height: 25.5vw;
            background-color: #555;
            background-image: url(assets/card/02.png);
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center;
            margin: 0.9vw 1vw 1.1vw 1vw;
            cursor: pointer;
            align-self: flex-start;
            margin-top: 3vw;

            .card-img,
            .card-border {
                position: absolute;
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: left;
            }

            .card-border {
                object-fit: fill;
            }

            .camp {
                position: absolute;
                width: 20%;
                height: 15%;
                display: flex;
                align-items: center;
                justify-content: center;

                img {
                    width: 90%;
                    height: 90%;
                    object-fit: contain;
                }
            }

            .hero-name {
                position: absolute;
                width: 12%;
                top: 18%;
                left: 4%;
                text-align: center;
                color: #e4dd9e;
                font-size: 1.425vw;
            }

            &>.level {
                position: absolute;
                color: #e4dd9e;
                bottom: 2%;
                left: 4%;
                font-size: 1.3vw;
                letter-spacing: 0.08vw;

                span {
                    color: #fff;
                }
            }

            .juexing {
                transform: scale(1.15);
                position: absolute;
                right: -9%;
                top: -5%;
                width: 20%;
                height: 20%;
                background-image: url(data:image/png;base64,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);
                background-size: contain;
                background-repeat: no-repeat;
            }

            .stars{
                display: flex;
                position: absolute;
                top: 3%;
                right: 10%;
                transform: scale(1.1);
                &>.star{
                    width: 1.5vw;
                    height: 1.5vw;
                    background: url(data:image/png;base64,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) no-repeat;
                    background-size: 100% 100%;

                    &.up{
                        background-image: url(data:image/png;base64,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);
                    }
                }
            }

            .range{
                display: flex;
                position: absolute;
                bottom: 1.3%;
                right: 2%;
                color: #fff;
                text-shadow: 0 .2vw .2vw #000;
                white-space: nowrap;

                &>span{
                    display: block;
                    position: absolute;
                    right: 10%;
                    bottom: 1%;
                    font-size: 1.5vw;
                }

                &>.army{
                    position: relative;
                    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAApVBMVEUAAAAREREICAgVFRUTExMREREZGRkXFxcNDQ0SEhIQEBAUFBQgICAeHh4QEBAVFRUWFhYfHx8VFRUcHBwLCwsWFhYWFhYKCgoODg4UFBQdHR0RERENDQ0MDAwICAgHBwciIiIgICAfHx8eHh4hISEMDAwSEhIeHh4hISEiIiIUFBQPDw8XFxcbGxsfHx8JCQkwMDAlJSU0NDQrKys3NzcoKCg6OjoMbVbWAAAAKnRSTlMAFuaKIhzj2dAoCgb28MWqnnEt692YkmUPtoSAd29cVEpDPDX52Lx6Z2EQI/wwAAABrElEQVRYw93N6VLCMBSG4aCggiiIggsuuGu2Nl24/0vzNJPMmdKmhtM/jt9h+AHzvGF/fpOefnHw1NMnSZ/CGDwWaF7rJHns440hF4bWC4EFkk8SW7je3185TyyM0FMK1psSvC8YKNA9FEqTiId4/+69sLdvYeA9OFxpRGRhcCIEeLd64T7W57wZ4DkWCB4LNI+Fdae/QR8ukD13hcOwPxeirDxvO5uQeYmFkA/N/iPTYGHS+b7l8O0KIZ9KERxgO1tYhT3vOMGryTTnfLXrPzhvvs8bw8Ky4fNUBsDvhdNb9PGFOdVjgeixsHaBGTFwPGAxBdk2laay8liQ8Evs0ONmEgqK7LEQ70dsZ/Pogsq8bxYyFeePwEcW1O5ZP2StW9pCDdUbMPRdBUTO2bn3FfjgVkqlmVbBaecJBfRj1rlDWwj7S/ThQlboVl9k1hMK6BcsYneuUH3w0EcXwNffP0MfXfBn/SuL3qcvKG1nikyjjyponRUGKM3DLnzB+xfGqAWzzfQUPKWwNehJhWJrzLbQ02fGyAX0hH1BAT2xoN82rMe+DXpiYcP+/X4AX3AhFMcnM/MAAAAASUVORK5CYII=) no-repeat;
                    background-size: 100% 100%;
                    height: 4.2vw;
                    width: 4.2vw;

                    img{
                        width: 100%;
                        height: 100%;
                        transform: scale(.85);
                    }
                }
            }

            .cost{
                display: flex;
                position: absolute;
                bottom: 1%;
                left: 35%;
                color: #fff;
                text-shadow: 0 .2vw .2vw #000;
                white-space: nowrap;
                font-size: 1.2vw;
                align-items: center;

                .cost-icon{
                    background: url(data:image/png;base64,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) no-repeat;
                    background-size: 100% 100%;
                    width: 4.2vw;
                    height: 1.95vw;
                    margin-bottom: 0.2vw;
                }
            }
        }

        .heroinfo{
            display: flex;
            position: relative;
            width: 60vw;
            height: 90%;
            flex-direction: column;

            input{
                background-color: transparent;
                border: unset;
                outline: unset;
                color: #fff;
                font-size: 1vw;
                width: 4vw;
                height: 2vw;
                text-align: center;
                // padding: 0 3vw;
                box-sizing: border-box;
                user-select: none
            }

            &>div{
                display: flex;
                position: relative;
                width: 100%;
                background-color: rgba(0, 0, 0, .3);
                box-sizing: border-box;
                align-items: center;
                margin: .5vw 0;
                color: #fff;
                font-size: 1vw;
                justify-content: space-between;
                padding: 0.5vw 8.5vw 0.5vw 6vw;

                &>.right,&>.left{
                    display: flex;
                    align-items: center;
                }
            }

            .attr-icon{
                width: 2vw;
                height: 2vw;
                margin-right: .5vw;
                background-size: cover;
                &.atk{
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAU4SURBVGhD7ZpbbBRVGMf/W6QgIm6xZXvba6+2XZYSAhi1VVG0GuMlER+MFxJtYvTF6IuCkniBaBAfQIwvRl/EaEwvgQJWaFdJgQZaUGKIihiRRiNSo2Bvux2/78yczW673Z3pznR3G37pP3PmknZ++51z5rLFFcxlE2WL2px9sJyiZdZJvkqRcjKbKbOCeHIyWS+ZSE4mayX1yMlknaQROZmskZyOnEzGS6YiJ5OxkmbIybxJySheocQ70VSSMZW0Qk4m7ZJWysmkTdLMMZcs0x6Tc7SlUbhyrx3rfhf3rF2BqopSLLzmagz+fQn/DY2oR5jLLZS5lINizWIi3bL1kw1KeLAtJu2fblTmz8udWAGz8gbFEEYrKCqnNiEq13hznbamUllegmV+L75o70E4PK5tNY0GiqFKGhGMkWOuXbAA6x64Ccq4AvrBOC8p5b5irKgvJ8kjJBnWjjYNQ5I52jIZGykxcszxkz9pLZYbj8maWwPY9eELyM3N1Y4wlQ0UXd1VTwVZ7nW1Gculy0OoX+qDq7QAsNmgKEokthwbKsqKEfB70Lq7N22VTCY4pZykbW+vkPS4HTGCYaoix+cpxPKAD227j6ZlTCYS1NUNQqGwkAzUeuFxkSSNQTU07Wnx0naeeNr3cSUtkWSPLrE2gakEuXK6p2SWbN97FPV+n6gYwyLRFS2j7ctov0WSjZSrKJMk4wkm7Zbx4JNmyZpKJ5w0JsXMGpUx+hB4rPpr3OjoPGZVJSdJThSclpyET3oPnfzSGg/cziUxFbTRJMR43YUzKhktqHvqTYSU9Fd7RMXkmIyuJsv76UPo6Oyj4y2ZXSNjUgqaIidhyY6vuJJeFDnyIpWKluQJKVBnmSSPSSEpL/Rq/zGRkZExPP38dgR7Ton1MI3B6AzT/pXLq7Djrea4NwOPPXyb1po2wklW8GsKf4y3izWT4Mp92dWP2moXnMX5MWOSbwwY7q511U50dvcjpFX6mSeb8OJzD4o7pd8G/hLbDMKPV3xrGTMGWZL/QsofXTQsuf9AH82uLpQWFVD35K6q3drRPg7L193gJskTaH78bjy7/l7x7DA8PIrgYbUHGIDleLIURAsy1kiSTGfwhKiko8AupOnGLjIBcZxF+bi/aRVWU7fNyckRl5XR0RBa9x3RfosuYuSYiYKMZZVkyWp6xHKV0Owa1V0542JJc/wc9ZT4srL1/Rac/fUPsa6DSXJMPEHGMsmuQ98KyZLC6ydJSjlu//DzALbubBHrOogrx0wlyFgmeeCbk6j0lghJedkQklFd9u0dLfjlnK7qTSnHJBJkLJHkCaa75zs03uhH3nULI9tkJS8O/ost2z8X25OQUI5JJshYIsnXuYZVdaKiHJ42VUFg/ry5KFyyGId6v1cPjk9SOUaPIGOq5BPr1mD9I3doaypcwQsX/xFyLFrmLUKxYzGG6FLhyLfj9z8HtSMF/K40qRyjV5AxRfKhptVofvQuUSnZJX88O4BtH7TiHUq+fREqaHxCsaHMXYS1DfXi0rI/2Kf9BvH9Pt9a6sKIIJOy5Okz59F/6gwuD41gdCyE9z7qwM6P9+DcwAWx//Dx08jPW4RKH0lq7GoL0qx6npss9zI3rCbybtSK1Fa5lIOfbY7Ebrfz9hl/hW/Zq3sW3LbpKeW+O1emTU4yE99PpP0bJisl0y4nsUIyY+QkZkpmnJzEDMmMlZOkIpnxcpLpSGaNnMSIZNbJSfRIZq2cJJFk1stJ4knOGjlJWv6l2ejjUioEtSW/B3xJbV4hRYD/AcHRKZo5JSrkAAAAAElFTkSuQmCC);
                }

                &.def{
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAQaSURBVGhD3ZnbSxRRHMd/ay0uYgVmXgJ1vbwEGWw+SkTQWw8F1lP/RNBDvVSaEUGEL4FE9GIUWIoZYUVQKVpCLEZmIKx5CbqYZWoErrsznd+ZOevseHbmnJnZ6we+7OyZ3dnz2d/5zcyyUOhs0x8zRQfJYZJh+qzAQDlVzyUcKCSMciwXSQoCnhxL3ktaybHkraSIHEve9aSMHEveVNKJHEvOS7qRY8lZSS/kWHKuJ72UY8mZSqZDjiXrkumUY8maZCbkWDLek47kGoJVNLx9AslYJaXkgrUV6rkzbeq74S41/ucxDW7jGO7jvcci0pI+/VEUlLP9EFIlOHWiFdqOt0JLqEkf5ROeiED/4Bg8GBiF2fkf+qgluFwva5v2yAhaygXrKuAkkUKxUHMj+Hxy352qqhD+MAN9j8ao8Nz8or6HSzsJzscW0VlYyu3cUQJLs/f0ZxpkvlKYv4/y+tOwuvZPf8ZFqJJF+qMVQssyFosnJR5XpGJ+vwBC87ITFDoIsnXSKCmT5PcLYjs/K0FhOSQeIxPzMBLgPFNeJ1MJSskhMTIpLyMJnnS48+UJSsshcew7D+MA7rzNgo7k8BRvPkm4DR7TAVvmbxR0JMfgLTM3cQF6JHqSCbqSQ3hVcBOXYE9SSSYoe8u2Bd6Z0E08gDoxQazeFW3TGbwquIlLcEViFZN68AJJp7YpB54PzGdB3qQtE40lxdk5hoK3b1QOMQoiWElpyfX1KPxeXoPoRiwRekfClhy7Q7F4riibWV75S4/pAJRLuujz/j57RYLj+DeXEIqiQkmgGA4eaNRHtJ7EcfFsvv723RcQnpzRjyTMFjkk1f+D0pJT0wtw7GgLFPv9oJCK4BLDa5lsIp+/Q/uN+3RbgkTPmbH6A1RKcoP00Tz5wXrkUIhUgQyYJm4bxQdR0ntnO+7A0u9V7aBiJPWcGStBREpy4esSBAIBaN5XRyaMVdwUUAzbWrT9cbIkyQapugrXu/thPDytH00I7rI0YieISElOTEagvrYSaqv3UCnsLVxsKhExCuIoPuIvf4XIdvc8hYGhce0gYtjKISKCiLBkUZEPXr+ZJJJVULN3Nx0ziiVCx0lI5W71PIPewVH6WkFS9pwZUUFESJIJjIxPQdmuUmgKVicL6SFlo9e7zq5eGHoZpu8VxLLnzMgIIsKVRKm3pJ9+/lqB0P4G8Pu363s0vpB+PX+1B95/mtVHhBBalkZkBRGpnozMfYPnIx+hvKwU6msq6U3AwydjcO1mHywSeQmk5dyCH0hXnmiCNZU0vH02EV6SXiMt6SB4Qskq6ZTMuhwjHZI5I8fwUjJrPWeHF5I5VzkzbiRzXo7hRDJv5Bgykjnbc3aISOZd5cxYSea9HIMnWTByDKNk3vacHShZsHJZAOA/EM4+SAjr1JkAAAAASUVORK5CYII=);
                }

                &.int{
                    background-image: url(data:image/png;base64,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);
                }

                &.spd{
                    background-image: url(data:image/png;base64,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);
                }
            }

            .star-box{
                justify-content: space-around;
                padding: .5vw;
            }

            .level-box{
                justify-content: space-between;
                padding: .5vw 8.5vw;
            }

            .num-box{
                justify-content: space-between;
                padding: .5vw 8.5vw;
            }

            .add-btn,.sub-btn{
                width: 2vw;
                height: 2vw;
                background-size: cover !important;
                cursor: pointer;

                &:active {
                    transform: scale(.95)
                }
            }

            .attr-num{
                display: flex;
                justify-content: center;
                align-items: center;
                color:#e4dd9e;
                font-size: 1vw;
                width: 7vw;
                height: 2vw;
                text-align: center;
                box-sizing: border-box;
                user-select: none;
                white-space: nowrap;
            }

            .add-btn{
                background: url(data:image/png;base64,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) no-repeat;
            }

            .sub-btn{
                background: url(data:image/png;base64,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) no-repeat;
            }

            .stars{
                display: flex;
                transform: scale(1.2);
                &>.star{
                    width: 1.5vw;
                    height: 1.5vw;
                    background: url(data:image/png;base64,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) no-repeat;
                    background-size: 100% 100%;

                    &.up{
                        background-image: url(data:image/png;base64,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);
                    }
                }
            }

            .stbtn{
                background-image: url(/assets/ui/stbtn-1.png);
                background-size: cover;
                background-repeat: no-repeat;
                background-position: top;
                font-size: 1.4vw;
                text-align: center;
                padding: 0.22vw 0.9vw;
                cursor: pointer;
                letter-spacing: 0.1vw;
                font-family: "FZLBJW_B";
                color: #000;

                &:active {
                    transform: scale(.95)
                }
            }
        }
    }
}

.skilllist-warp {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background-image: url(/assets/ui/bg.png);
    background-position: right;
    background-size: cover;
    background-repeat: no-repeat;
    z-index: 100;

    &>.skilllist-header {
        display: flex;
        justify-content: space-between;
        /* align-items: center; */
        position: relative;
        width: 100%;
        height: 11vh;
        /* background-color: #505050; */

        &>.title {
            display: flex;
            width: 30%;
            // height: 80%;
            font-family: "FZLBJW";
            font-size: 2.2vw;
            color: #d9c721;
            background-image: url(/assets/ui/title_bg.png);
            background-position: left;
            background-size: contain;
            background-repeat: no-repeat;
            /* justify-content: center; */
            align-items: center;
            padding-left: 5%;
            box-sizing: border-box;
            /* align-self: flex-start; */
        }

        &>.close {
            width: 5%;
            height: 80%;
            background-image: url(data:image/png;base64,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);
            background-position: center;
            background-size: contain;
            background-repeat: no-repeat;
            transform: scale(.6);
            cursor: pointer;
            margin-right: 3%;

            &:active {
                transform: scale(.55)
            }
        }
    }

    &>.skilllist-box {
        display: flex;
        // flex-wrap: wrap;
        position: relative;
        align-content: flex-start;
        width: 85%;
        height: 80%;
        overflow-y: auto;
        flex-direction: column;

        &::-webkit-scrollbar{
            display: none;
        }

        &>.skill-group{
            position: relative;
            width: 100%;
            color: #fff;

            &>.title{
                position: relative;
                margin-top: .5vw;
                width: 100%;
                border-bottom: 1px solid rgba(255,255,255,.2);
            }

            &>.content{
                width: 100%;
                position: relative;
                display: flex;
                flex-wrap: wrap;

                &>.skill {
                    display: flex;
                    position: relative;
                    width: 11.5vw;
                    height: 11.5vw;
                    padding: .5vw;
                    box-sizing: border-box;
                    cursor: pointer;
                    background-color: rgba(0, 0, 0, .3);
                    margin: .3vw;

                    &>.skill-container{
                        width: 100%;
                        height: 100%;
                        transform: scale(.8);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        position: relative;
                        top: -.6vw;

                        &>.skill-border,&>.skill-type{
                            position: absolute;
                            background-size: 100% 100%;
                            // transform: scale(.8);
                        }

                        &>.skill-border{
                            z-index: 2;
                            width: 75%;
                            height: 75%;
                        }

                        &>.skill-type{
                            // top:2%;
                            // left: 3%;
                            width: 70%;
                            height: 70%;
                        }

                        &>.skill-name {
                            width: 95%;
                            height: 20%;
                            display: none;
                            background-size: contain;
                            background-repeat: no-repeat;
                            background-position: center;
                            align-items: center;
                            justify-content: center;
                            font-size: 2vw;
                            display: flex;
                            color: #fff;
                            position: absolute;
                            z-index: 3;
                            bottom: -6%;
                            font-family: "FZLBJW";

                            &.s{
                                background-image: url(/assets/ui/skill_s_b.png);
                            }

                            &.a{
                                background-image: url(/assets/ui/skill_a_b.png);
                            }

                            &.b{
                                background-image: url(/assets/ui/skill_b_b.png);
                            }
                        }
                 
                    }
                }
            }
        }
    }
}
</style>
