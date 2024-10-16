<script setup>
import { BattleManger } from './battle/battleManger'
import { __SKILLS__ as SKILLS } from './battle/skills';
import { __HEROS__ as HEROS } from './battle/heros';
import { ref } from 'vue'
import TeamConfig from './components/TeamConfg.vue';

const record = ref([]);
const battleinfo = ref({});
const showTeamConfig = ref(false);

// const team = {
// 	blue: [
// 		{
// 			id: 0,//武将Id
// 			level: 1,//武将等级
// 			extraAttrsAlloc: {//属性分配
// 				atk: 0,
// 				def: 0,
// 				int: 0,
// 				spd: 0
// 			},
// 			equipskill: [0, 0]
// 		},
// 		{
// 			id: 0,//武将Id
// 			level: 1,//武将等级
// 			extraAttrsAlloc: {//属性分配
// 				atk: 0,
// 				def: 0,
// 				int: 0,
// 				spd: 0
// 			},
// 			equipskill: [0, 0]
// 		},
// 		{
// 			id: 0,//武将Id
// 			level: 40,//武将等级
// 			extraAttrsAlloc: {//属性分配
// 				atk: 0,
// 				def: 0,
// 				int: 0,
// 				spd: 0
// 			},
// 			equipskill: [0, 0]
// 		}
// 	],

// 	red: [
// 		{
// 			id: 0,//武将Id
// 			level: 1,//武将等级
// 			extraAttrsAlloc: {//属性分配
// 				atk: 0,
// 				def: 0,
// 				int: 0,
// 				spd: 0
// 			},
// 			equipskill: [0, 0]
// 		},
// 		{
// 			id: 0,//武将Id
// 			level: 1,//武将等级
// 			extraAttrsAlloc: {//属性分配
// 				atk: 0,
// 				def: 0,
// 				int: 0,
// 				spd: 0
// 			},
// 			equipskill: [0, 0]
// 		},
// 		{
// 			id: 0,//武将Id
// 			level: 1,//武将等级
// 			extraAttrsAlloc: {//属性分配
// 				atk: 0,
// 				def: 0,
// 				int: 0,
// 				spd: 0
// 			},
// 			equipskill: [0, 0]
// 		}
// 	]
// }

const team = ref({
	blue: [
		{
			id: 1003,//武将Id
			level: 40,//武将等级
			extraAttrsAlloc: {//属性分配
				atk: 0,
				def: 0,
				int: 90,
				spd: 0
			},
			equipskill: [0, 0]
		},
		{
			id: 1006,//武将Id
			level: 40,//武将等级
			extraAttrsAlloc: {//属性分配
				atk: 90,
				def: 0,
				int: 0,
				spd: 0
			},
			equipskill: [0, 0]
		},
		{
			id: 1005,//武将Id
			level: 40,//武将等级
			extraAttrsAlloc: {//属性分配
				atk: 0,
				def: 0,
				int: 0,
				spd: 90
			},
			equipskill: [0, 0]
		}
	],

	red: [
		{
			id: 1003,//武将Id
			level: 40,//武将等级
			extraAttrsAlloc: {//属性分配
				atk: 0,
				def: 0,
				int: 90,
				spd: 0
			},
			equipskill: [0, 0]
		},
		{
			id: 1006,//武将Id
			level: 40,//武将等级
			extraAttrsAlloc: {//属性分配
				atk: 90,
				def: 0,
				int: 0,
				spd: 0
			},
			equipskill: [0, 0]
		},
		{
			id: 1005,//武将Id
			level: 40,//武将等级
			extraAttrsAlloc: {//属性分配
				atk: 0,
				def: 0,
				int: 0,
				spd: 90
			},
			equipskill: [0, 0]
		},
	]
})

const testfunc = () => {
	const team = {
		blue: [
			{
				id: 1005,//武将Id
				level: 40,//武将等级
				extraAttrsAlloc: {//属性分配
					atk: 90,
					def: 0,
					int: 0,
					spd: 0
				},
				equipskill: []
			},
			{
				id: 1004,//武将Id
				level: 40,//武将等级
				extraAttrsAlloc: {//属性分配
					atk: 0,
					def: 0,
					int: 90,
					spd: 0
				},
				equipskill: []
			},
			{
				id: 1001,//武将Id
				level: 40,//武将等级
				extraAttrsAlloc: {//属性分配
					atk: 90,
					def: 0,
					int: 0,
					spd: 0
				},
				equipskill: [1002, 1006]
			},
		],

		red: [
			{
				id: 1002,//武将Id
				level: 40,//武将等级
				extraAttrsAlloc: {//属性分配
					atk: 90,
					def: 0,
					int: 0,
					spd: 0
				},
				equipskill: [1002, 1006]
			},
			{
				id: 1002,//武将Id
				level: 40,//武将等级
				extraAttrsAlloc: {//属性分配
					atk: 90,
					def: 0,
					int: 0,
					spd: 0
				},
				equipskill: [1002, 1006]
			},
			{
				id: 1002,//武将Id
				level: 40,//武将等级
				extraAttrsAlloc: {//属性分配
					atk: 90,
					def: 0,
					int: 0,
					spd: 0
				},
				equipskill: [1002, 1006]
			},
		]
	}
	team.blue.reverse();
	team.red.reverse();
	const bm = new BattleManger(team);
	record.value = bm.Record.Records;
	battleinfo.value = bm;
	console.log(bm);
}

const battleStart = () => {
	// team.value.blue.reverse();
	// team.value.red.reverse();
	// const bm = new BattleManger({blue:[...team.value.blue].reverse(),red:[...team.value.red].reverse()});
	const bm = new BattleManger(team.value);
	record.value = bm.Record.Records;
	battleinfo.value = bm;
	console.log(bm);
}
</script>

<template>
	<TeamConfig v-model:show="showTeamConfig" v-model:team="team"/>
	<!-- <div class="header">
		<div class="logo"></div>
	</div> -->
	<div class="main">
		<div class="battle" v-if="battleinfo.BattleHeros != undefined">
			<div class="header-area">
				<div class="blue-team">
					<div class="role-name">攻方队伍</div>
					<div class="bar-box">
						<div class="text">{{ battleinfo.BlueTeam?.arms }}/<span>{{ battleinfo.BlueTeam?.total }}</span>
						</div>
						<div class="bar">
							<div class="hurt"
								:style="`width: calc(${battleinfo.BlueTeam?.hurtArms + battleinfo.BlueTeam?.arms} / ${battleinfo.BlueTeam?.total} * 100%)`">
							</div>
							<div class="current"
								:style="`width: calc(${battleinfo.BlueTeam?.arms} / ${battleinfo.BlueTeam?.total} * 100%)`">
							</div>
						</div>
					</div>
					<div class="team-name">
						👻👻👻
					</div>
				</div>

				<div class="red-team">
					<div class="role-name">守方队伍</div>
					<div class="bar-box">
						<div class="bar">
							<div class="hurt"
								:style="`width: calc(${battleinfo.RedTeam?.hurtArms + battleinfo.RedTeam?.arms} / ${battleinfo.RedTeam?.total} * 100%)`">
							</div>
							<div class="current"
								:style="`width: calc(${battleinfo.RedTeam?.arms} / ${battleinfo.RedTeam?.total} * 100%)`">
							</div>
						</div>
						<div class="text">{{ battleinfo.RedTeam?.arms }}/<span>{{ battleinfo.RedTeam?.total }}</span></div>
					</div>
					<div class="team-name">
						🤡🤡🤡
					</div>
				</div>
			</div>
			<div class="card-area">
				<div class="card-box">
					<div class="card" v-for="item in [...[...battleinfo.BlueTeam.hero].reverse()]">
						<img :src="`/assets/card/${item.Id}.png`" class="card-img" v-if="item && item.Arms > 0">
						<img :src="`/assets/card/${item.Id}.png`" class="card-img gray" v-else>

						<img src="/assets/ui/card.png" class="card-border">
						<div class="camp">
							<img :src="`/assets/ui/camp${item.Camp}.png`">
						</div>
						<div class="hero-name">
							{{ item.Name }}
						</div>
						<div class="level">
							Lv<span>.{{ item.Level }}</span>
						</div>
						<div class="juexing"></div>
						<div class="arms">{{ item.Arms }}</div>
						<div class="hurtarms">{{ item.HurtArms }}</div>
						<div class="skills">
							<div class="skill" v-for="e in item.SkillsOrder">
								<div class="level" v-if="e">{{ item.Skills[e].level }}</div>{{ e ? item.Skills[e].name : ' - ' }}
							</div>
						</div>
					</div>
				</div>
				<div class="card-box">
					<div class="card" v-for="item in [...[...battleinfo.RedTeam.hero].reverse()]">
						<img :src="`/assets/card/${item.Id}.png`" class="card-img" v-if="item && item.Arms > 0">
						<img :src="`/assets/card/${item.Id}.png`" class="card-img gray" v-else>
						<img src="/assets/ui/card.png" class="card-border">
						<div class="camp">
							<img :src="`/assets/ui/camp${item.Camp}.png`">
						</div>
						<div class="hero-name">
							{{ item.Name }}
						</div>
						<div class="level">
							Lv<span>.{{ item.Level }}</span>
						</div>
						<div class="juexing"></div>
						<div class="arms">{{ item.Arms }}</div>
						<div class="hurtarms">{{ item.HurtArms }}</div>
						<div class="skills">
							<div class="skill" v-for="e in item.SkillsOrder">
								<div class="level" v-if="e">{{ item.Skills[e].level }}</div>{{ e ? item.Skills[e].name : ' - ' }}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 未开始战斗的ui -->
		<div class="battle" v-if="battleinfo.BattleHeros == undefined">
			<div class="header-area">
				<div class="blue-team">
					<div class="role-name">攻方队伍</div>
					<div class="bar-box">
						<div class="text"></div>
						<div class="bar">
							<div class="current" :style="`width: 100%`"></div>
						</div>
					</div>
					<div class="team-name">
						👻👻👻
					</div>
				</div>

				<div class="red-team">
					<div class="role-name">守方队伍</div>
					<div class="bar-box">
						<div class="bar">
							<div class="current" :style="`width: 100%`"></div>
						</div>
						<div class="text"></div>
					</div>
					<div class="team-name">
						🤡🤡🤡
					</div>
				</div>
			</div>
			<div class="card-area">
				<div class="card-box" v-for="e in 2">
					<div class="card" v-for="item in 3">
						<img :src="`/assets/card/0.png`" class="card-img">
						<img src="/assets/ui/card.png" class="card-border">
						<div class="camp">
							<img :src="`/assets/ui/camp5.png`">
						</div>
						<div class="level">
							Lv<span>.1</span>
						</div>
						<div class="juexing"></div>
						<div class="skills">
							<div class="skill">
								{{ ' - ' }}
							</div>
							<div class="skill">
								{{ ' - ' }}
							</div>
							<div class="skill">
								{{ ' - ' }}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="stbtn-box">
			<!-- <button @click="testfunc">Debug</button> -->
			<div class="stbtn-1" @click="testfunc">DeBug</div>
			<div class="stbtn-1" @click="battleStart">开始战斗</div>
			<div class="stbtn-1">统计</div>
			<div class="stbtn-1" @click="showTeamConfig = true">配置队伍</div>
		</div>
		<div class="record">
			<div class="record-item" v-for="e in record">
				<div class="sub" v-if="e.level == 1"></div>
				<span v-if="e.hero1 && e.hero1.BattleCamp == 'blue'" style="color: rgb(154,213,137);">【{{ e.hero1.Name
				}}】</span>
				<span v-if="e.hero1 && e.hero1.BattleCamp == 'red'" style="color: rgb(255,72,71);">【{{ e.hero1.Name
				}}】</span>
				<span v-if="e.predicate">{{ e.predicate }}</span>
				<span v-if="e.hero2 && e.hero2.BattleCamp == 'blue'" style="color: rgb(154,213,137);">【{{ e.hero2.Name
				}}】</span>
				<span v-if="e.hero2 && e.hero2.BattleCamp == 'red'" style="color: rgb(255,72,71);">【{{ e.hero2.Name
				}}】</span>
				{{ e.msg }}
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.header {
	position: relative;
	width: 100vw;
	height: 4vh;
	background-color: #f8f8f8;

	.logo {
		position: relative;
		width: 40%;
		height: 100%;
		margin: 0 auto;
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center;
		background-image: url(/assets/ui/logo.png);
	}
}

.main {
	// width: calc((100vh - 4vh) / 0.5625);
	// height: calc(100vh - 4vh);
	width: calc((100vh) / 0.5625);
	height: calc(100vh);
	// background-image: url(assets/ui/bg.png);
	background-position: right;
	background-repeat: no-repeat;
	background-size: cover;
	display: flex;
	position: relative;
	flex-direction: column;
	align-items: center;
	user-select: none;

	&>.battle {
		flex-shrink: 0;
		position: relative;
		width: 98%;
		height: 75%;
		margin-top: 10vh;
		// background-color: rebeccapurple;

		.header-area {
			display: flex;
			justify-content: space-between;
			position: relative;
			width: 100%;
			height: 15%;

			.blue-team,
			.red-team {
				display: flex;
				flex-direction: column;
				align-items: flex-end;
				width: 43%;
				height: 100%;
				position: relative;
				justify-content: space-evenly;
				// background-color: red;

				.bar-box {
					display: flex;
					height: 30%;
					width: 100%;
					justify-content: space-between;
					align-items: center;

					.text {
						font-size: 0.95vw;
						color: #fff;

						span {
							color: #a3a3a3;
						}
					}
				}

				.role-name {
					color: #e4dd9e;
					font-size: 0.95vw;
				}

				.team-name {
					color: #fff;
					font-size: 0.95vw;
					width: 24%;
					text-align: center;
					background-color: rgba(0, 0, 0, .5);
				}
			}

			.blue-team {
				.bar {
					position: relative;
					width: 80%;
					height: 65%;
					background-color: black;
					display: flex;
					flex-direction: row-reverse;

					.current {
						position: relative;
						width: 100%;
						height: 100%;
						background-image: url(/assets/ui/blue-hp-bar.png);
						background-repeat: no-repeat;
						background-position: left;
						background-size: cover;
					}

					.hurt {
						position: absolute;
						width: 0%;
						height: 100%;
						opacity: .5;
						background-color: #598ed7;
					}
				}
			}

			.red-team {
				align-items: flex-start;

				.bar {
					position: relative;
					width: 80%;
					height: 65%;
					background-color: black;

					.current {
						position: relative;
						width: 100%;
						height: 100%;
						background-image: url(/assets/ui/red-hp-bar.png);
						background-repeat: no-repeat;
						background-position: right;
						background-size: cover;
					}

					.hurt {
						position: absolute;
						width: 0%;
						height: 100%;
						opacity: .5;
						background-color: #d15e3f;
					}
				}
			}
		}

		.card-area {
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: relative;
			width: 100%;
			height: 65%;
			// background-color: red;

			.card-box {
				position: relative;
				width: 43%;
				height: 75%;
				// background-color: blue;
				// display: grid;
				// grid-template-columns: repeat(3, 30%);
				display: flex;
				align-items: center;
				justify-content: space-between;

				&:first-child {
					flex-direction: row-reverse
				}

				.card {
					position: relative;
					width: 30%;
					height: 93%;
					background-color: #555;
					background-image: url(assets/card/02.png);
					background-repeat: no-repeat;
					background-size: cover;
					background-position: center;
					// transform: scale(1.02);

					.card-img,
					.card-border {
						position: absolute;
						width: 100%;
						height: 100%;
						object-fit: cover;
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

					.skills {
						display: flex;
						flex-direction: column;
						align-items: center;
						position: absolute;
						width: 100%;
						height: 30%;
						background: rgba(0, 0, 0, .25);
						bottom: -30%;
						border: solid 1px rgba(0, 0, 0, .25);
						box-sizing: border-box;

						.skill {
							cursor: pointer;
							position: relative;
							display: flex;
							width: 100%;
							text-align: center;
							height: calc(100% / 3);
							color: #fff;
							font-size: 0.75vw;
							font-weight: 600;
							box-sizing: border-box;
							border-bottom: solid 1px rgba(0, 0, 0, .25);
							align-items: center;
							justify-content: center;

							&>.level {
								display: flex;
								width: 13%;
								height: 90%;
								position: absolute;
								left: 3%;
								top: 5%;
								border-radius: 50%;
								border: solid 0.11vw rgba(255, 255, 255, .8);
								box-sizing: border-box;
								align-items: center;
								justify-content: center;
								transform: scale(.8);
								font-size: 0.8vw;
								color: #e4dd9e;
							}

							&:last-child {
								border-bottom: none;
							}
						}
					}
				}
			}
		}
	}

	&>.record {
		flex-shrink: 0;
		width: 100%;
		// background-color: red;
		border-top: solid 1px rgba(240, 221, 167, .2);
		padding-top: 1vh;
		padding-left: 1vw;
		font-size: 0.8vw;
		line-height: 2.4vh;
		color: #fff;
		position: relative;

		.record-item {
			display: flex;

			.sub {
				width: 1vw;
				height: 1vw;
			}
		}
	}

	&>.stbtn-box {
		position: relative;
		display: flex;
		align-self: flex-end;
		justify-content: flex-end;
		width: 80%;
		height: 10%;
		flex-shrink: 0;
		align-items: center;

		&>* {
			position: relative;
		}

		&>.stbtn-1 {
			background-image: url(/assets/ui/stbtn-1.png);
			background-size: cover;
			background-repeat: no-repeat;
			background-position: center;
			font-size: 1.7vw;
			min-width: 7.4vw;
			text-align: center;
			padding: .287vw .998vw;
			cursor: pointer;
			// font-weight: 600;
			letter-spacing: 0.1vw;
			font-family: "FZLBJW_B";
			margin: 0 .4vw;


			&:active {
				transform: scale(.9)
			}
		}
	}
}
</style>
