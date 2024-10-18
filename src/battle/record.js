/**
 * 战报系统
 */

export class Record {
    constructor(){
        this.Records = [];
    }

    // 加入一条有当事者和目标(来源)的记录
    pushActionRecord(hero1,hero2,predicate,msg,level=0){
        let record = {
            predicate,
            hero1,
            hero2,
            level,
            msg
        }

        this.Records.push(record);
    }

    // 加入一条普通记录
    pushRecord(hero1,msg,level=0){
        let record = {
            hero1,
            msg,
            level
        }

        this.Records.push(record);
    }

    // 加入一套系统记录
    pushSysRecord(msg,level=0){
        let record = {
            msg,
            level
        }

        this.Records.push(record);
    }

    pushRoundRecord(msg){
        let record = {
            msg,
            level: 0,
            roundTitle: 1
        }

        this.Records.push(record);
    }

    pushHeroRoundStart(hero1){
        let record = {
            hero1,
            msg: "行动阶段",
            level: 0,
            heroRoundStart: 1
        }

        this.Records.push(record);
    }
}