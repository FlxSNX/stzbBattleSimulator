<script setup>
    import { ref,toRefs } from 'vue'
    import { __HEROS__ as HEROS } from '../battle/heros';
    import { __SKILLS__ as SKILLS } from '../battle/skills';


    const props = defineProps(['show','team']);
    const emit = defineEmits(['update:show','update:team']);

    const { show, team } = toRefs(props);
    const camp = ref('blue');
    const testt = ref({
        red : {
            name:'马云潞'
        },
        blue : {
            name:'木鹿大王'
        },
    })
    console.log(team.value[camp.value][0]);

    const heroCampclass = ['shu','wei','wu','han','qun','jin'];
    const skilltypeclass = ['zh','zd','zj','bd'];
    const posname = ['大营','中军','前锋'];

    const selectSkill = (camp,hindex,sindex) => {
        if(sindex  == 0)return;
        console.log(camp,hindex,sindex);
        team.value[camp][hindex].equipskill[sindex-1] = 1002
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
                <div :class="[{'click': camp == 'blue'}]" @click="camp = 'blue'">我方</div>
                <div></div>
                <div :class="[{'click': camp == 'red'}]" @click="camp = 'red'">敌方</div>
            </div>
            <div class="h"></div>
            <div class="cards">
                <div class="card" v-for="(hero, index) in team[camp]">
                    <div class="posname">{{ posname[index] }}</div>
                    <div class="name" :class="heroCampclass[HEROS[hero.id].camp-1]">{{ HEROS[hero.id].name }}</div>
                    <div class="image">
                        <img :src="`/assets/card/${hero.id}.png`">
                    </div>
                    <div class="skills">
                        <div class="skill" v-for="(skill, skillIndex) in [HEROS[hero.id].skill, ...hero.equipskill]" @click="selectSkill(camp,index,skillIndex)">
                            <div class="skill-icon" :class="SKILLS[skill].level" v-if="skill">
                                <div class="skill-type" :class="skilltypeclass[SKILLS[skill].type-1]"></div>
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
</template>

<style scoped>
.team-config-warp {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    width: 100vw;
    height: 96vh;
    top: 4vh;
    left: 0;
    background-color: rgba(0, 0, 0, .4);
    z-index: 2;

    &>.box {
        position: relative;
        width: 160vh;
        height: 80%;
        background-color: black;
        background-image: url(/assets/ui/bg.png);
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
                        object-position: 0 -5vh;
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
                                background-size: contain;
                                transform: scale(.89);

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
                                & ~ .skill-name{
                                    display: flex;
                                    color: #fff;
                                    background-image: url(/assets/ui/skill_s_b.png);
                                }
                            }

                            &.A {
                                background-image: url(/assets/ui/skill_a.png);
                                & ~ .skill-name{
                                    display: flex;
                                    color: #fff;
                                    background-image: url(/assets/ui/skill_a_b.png);
                                }
                            }

                            &.B {
                                background-image: url(/assets/ui/skill_b.png);
                                & ~ .skill-name{
                                    display: flex;
                                    color: #fff;
                                    background-image: url(/assets/ui/skill_b_b.png);
                                }
                            }
                        }

                        &>.skill-name{
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
</style>
