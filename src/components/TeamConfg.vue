<script setup>
import { ref, toRefs } from 'vue'
import { __HEROS__ } from '../battle/heros';
import { __SKILLS__ } from '../battle/skills';

let SKILLS = {};
__SKILLS__.forEach(e => {
    SKILLS[e.id] = e;
});
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
console.log(team.value[camp.value][0]);

const heroCampclass = ['shu', 'wei', 'wu', 'han', 'qun', 'jin'];
const skilltypeclass = ['zh', 'zd', 'zj', 'bd'];
const posname = ['大营', '中军', '前锋'];

const selectSkill = (camp, hindex, sindex) => {
    if (sindex == 0) return;
    console.log(camp, hindex, sindex);
    team.value[camp][hindex].equipskill[sindex - 1] = 1002
}

const selectHero = (camp, hindex) => {
    showHeroList.value = !showHeroList.value
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
                <div class="card" v-for="(hero, index) in team[camp]">
                    <div class="posname">{{ posname[index] }}</div>
                    <div class="name" :class="heroCampclass[HEROS[hero.id].camp - 1]">{{ HEROS[hero.id].name }}</div>
                    <div class="image" @click="selectHero(camp, index)">
                        <img :src="`/assets/card/${hero.id}_long.png`">
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
            <div class="card" v-for="hero in HEROS">
                <img :src="`/assets/card/${hero.id}.png`" class="card-img">
                <img src="/assets/ui/card.png" class="card-border">
                <div class="camp">
                    <img :src="`/assets/ui/camp${hero.camp}.png`">
                </div>
                <div class="hero-name">
                    {{ hero.name }}
                </div>
                <div class="level">
                    Lv<span>.40</span>
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
        height: 15%;
        /* background-color: #505050; */

        &>.title {
            display: flex;
            width: 30%;
            height: 80%;
            font-family: "FZLBJW";
            font-size: 2.2vw;
            color: #d9c721;
            background-image: url(/assets/ui/title_bg.png);
            background-position: left;
            background-size: 75%;
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

    &>.herolist-box {
        display: flex;
        flex-wrap: wrap;
        position: relative;
        width: 80%;
        height: 80%;
        overflow-y: auto;

        &::-webkit-scrollbar{
            display: none;
        }

        .card {
            position: relative;
            width: 14.5%;
            height: 45%;
            background-color: #555;
            background-image: url(assets/card/02.png);
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center;
            margin: 2.1% 1% 0 1%;
            cursor: pointer;
            transform: scale(.98);

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
                bottom: 2%;
                right: 2%;
                color: #fff;
                text-shadow: 0 .1vw .1vw #000;
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
                    height: 2.9vw;
                    width: 2.9vw;

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
                text-shadow: 0 .1vw .1vw #000;
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
</style>
