//score.js
const util = require('../../utils/util.js')
var Bmob = require('../../utils/bmob.js');
const app = getApp();
Page({
  data: {
    scores: [],
    hiddenLoading:false
  },
  onLoad: function () {

    var Score = Bmob.Object.extend("UserScore");
    var query = new Bmob.Query(Score);
    query.descending("UserScore");
    var that = this;

    query.equalTo("wxOpenId", app.globalData.opendId.toString());
    query.descending("UserScore");
    query.find({
      success: function (results) {
        if (results.length > 0) {
          var score =results[0];
          score.set("UserId", app.globalData.userInfo.nickName.toString());
          score.set('UserScore', wx.getStorageSync('wx_mycoins') || 0);
          score.set('UserAvatarUrl', app.globalData.userInfo.avatarUrl.toString());
          score.save();
        }
        else {
          var score = new Score();
          score.set("wxOpenId", app.globalData.opendId.toString());
          score.set("UserId", app.globalData.userInfo.nickName.toString());
          score.set("UserScore", wx.getStorageSync('wx_mycoins') || 0);
          score.set('UserAvatarUrl', app.globalData.userInfo.avatarUrl.toString());
          //添加数据，第一个入口参数是null
          score.save(null, {
            success: function (result) {
              console.log("成功, objectId:" + result.id);
            },
            error: function (result, error) {

            }
          });
        }

              },
      error: function (result, error) {
        console.log('更新失败' + error);

      }

    }).then(
      function(){
        query = new Bmob.Query(Score);
        query.descending("UserScore");
        
        // 查询所有数据    
        query.find({
          success: function (results) {
            //console.log("总数:" + results.length);
            that.setData({
              scores: results,
              hiddenLoading:true
            })
            //console.log(results[0].UserAvatarUrl);
          },
          error: function (error) {
            console.log("查询出错");
          }
        });
      }
    );
  }
})
