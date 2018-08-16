<template>
  <div @click="globalEvent" class="edit-plate">
    <div id="editdiv" @click="judgeCursor($event)" ref="editContent" @keyup ="judgeCursor($event)" contentEditable="true" class="edit-box" placeholder="说说你的看法" />
    <div id="outSideOp" class="edit-op">
      <div class="edit-op-top">
        <i @click="insertImg" class="iconfont icon-13" :class="{'active':isOP=='image'}"></i>
        <i @click="insertLink" class="iconfont icon-link" :class="{'active':isOP=='link'}"></i>
        <i @click="insertFace" class="iconfont icon-face" :class="{'active':isOP=='face'}"></i>
      </div>
      <div v-show="isOP" class="edit-op-plate">
        <div v-show="isOP=='image'" class="edit-op-image">
           <div class="edit-img-title"><span @click="checkImgType('location')" :class="{'active':isImgType=='location'}">本地图片</span><span @click="checkImgType('net')" :class="{'active':isImgType=='net'}">网络图片</span></div>
          <div class="edit-img-con">
            <div @click="inserLocationImg" v-show="isImgType=='location'" class="edit-img-location">
               <i class="iconfont icon-upload"></i>
              <input @change="fileChange($event)" type="file" id="locationImg" style="display: none"  accept="image/*" multiple/>
            </div>
            <div v-show="isImgType=='net'" class="edit-img-net">
               <p><font>URL：</font><input class="edit-input" v-model="imgNetUrl" type="text" /></p>
              <p><span @click="insertNetImg" class="edit-op-insert">确定</span><label v-show="isImgValid" class="color-red">URL不能为空</label></p>
            </div>
          </div>
        </div>
        <div v-show="isOP=='link'" class="edit-op-link">
          <p><font>URL：</font><input class="edit-input" v-model="linkUrl" type="text" /> </p>
          <p><font>标题：</font><input class="edit-input" v-model="linkTitle" type="text" /></p>
          <p><span @click="inserLinkEnsure" class="edit-op-insert">确定</span><label v-show="isLinkValid" class="color-red">URL、标题不能为空</label></p>
        </div>
        <div v-show="isOP=='face'" class="edit-op-face">
          <img @click="insertExpression(item)" v-for="item in 71" :src="item | faceFilter"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {insertHtmlAtCaret} from '../assets/jscript/insert'
  import axios from 'axios'
  export default {
    name:'edit',
    props:['uploadServerImgUrl','value'],
    mounted(){
      if(this.isSHowToast){
        setTimeout(() => {
          this.isSHowToast=false
        },2500);
      }
    },
    data(){
      return{
        isOP:'',
        isImgType:'location',
        lastEditRange:null,
        linkUrl:'',
        linkTitle:'',
        isLinkValid:false,
        isImgValid:false,
        imgNetUrl:'',
        innerText:this.value
      }
    },
    methods:{
      insertExpression(index){
        var img ='<img src="/static/edit/face/'+index+'.gif" />';
        insertHtmlAtCaret(img,this.lastEditRange);
        //this.lastEditRange=null;
        this.judgeCursor();
      },
      judgeCursor(){
        // 获取选定对象
        var selection = getSelection()
        // 设置最后光标对象
        this.lastEditRange = selection.getRangeAt(0);
      },
      insertImg(){
        this.isOP='image';
      },
      insertLink(){
        this.isOP='link';
      },
      insertFace(){
        this.isOP='face';
      },
      checkImgType(t){
        this.isImgType=t;
      },
      inserLinkEnsure(){
        if(!this.linkUrl||!this.linkTitle){
          this.isLinkValid=true;
          return
        }
        var link ='<a href='+this.linkUrl+'>'+this.linkTitle+'</a>';
        insertHtmlAtCaret(link,this.lastEditRange);
        this.linkUrl='';
        this.linkTitle='';
        this.isLinkValid=false;
        //this.lastEditRange=null;
        this.judgeCursor();
      },
      insertNetImg(){
        if(!this.imgNetUrl){
          this.isImgValid=true;
          return
        }
        var img='<img src='+this.imgNetUrl+' />';
        insertHtmlAtCaret(img,this.lastEditRange);
        this.imgNetUrl='';
        this.isImgValid=false;
       // this.lastEditRange=null;
        this.judgeCursor();
      },
      inserLocationImg(){
        document.getElementById('locationImg').click();
      },
      fileChange(e){
        var formData = new FormData();
        formData.append('file', e.target.files[0]);
        formData.append('type', 'test');
        axios({
          method: 'post',
          url: this.uploadServerImgUrl,
          data: formData,
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          }
        }).then(res=>{
          var img ='<img src="'+res.result+'" />';
          insertHtmlAtCaret(img,this.lastEditRange);
          //this.lastEditRange=null;
          this.judgeCursor();
        })
      },
      globalEvent(){
        var dp = document.getElementById('outSideOp');  // 设置目标区域
        if(dp){
          if(!dp.contains(event.target)){            //这句是说如果我们点击到了id为myPanel以外的区域
            this.isOP = '';
          }
        }
      }
    },
    filters:{
      faceFilter(index){
         var src='/static/edit/face/'+index+'.gif';
         return src;
      }
    }
  }
</script>
<style scoped>/*/static/edit/fonts/*/
  @import "../../static/edit/fonts/iconfont.css";
  .edit-plate{ width: 100%; height: 100%; border: 1px solid  #eee; position: relative;}
  .edit-box{ padding: 10px; font-size:13px; box-sizing: border-box; width: 100%;height:100%; padding-bottom: 30px;}
  .edit-box:empty:before{ content: attr(placeholder); color:#bbb;  }
  .edit-box:focus:before{ content:none;  }
  .edit-op{ position: absolute; bottom: 0; width: 100%;}
  .edit-op i{ margin: 0 5px;}
  .edit-op-top{ background: #f9f9f9; padding: 10px;}
  .edit-op-plate{ background: #f4f4f4; padding: 10px;}
  .edit-op-face img{ padding: 3px;}
  .edit-op-link{ font-size: 12px;}
  .edit-op-top .active{ color:#26a2ff; }
  .edit-input{ border: 1px solid #eee; height: 25px; line-height: 25px; padding: 0 5px;}
  .edit-op-insert{ background: #26a2ff; display: inline-block; width: 60px; height: 30px; line-height: 30px; color: #fff; border-radius: 5px; text-align: center; border: 1px solid #eee; font-size: 13px;}
  .edit-img-title{ height: 30px; line-height: 30px; font-size: 13px;}
  .edit-img-title span{ padding: 0 10px; line-height: 30px; display: inline-block;}
  .edit-img-title .active{ color: #26a2ff; border-bottom: 2px solid #26a2ff;}
  .edit-img-location{ padding: 15px 20px; border-radius: 10px; cursor: pointer; border: 2px dotted #ccc; width: 100px;margin:20px 10px; text-align: center;}
  .edit-img-location i{ font-size: 30px; color: #ccc;}
  .edit-img-net font{ font-size: 13px; padding-right: 5px;}
  .edit-img-con{ padding-top: 0px;}
  .edit-img-title{ border-bottom: 1px solid #eee;}
  .color-red{ color: #fe0c3e; padding-left: 10px; font-size: 12px;}
</style>
