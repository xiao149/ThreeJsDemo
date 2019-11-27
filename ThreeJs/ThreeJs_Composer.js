/*
 * @author xiening
 * Running this will allow you to show white line around objects which you selected.
 */
/*
  * 需要在jsp中导入的包
  <script src="./ThreeJs/three.js"></script>
  <script src="./ThreeJs/EffectComposer.js"></script>
  <script src="./ThreeJs/RenderPass.js"></script>
  <script src="./ThreeJs/OutlinePass.js"></script>
  <script src="./ThreeJs/FXAAShader.js"></script>
  <script src="./ThreeJs/ShaderPass.js"></script>
  <script src="./ThreeJs/CopyShader.js"></script>
  */

THREE.ThreeJs_Composer = function ( _renderer, _scene, _camera, _options, _selectobject) {
    var raycaster = new THREE.Raycaster();
  	var mouse = new THREE.Vector2();
    var composer = new THREE.EffectComposer( _renderer );
    var renderPass = new THREE.RenderPass( _scene, _camera );
    var selectedObjects = [];
    composer.addPass( renderPass );
    var outlinePass = new THREE.OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), _scene, _camera );
    outlinePass.edgeStrength = 5;//包围线浓度
    outlinePass.edgeGlow = 0.5;//边缘线范围
    outlinePass.edgeThickness = 2;//边缘线浓度
    outlinePass.pulsePeriod = 2;//包围线闪烁评率
    outlinePass.visibleEdgeColor.set( '#ffffff' );//包围线颜色
    outlinePass.hiddenEdgeColor.set( '#190a05' );//被遮挡的边界线颜色
    composer.addPass( outlinePass );
    var effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
    effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
    effectFXAA.renderToScreen = true;
    // composer.addPass( effectFXAA );

    window.addEventListener( 'click', onMouseClick);
    window.addEventListener( 'dblclick', onMouseDblClick);

    var door_state_left1 = true; //默认是门是关闭的
    var door_state_right1 = true; //默认是门是关闭的
    function onMouseClick( event ) {
        var x, y;
        if ( event.changedTouches ) {
            x = event.changedTouches[ 0 ].pageX;
            y = event.changedTouches[ 0 ].pageY;
        } else {
            x = event.clientX;
            y = event.clientY;
        }
        mouse.x = ( x / window.innerWidth ) * 2 - 1;
        mouse.y = - ( y / window.innerHeight ) * 2 + 1;
        raycaster.setFromCamera( mouse, _camera );
        var intersects = raycaster.intersectObjects( [ _scene ], true );

        if(intersects.length == 0){
            $("#label").attr("style","display:none;");//隐藏说明性标签
            return;
        }
        if(intersects[0].object.name == "地面" || (intersects[0].object.name == "") || (intersects[0].object.name == "墙面")){
            $("#label").attr("style","display:none;");//隐藏说明性标签
            selectedObjects.pop();
        }else{
            $("#label").attr("style","display:block;");// 显示说明性标签
            $("#label").css({left: x, top: y-40});// 修改标签的位置
            $("#label").text(intersects[0].object.name);// 显示模型信息

            selectedObjects.pop();
            selectedObjects.push( intersects[0].object );
            outlinePass.selectedObjects = selectedObjects;//给选中的线条和物体加发光特效
        }

        var Msg = intersects[0].object.name.split("$");
        if(Msg[0] == "货物") {
            _options.batchNo = "一个货物";
            _options.qty = "100";
            _options.qtyUom = "kg";
            _options.qty2 = "10";
            _options.selectObj = intersects[0].object.name;
            _selectobject.push( intersects[0].object );
        }

        if(intersects[0].object.name == "左门1"){
            if(door_state_left1){
                new TWEEN.Tween(intersects[0].object.rotation).to({
                    y: -0.5*Math.PI
                }, 5000).easing(TWEEN.Easing.Elastic.Out).onComplete(function(){
                }).start();
                door_state_left1 = false;
            }else{
                new TWEEN.Tween(intersects[0].object.rotation).to({
                    y: 0
                }, 5000).easing(TWEEN.Easing.Elastic.Out).onComplete(function(){
                }).start();
                door_state_left1 = true;
            }
        }else if(intersects[0].object.name == "右门1"){
            if(door_state_right1){
                new TWEEN.Tween(intersects[0].object.rotation).to({
                    y: 0.5*Math.PI
                }, 5000).easing(TWEEN.Easing.Elastic.Out).onComplete(function(){
                }).start();
                door_state_right1 = false;
            }else{
                new TWEEN.Tween(intersects[0].object.rotation).to({
                    y: 0
                }, 5000).easing(TWEEN.Easing.Elastic.Out).onComplete(function(){
                }).start();
                door_state_right1 = true;
            }
        }
    }

    function onMouseDblClick( event ) {
        var x, y;
        if ( event.changedTouches ) {
            x = event.changedTouches[ 0 ].pageX;
            y = event.changedTouches[ 0 ].pageY;
        } else {
            x = event.clientX;
            y = event.clientY;
        }
        mouse.x = ( x / window.innerWidth ) * 2 - 1;
        mouse.y = - ( y / window.innerHeight ) * 2 + 1;
        raycaster.setFromCamera( mouse, _camera );
        var intersects = raycaster.intersectObjects( [ _scene ], true );

        if(intersects.length == 0){
            return;
        }

        var Msg = intersects[0].object.name.split("$");
        if(Msg[0] == "货物") {
            var href = "DispatchAction.do?efFormEname=YMIQ083DP&inqu_status-0-storageUnitId=" + Msg[1];
            EFColorbox({
                href : href,
                title:"货物详情",
                innerWidth:'1200px',
                innerHeight:'800px',
                iframe : true,
                scrolling : false,
                overlayClose: false
            });
        }
    }

    return composer;
}
