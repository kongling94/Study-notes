   var emitter={
    //event是事件名 比如click move 这类的 calls是回调
    on:function(event,fn){    
      var handeles=this._handeles||(this._handeles={}),   //handeles是一个对象
          calls=handeles[event]||(handeles[event]=[]);    //calls是一个数组
          calls.push(fn)
    },
    off:function(){

    }
   }
    /*extend方法
     * 传入两个对象
     * o1是原来的对象、
     * o2是后添加的对象
     * 目的：把o2上的内容添加到o1上去 实现对o1的拓展*/
    function extend(o1, o2) {
        //for in 遍历
        for (var i in o2) {
            //判断o1 = undefined  修改赋值
            if (typeof o1[i] === "undefined") {
                o1[i] = o2[i]
            }
        }
        return o1
    }

    /*html2node转化节点的方法*/
    function html2node(str) {
        var container = document.createElement("div");
        container.innerHTML = str;
        return container.children[0]
    }

    /*模板*/
   var template = 
  '<div class="m-modal">\
    <div class="modal_align"></div>\
    <div class="modal_wrap animated">\
      <div class="modal_head">标题</div>\
      <div class="modal_body">内容</div>\
      <div class="modal_foot">\
        <a class="confirm" href="#">确认</a>\
        <a class="cancel" href="#">取消</a>\
      </div>\
    </div>\
  </div>';

   /*创建构造函数*/
    function Modal(options) {
        options = options || {};
        //因为layout在原型连上被公用，所以这里要对layout进行处理，让他是一个属于实例的内容 这里使用cloneNode 深度克隆
        this.container = this._layout.cloneNode(true);
        this.body = this.container.querySelector('.modal_body');
        this.wrap = this.container.querySelector('.modal_wrap');
        //如果我们传入的有参数，那么将参数也拓展到这个实例上
        extend(this, options);
        this._initEvent();
    }
    /*利用extend方法给Modal构造函数的原型上拓展方法
     * 注意：因为这些方法都是拓展在Modal的原型链上的，如果不是这个构造函数自身上的方法 那么他将被所有的实例所公用。_layout
     * */
    extend(Modal.prototype, {
        _layout: html2node(template),
        setContent: function (content) {
            if (!content) return;
            //如果是元素标签   就进行追加处理
            if (content.nodeType === 1) {
                //清空内容
                this.body.innerHTML = '';
                //设置内容
                this.body.appendChild(content);
            }
            //如果是字符串就添加文本
            else{
                this.body.innerHTML=content
            }
        },
        show:function(content){
            //如果传入的有参数内容，那么将这个内容使用setContent函数处理，在追加到body上
            if(content) this.setContent(content);
            document.body.appendChild(this.container);
            animateClass(this.wrap,this.animation.enter)
        },
        hide:function(){
            var container=this.container;
            animateClass(this.wrap,this.animation.leave,function(){
              document.body.removeChild(container);
            })
            
        },
         //初始化
        _initEvent:function(){
            this.container.querySelector('.confirm').addEventListener('click',this._onConfirm.bind(this));
            this.container.querySelector('.cancel').addEventListener('click',this._onCancel.bind(this));
        },
        _onConfirm:function(){
            this.onConfirm();
            this.hide();
        },
        _onCancel:function(){
            this.onCancel();
            this.hide();
        }
    })

//针对上面80行开始的代码来说，onConfirm和onCancel这些都是写死在函数内部的代码，并不利于我们解耦。所以在写代码的时候，可以将同类的功能先在一个对象中进行定义，使用的时候分别从对象中进行调用。
//可以使用原型的继承、混合 这些方式，推荐使用混合继承的方式，如果只是单纯的继承，就会替换实例的原型链，对于存在的实例来说不是很方便吗，如果使用extend混入拓展的话就很方便，利于以后的代码拓展
