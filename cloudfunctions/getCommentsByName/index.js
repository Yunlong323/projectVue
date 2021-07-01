/**
 * 根据打卡地点名搜索打卡地点留言
 */
const cloud = require("@cloudbase/node-sdk");
const app = cloud.init({
    env: cloud.SYMBOL_CURRENT_ENV,
});
const db = app.database();
const _ = db.command;
const $ = db.command.aggregate;

exports.main = async(event, context) => {
    try {
        let pageIndex = event.pageIndex - 1;
        let pageSize = event.pageSize;
        let markerName = event.markerName;
        let nickName = event.nickName;
        let offset = pageIndex * pageSize;
        let page;
        let comments;
        // 获取全部评论
        if (markerName === "" && nickName == "") {
            page = await db.collection('comments')
                .aggregate()
                .lookup({
                    from: 'markers',
                    let: {
                        mid: '$markerID'
                    },
                    pipeline: $.pipeline()
                        .match(_.expr($.and([
                            $.eq(['$_id', '$$mid']),
                        ])))
                        .done(),
                    as: 'markerList',
                })
                .addFields({
                    listItem: $.arrayElemAt(['$markerList', 0]),
                })
                .addFields({
                    markerName: '$listItem.customCallout.content',
                    likeNum: $.size('$listItem.likes')
                })
                .project({
                    markerList: 0,
                    listItem: 0
                })
                .end();

            comments = await db.collection('comments')
                .aggregate()
                .lookup({
                    from: 'markers',
                    let: {
                        mid: '$markerID'
                    },
                    pipeline: $.pipeline()
                        .match(_.expr($.and([
                            $.eq(['$_id', '$$mid']),
                        ])))
                        .done(),
                    as: 'markerList',
                })
                .addFields({
                    listItem: $.arrayElemAt(['$markerList', 0]),
                })
                .addFields({
                    markerName: '$listItem.customCallout.content',
                    likeNum: $.size('$listItem.likes')
                })
                .project({
                    markerList: 0,
                    listItem: 0
                })
                .skip(offset)
                .limit(pageSize)
                .end();
            // 根据打卡点获取全部评论
        } else if (markerName !== "" && nickName == "") {
            page = await db.collection('comments')
                .aggregate()
                .lookup({
                    from: 'markers',
                    let: {
                        mid: '$markerID'
                    },
                    pipeline: $.pipeline()
                        .match(_.expr($.and([
                            $.eq(['$_id', '$$mid']),
                        ])))
                        .done(),
                    as: 'markerList',
                })
                .addFields({
                    listItem: $.arrayElemAt(['$markerList', 0]),
                })
                .addFields({
                    markerName: '$listItem.customCallout.content',
                    likeNum: $.size('$listItem.likes')
                })
                .project({
                    markerList: 0,
                    listItem: 0
                })
                .match({
                    markerName: markerName,
                })
                .end();

            comments = await db.collection('comments')
                .aggregate()
                .lookup({
                    from: 'markers',
                    let: {
                        mid: '$markerID'
                    },
                    pipeline: $.pipeline()
                        .match(_.expr($.and([
                            $.eq(['$_id', '$$mid']),
                        ])))
                        .done(),
                    as: 'markerList',
                })
                .addFields({
                    listItem: $.arrayElemAt(['$markerList', 0]),
                })
                .addFields({
                    markerName: '$listItem.customCallout.content',
                    likeNum: $.size('$listItem.likes')
                })
                .project({
                    markerList: 0,
                    listItem: 0
                })
                .match({
                    markerName: markerName,
                })
                .skip(offset)
                .limit(pageSize)
                .end();
            // 根据用户名获取全部评论
        } else if (markerName === "" && nickName !== "") {
            page = await db.collection('comments')
                .aggregate()
                .lookup({
                    from: 'markers',
                    let: {
                        mid: '$markerID'
                    },
                    pipeline: $.pipeline()
                        .match(_.expr($.and([
                            $.eq(['$_id', '$$mid'])
                        ])))
                        .done(),
                    as: 'markerList',
                })
                .addFields({
                    listItem: $.arrayElemAt(['$markerList', 0]),
                })
                .addFields({
                    markerName: '$listItem.customCallout.content',
                    likeNum: $.size('$listItem.likes'),
                    nickName: '$userinfo.nickName'
                })
                .project({
                    markerList: 0,
                    listItem: 0
                })
                .match({
                    nickName: nickName,
                })
                .end();

            comments = await db.collection('comments')
                .aggregate()
                .lookup({
                    from: 'markers',
                    let: {
                        mid: '$markerID'
                    },
                    pipeline: $.pipeline()
                        .match(_.expr($.and([
                            $.eq(['$_id', '$$mid'])
                        ])))
                        .done(),
                    as: 'markerList',
                })
                .addFields({
                    listItem: $.arrayElemAt(['$markerList', 0]),
                })
                .addFields({
                    markerName: '$listItem.customCallout.content',
                    likeNum: $.size('$listItem.likes'),
                    nickName: '$userinfo.nickName'
                })
                .project({
                    markerList: 0,
                    listItem: 0
                })
                .match({
                    nickName: nickName,
                })
                .skip(offset)
                .limit(pageSize)
                .end();
            // 根据打卡点 和 用户名获取全部评论
        } else {
            page = await db.collection('comments')
                .aggregate()
                .lookup({
                    from: 'markers',
                    let: {
                        mid: '$markerID'
                    },
                    pipeline: $.pipeline()
                        .match(_.expr($.and([
                            $.eq(['$_id', '$$mid'])
                        ])))
                        .done(),
                    as: 'markerList',
                })
                .addFields({
                    listItem: $.arrayElemAt(['$markerList', 0]),
                })
                .addFields({
                    markerName: '$listItem.customCallout.content',
                    likeNum: $.size('$listItem.likes'),
                    nickName: '$userinfo.nickName'
                })
                .project({
                    markerList: 0,
                    listItem: 0
                })
                .match({
                    markerName: markerName,
                    nickName: nickName
                })
                .end();

            comments = await db.collection('comments')
                .aggregate()
                .lookup({
                    from: 'markers',
                    let: {
                        mid: '$markerID'
                    },
                    pipeline: $.pipeline()
                        .match(_.expr($.and([
                            $.eq(['$_id', '$$mid'])
                        ])))
                        .done(),
                    as: 'markerList',
                })
                .addFields({
                    listItem: $.arrayElemAt(['$markerList', 0]),
                })
                .addFields({
                    markerName: '$listItem.customCallout.content',
                    likeNum: $.size('$listItem.likes'),
                    nickName: '$userinfo.nickName'
                })
                .project({
                    markerList: 0,
                    listItem: 0
                })
                .match({
                    markerName: markerName,
                    nickName: nickName
                })
                .skip(offset)
                .limit(pageSize)
                .end();
        }
        const commentList = comments.data ? comments.data : [];
        for (let obj of commentList) obj.id = ++offset;
        let total = page.data.length;
        return {
            commentList,
            total
        }
    } catch (err) {
        return {
            success: false,
            errMsg: '系统错误',
            err
        }
    }
}