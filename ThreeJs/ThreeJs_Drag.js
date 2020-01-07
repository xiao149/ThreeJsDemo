/*
 * @author xiening
 * Running this will allow you to drag three.js objects around the screen.
 */
/*
  * 需要在jsp中导入的包
  <script src="./ThreeJs/DragControls.js"></script>
  <script src="./ThreeJs/TransformControls.js"></script>
  */

THREE.ThreeJs_Drag = function ( _camera, _domElement, _scene, _controls, _isPaused) {
        // 过滤不是 Mesh 的物体,例如辅助网格
        var objects = [];
        for (var i = 0; i < _scene.children.length; i++) {
            var Msg =  _scene.children[i].name.split("$");
            if (_scene.children[i].isMesh && Msg[0] == "货物") {
                objects.push(_scene.children[i]);
            }
        }

        var dragControls = new THREE.DragControls( objects, _camera, _domElement );
				dragControls.addEventListener( 'dragstart', function ( event ) {
            _controls.enabled = false;
            _isPaused = true;
				} );
				dragControls.addEventListener( 'dragend', function ( event ) {
            _controls.enabled = true;
            _isPaused = false;
				} );
    // // 添加平移控件
    // var transformControls = new THREE.TransformControls(_camera, _domElement);
    // transformControls.addEventListener( 'change', function () {
    //     cancelHideTransform();
    // } );
    // transformControls.addEventListener( 'mouseDown', function () {
    //     cancelHideTransform();
    // } );
    // transformControls.addEventListener( 'mouseUp', function () {
    //     delayHideTransform();
    // } );
    // _scene.add(transformControls);
    //
    // // 过滤不是 Mesh 的物体,例如辅助网格
    // var objects = [];
    // for (var i = 0; i < _scene.children.length; i++) {
    //     var Msg =  _scene.children[i].name.split("$");
    //     if (_scene.children[i].isMesh && Msg[0] == "货物") {
    //         objects.push(_scene.children[i]);
    //     }
    // }
    //
    // // 初始化拖拽控件
    // var dragControls = new THREE.DragControls(objects, _camera, _domElement);
    //
    // // 鼠标划入过事件
    // dragControls.addEventListener('hoveron', function (event) {
    //     // 让变换控件对象和选中的对象绑定
    //     transformControls.attach(event.object);
    //     cancelHideTransform();
    // });
    //
    // // 鼠标划出事件
    // dragControls.addEventListener('hoveroff', function (event) {
    //     delayHideTransform();
    // });
    //
    // // 开始拖拽
    // dragControls.addEventListener('dragstart', function (event) {
    //     controls.enabled = false;
    // });
    //
    // // 拖拽结束
    // dragControls.addEventListener('dragend', function (event) {
    //     controls.enabled = true;
    // });
    //
    // controls.addEventListener( 'start', function () {
    //     cancelHideTransform();
    // } );
    //
    // controls.addEventListener( 'end', function () {
    //     delayHideTransform();
    // } );
    //
    // var hiding;
    // function delayHideTransform() {
    //     cancelHideTransform();
    //     hideTransform();
    // }
    //
    // function hideTransform() {
    //     hiding = setTimeout( function () {
    //         transformControls.detach( transformControls.object );
    //     }, 1000 );
    // }
    //
    // function cancelHideTransform() {
    //     if ( hiding ) clearTimeout( hiding );
    // }
    //
    // return transformControls;
}
