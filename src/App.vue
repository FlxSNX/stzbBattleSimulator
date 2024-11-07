<script setup>
import { BattleManger } from './battle/battleManger'
import { __SKILLS__ as SKILLS } from './battle/skills';
import { __HEROS__ } from './battle/heros';
import { ref } from 'vue'
import TeamConfig from './components/TeamConfg.vue';

let HEROS = {};
__HEROS__.forEach(e => {
	HEROS[e.id] = e;
});

const record = ref([]);
const battleinfo = ref({});
const showTeamConfig = ref(false);
const showBattleRecord = ref(false);

const team = ref({
	blue: [
		{
			id: 1007,//武将Id
			level: 40,//武将等级
			extraAttrsAlloc: {//属性分配
				atk: 90,
				def: 0,
				int: 0,
				spd: 0
			},
			up: 5,
			equipskill: [1012, 1024]
		},
		{
			id: 1008,//武将Id
			level: 40,//武将等级
			extraAttrsAlloc: {//属性分配
				atk: 0,
				def: 0,
				int: 90,
				spd: 0
			},
			up: 5,
			equipskill: [1019, 1017]
		},
		{
			id: 1011,//武将Id
			level: 40,//武将等级
			extraAttrsAlloc: {//属性分配
				atk: 90,
				def: 0,
				int: 0,
				spd: 0
			},
			up: 5,
			equipskill: [1014, 1015]
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
			up: 5,
			equipskill: [1019, 1020]
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
			up: 5,
			equipskill: [1012, 1024]
		},
		{
			id: 1006,//武将Id
			level: 40,//武将等级
			extraAttrsAlloc: {//属性分配
				atk: 0,
				def: 90,
				int: 0,
				spd: 0
			},
			up: 5,
			equipskill: [1015, 1014]
		},
	]
})

const battleStart = () => {
	const bm = new BattleManger(team.value);
	// record.value = bm.Record.Records;
	battleinfo.value = bm;
	console.log(bm);
}
</script>

<template>
	<TeamConfig v-model:show="showTeamConfig" v-model:team="team" />
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
						<div class="text">{{ battleinfo.RedTeam?.arms }}/<span>{{ battleinfo.RedTeam?.total }}</span>
						</div>
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
						<div class="stars">
							<div class="star" :class="{'up': item.Up >= (i+1)}" v-for="(s,i) in HEROS[item.Id].star"></div>
						</div>
						<div class="range">
							<div class="army">
								<img :src="`https://cbg-stzb.res.netease.com/mvvm/rc6f73b651ed47551555446b20/images/bz/${HEROS[item.Id].army}.png`">
							</div>
							<span class="icon-text">{{ HEROS[item.Id].limit }}</span>
						</div>
						<div class="cost">
							<div class="cost-icon"></div>
							<div>{{ HEROS[item.Id].cost / 10 }}</div>
						</div>
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
						<div class="stars">
							<div class="star up" v-for="s in HEROS[item.Id].star"></div>
						</div>
						<div class="range">
							<div class="army">
								<img :src="`https://cbg-stzb.res.netease.com/mvvm/rc6f73b651ed47551555446b20/images/bz/${HEROS[item.Id].army}.png`">
							</div>
							<span class="icon-text">{{ HEROS[item.Id].limit }}</span>
						</div>
						<div class="cost">
							<div class="cost-icon"></div>
							<div>{{ HEROS[item.Id].cost / 10 }}</div>
						</div>
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
			<!-- <div class="stbtn-1" @click="testfunc">DeBug</div> -->
			<div class="stbtn-1" @click="battleStart">开始战斗</div>
			<div class="stbtn-1">统计</div>
			<div class="stbtn-1" @click="showTeamConfig = true">配置队伍</div>
			<div class="stbtn-1" @click="showBattleRecord = !showBattleRecord">{{ showBattleRecord ? '隐藏战报' : '显示战报' }}
			</div>
		</div>
		<div class="record" v-if="showBattleRecord">
			<div class="record-item" v-for="e in battleinfo.Record?.Records"
				:class="{ 'round-title': e.roundTitle == 1, 'hero-round-start': e.heroRoundStart == 1 }"
				:style="{ 'background-image': (e.heroRoundStart == 1 ? `url(/assets/card/${e.hero1.Id}_long.png)` : '') }">

				<div class="sub" v-if="e.level == 1"></div>
				<span v-if="e.hero1"
					:style="{ 'color': (e.hero1?.BattleCamp == 'blue' ? 'rgb(154,213,137)' : 'rgb(255,72,71)') }">【{{
		e.hero1?.Name }}】</span>
				<span v-if="e.predicate">{{ e.predicate }}</span>
				<span v-if="e.hero2"
					:style="{ 'color': (e.hero2?.BattleCamp == 'blue' ? 'rgb(154,213,137)' : 'rgb(255,72,71)') }">【{{
		e.hero2?.Name }}】</span>
				{{ e.msg }}
				<span v-if="e.heroRoundStart == 1" style="flex-grow: 2;text-align: right;">兵力 {{ e.arms }}</span>
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

					.skills {
						display: flex;
						display: none;
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

					.stars {
						display: flex;
						position: absolute;
						top: 3%;
						right: 10%;
						transform: scale(1.1);

						&>.star {
							width: 1vw;
							height: 1vw;
							background: url(data:image/png;base64,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) no-repeat;
							background-size: 100% 100%;

							&.up {
								background-image: url(data:image/png;base64,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);
							}
						}
					}

					.range {
						display: flex;
						position: absolute;
						bottom: 1.3%;
						right: 2%;
						color: #fff;
						text-shadow: 0 .2vw .2vw #000;
						white-space: nowrap;
						height: 16%;

						&>span {
							display: block;
							position: absolute;
							right: 10%;
							bottom: 1%;
							font-size: 110%;
						}

						&>.army {
							position: relative;
							background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAApVBMVEUAAAAREREICAgVFRUTExMREREZGRkXFxcNDQ0SEhIQEBAUFBQgICAeHh4QEBAVFRUWFhYfHx8VFRUcHBwLCwsWFhYWFhYKCgoODg4UFBQdHR0RERENDQ0MDAwICAgHBwciIiIgICAfHx8eHh4hISEMDAwSEhIeHh4hISEiIiIUFBQPDw8XFxcbGxsfHx8JCQkwMDAlJSU0NDQrKys3NzcoKCg6OjoMbVbWAAAAKnRSTlMAFuaKIhzj2dAoCgb28MWqnnEt692YkmUPtoSAd29cVEpDPDX52Lx6Z2EQI/wwAAABrElEQVRYw93N6VLCMBSG4aCggiiIggsuuGu2Nl24/0vzNJPMmdKmhtM/jt9h+AHzvGF/fpOefnHw1NMnSZ/CGDwWaF7rJHns440hF4bWC4EFkk8SW7je3185TyyM0FMK1psSvC8YKNA9FEqTiId4/+69sLdvYeA9OFxpRGRhcCIEeLd64T7W57wZ4DkWCB4LNI+Fdae/QR8ukD13hcOwPxeirDxvO5uQeYmFkA/N/iPTYGHS+b7l8O0KIZ9KERxgO1tYhT3vOMGryTTnfLXrPzhvvs8bw8Ky4fNUBsDvhdNb9PGFOdVjgeixsHaBGTFwPGAxBdk2laay8liQ8Evs0ONmEgqK7LEQ70dsZ/Pogsq8bxYyFeePwEcW1O5ZP2StW9pCDdUbMPRdBUTO2bn3FfjgVkqlmVbBaecJBfRj1rlDWwj7S/ThQlboVl9k1hMK6BcsYneuUH3w0EcXwNffP0MfXfBn/SuL3qcvKG1nikyjjyponRUGKM3DLnzB+xfGqAWzzfQUPKWwNehJhWJrzLbQ02fGyAX0hH1BAT2xoN82rMe+DXpiYcP+/X4AX3AhFMcnM/MAAAAASUVORK5CYII=) no-repeat;
							background-size: 100% 100%;
							height: 100%;
							width: 100%;

							img {
								width: 100%;
								height: 100%;
								transform: scale(.85);
							}
						}
					}

					.cost {
						display: flex;
						position: absolute;
						bottom: 1%;
						left: 35%;
						color: #fff;
						text-shadow: 0 .2vw .2vw #000;
						white-space: nowrap;
						font-size: .8vw;
						align-items: center;

						.cost-icon {
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

			padding: 0 7.2vw;

			&.round-title {
				font-family: "FZLBJW_B";
				background-color: rgba(0, 0, 0, .5);
				padding: 0.3vw 0;
				margin: .3vw 0;
				justify-content: center;
				align-items: center;
				font-size: .9vw;
				color: #e4dd9e;
			}

			&.hero-round-start {
				background-color: rgba(0, 0, 0, .5);
				padding-top: 0.6vw;
				padding-bottom: 0.6vw;
				margin: .3vw 0;
				color: #e4dd9e;
				background-repeat: no-repeat;
				// background-position: left 20%;
				background-size: contain;
			}


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
