<script setup>
    import { ref,computed } from 'vue'
    const myint = ref(0);
    const eint = ref(0);
    const damageval = ref(0);
    const skillrare = ref(0);
    const myarms = ref(0);
    const damage = ref(0);

    const calcInteEffect = (inte) => {
        inte = Math.floor(inte)
        if (inte <= 50) {
            return 1;
        } else {
            return Math.ceil(100 - (75 - (9375 / (75 + inte)))) / 100;
        }
    }

    // 兵力基础伤害
    const armsdamage = computed(() => {
        let arms = parseInt(myarms.value);
        return (arms * 178) / (6459 + arms)
    })

    const intedamage = computed(() => {
        return parseFloat(myint.value) * 0.5 * parseFloat(damageval.value) * calcInteEffect(eint.value)
    })

    const maindamage = computed(() => {
        let arms = parseInt(myarms.value);
        return (300 * arms / (3500+arms) * skillrare.value * damageval.value) * calcInteEffect(eint.value)
    })

    const totaldamage = computed(() => {
        return armsdamage.value + maindamage.value + intedamage.value;
    })

    const realskillrate = computed(() => {
        return (damage.value - armsdamage.value - intedamage.value) / damageval.value / calcInteEffect(eint.value) / (300 * myarms.value / ( 3500 + parseInt(myarms.value) ) )
    })
</script>

<template>
	<div class="calc">
        <h2>谋略伤害计算器</h2>
        <div>
            <span>我方谋略</span>
            <input type="text" v-model="myint">
            <span>我方兵力</span>
            <input type="text" v-model="myarms">
            <span>敌方谋略</span>
            <input type="text" v-model="eint">
            <span>伤害增降</span>
            <input type="text" v-model="damageval">
            <span>技能伤害率</span>
            <input type="text" v-model="skillrare">
            <span>战报伤害</span>
            <input type="text" v-model="damage">
        </div>
        <div>
            <p>兵力基础伤害:{{ armsdamage }}</p>
            <p>策略基础伤害:{{ intedamage }}</p>
            <p>主要伤害:{{ maindamage }}</p>

            <p>总计: {{ totaldamage }}</p>

            <!-- <p>本次实际技能伤害率 {{ ((damage - ((parseInt(myarms) * 178) / (6459 + parseInt(myarms))+ (parseInt(myint) * 0.5 * parseFloat(damageval) * calcInteEffect(eint)))) / damageval / calcInteEffect(eint) / (300 * myarms / (3500+parseInt(myarms)))) }}</p> -->

            <p>本次实际技能伤害率 {{ realskillrate }}</p>

            <!-- <p>求伤害率成长值: {{ ((damage - ((parseInt(myarms) * 178) / (6459 + parseInt(myarms))+ (parseInt(myint) * 0.5 * parseFloat(damageval) * calcInteEffect(eint)))) / damageval / calcInteEffect(eint) / (300 * myarms / (3500+parseInt(myarms))) - skillrare) / (myint - 80) * 100}}%</p> -->

            <p>求伤害率成长值: {{ ((realskillrate - skillrare) / (myint - 80)) * 100 }}%</p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    
</style>
