/**
 * Modules.js是3D库区图显示模型存放的地方
 *
 * @author 谢宁, Created on 2018-06-07
 */
/** ***************************************************************** */
//模型材质信息
var planeMat, RackMat, RackMat2, CargoMat, CargoMat_yuanliao, CargoMat_fuliao, CargoMat_baocai, CargoMat_zhongjian, CargoMat_huagong, CargoMat_chengpin, CargoMat_qita;
//库图环境配置信息
var enable_composer, enable_pan, enable_rotate, enable_zoom;
//库区信息
var storageZoneSize = 0, storageZoneList = [];
//货架信息
var shelfSize = 0, shelfList = [];
//货位信息
var storageUnitSize = 0, storageUnitList = [];
//货物信息
var cargoSize = 0, cargoList = [], CargosExist;

var PLANE_LENGTH = 24;
var PLANE_WIDTH = 55;
var PLANE_HEIGHT = 2;
var HOLDER_LENGTH = 2;
var HOLDER_WIDTH = 2;
var HOLDER_HEIGHT = 25;
var LAYER_NUM = 3;
var COLUMN_NUM = 2;

//创建库区对象
function storageZone(StorageZoneId,StorageZoneName,
                     coordinateX,coordinateZ,
                     width,length,
                     textColor,fontSize,textposition)
{
    this.StorageZoneId=StorageZoneId;
    this.StorageZoneName=StorageZoneName;
    this.coordinateX=coordinateX;
    this.coordinateZ=coordinateZ;
    this.width=width;
    this.length=length;
    this.textColor=textColor;
    this.fontSize=fontSize;
    this.textposition=textposition;
}

//根据库区编码获取库区对象
function getStorageZoneById(StorageZoneId) {
    for(var i = 0; i < storageZoneSize; i++){
        if(storageZoneList[i].StorageZoneId == StorageZoneId){
            return storageZoneList[i];
        }
    }
}

//创建货架对象
function shelf(storageZoneId, shelfId, shelfName,
               planeLength , planeWidth , planeHeight ,
               holderLength , holderWidth , holderHeight ,
               positionX , positionY , positionZ ,
               layerNum , columnNum)
{
    this.storageZoneId=storageZoneId;
    this.shelfId=shelfId;
    this.shelfName=shelfName;
    this.planeLength=planeLength;
    this.planeWidth=planeWidth;
    this.planeHeight=planeHeight;
    this.holderLength=holderLength;
    this.holderWidth=holderWidth;
    this.holderHeight=holderHeight;
    this.positionX=positionX;
    this.positionY=positionY;
    this.positionZ=positionZ;
    this.layerNum=layerNum;
    this.columnNum=columnNum;
}

//根据货架编码获取货架对象
function getShelfById(shelfId) {
    for(var i = 0; i < shelfSize; i++){
        if(shelfList[i].shelfId == shelfId){
            return shelfList[i];
        }
    }
}

//创建货位对象
function storageUnit(storageZoneId, shelfId, shelfName,
               inLayerNum , inColumnNum ,
               positionX , positionY , positionZ, storageUnitId)
{
    this.storageZoneId=storageZoneId;
    this.shelfId=shelfId;
    this.shelfName=shelfName;
    this.inLayerNum=inLayerNum;
    this.inColumnNum=inColumnNum;
    this.positionX=positionX;
    this.positionY=positionY;
    this.positionZ=positionZ;
    this.storageUnitId=storageUnitId;
}

//根据货架ID、层数、列数获取货位对象
function getStorageUnitById(shelfId,inLayerNum,inColumnNum) {
    for(var i = 0; i < storageUnitSize; i++){
        if(storageUnitList[i].shelfId == shelfId && storageUnitList[i].inLayerNum == inLayerNum && storageUnitList[i].inColumnNum == inColumnNum){
            return storageUnitList[i];
        }
    }
}

//根据库位编码获取货位对象
function getStorageUnitByUnitId(storageUnitId) {
    for(var i = 0; i < storageUnitSize; i++){
        if(storageUnitList[i].storageUnitId == storageUnitId){
            return storageUnitList[i];
        }
    }
}

//创建货物对象
function cargo(batchNo, prodBatchNo, inBatchNo,
               matId, matClassId, matName,
               qty, qtyUom, qty2,
               warehouseId, storageZoneId, storageUnitId,
               positionX , positionY , positionZ,
               length , width , height)
{
    this.batchNo=batchNo;
    this.prodBatchNo=prodBatchNo;
    this.inBatchNo=inBatchNo;
    this.matId=matId;
    this.matClassId=matClassId;
    this.matName=matName;
    this.qtyUom=qtyUom;
    this.qty2=qty2;
    this.warehouseId=warehouseId;
    this.storageZoneId=storageZoneId;
    this.storageUnitId=storageUnitId;
    this.positionX=positionX;
    this.positionY=positionY;
    this.positionZ=positionZ;
    this.length=length;
    this.width=width;
    this.height=height;
}

/** 初始化材质信息 */
function initMat() {
    planeMat = new THREE.MeshLambertMaterial();
    RackMat = new THREE.MeshLambertMaterial();
    RackMat2 = new THREE.MeshPhongMaterial({color:0x1C86EE});
    CargoMat = new THREE.MeshLambertMaterial();
    CargoMat_yuanliao = new THREE.MeshLambertMaterial();//原料
    CargoMat_fuliao = new THREE.MeshLambertMaterial();//辅料
    CargoMat_baocai = new THREE.MeshLambertMaterial();//包材
    CargoMat_huagong = new THREE.MeshLambertMaterial();//化工品
    CargoMat_zhongjian = new THREE.MeshLambertMaterial();//中间品
    CargoMat_chengpin = new THREE.MeshLambertMaterial();//成品
    CargoMat_qita = new THREE.MeshLambertMaterial();//其他

    new THREE.TextureLoader().load( './ThreeJs/images/plane.png', function( map ) {
        planeMat.map = map;
        planeMat.transparent = true;
        planeMat.opacity = 0.8;
        planeMat.needsUpdate = true;
    } );
    new THREE.TextureLoader().load( "./ThreeJs/images/rack.png", function( map ) {
        RackMat.map = map;
        RackMat.needsUpdate = true;
    } );
    new THREE.TextureLoader().load( "./ThreeJs/images/box.png", function( map ) {
        CargoMat.map = map;
        CargoMat.needsUpdate = true;
    } );
    new THREE.TextureLoader().load( "./ThreeJs/images/原料.png", function( map ) {
        CargoMat_yuanliao.map = map;
        CargoMat_yuanliao.needsUpdate = true;
    } );
    new THREE.TextureLoader().load( "./ThreeJs/images/辅料.png", function( map ) {
        CargoMat_fuliao.map = map;
        CargoMat_fuliao.needsUpdate = true;
    } );
    new THREE.TextureLoader().load( "./ThreeJs/images/包材.png", function( map ) {
        CargoMat_baocai.map = map;
        CargoMat_baocai.needsUpdate = true;
    } );
    new THREE.TextureLoader().load( "./ThreeJs/images/化工品.png", function( map ) {
        CargoMat_huagong.map = map;
        CargoMat_huagong.needsUpdate = true;
    } );
    new THREE.TextureLoader().load( "./ThreeJs/images/中间品.png", function( map ) {
        CargoMat_zhongjian.map = map;
        CargoMat_zhongjian.needsUpdate = true;
    } );
    new THREE.TextureLoader().load( "./ThreeJs/images/成品.png", function( map ) {
        CargoMat_chengpin.map = map;
        CargoMat_chengpin.needsUpdate = true;
    } );
    new THREE.TextureLoader().load( "./ThreeJs/images/其他.png", function( map ) {
        CargoMat_qita.map = map;
        CargoMat_qita.needsUpdate = true;
    } );
}

/* 放置天空盒 **/
// function addSkybox( size,scene ) {
//     urls = [
//         './BM2P/images/right.jpg', // right
//         './BM2P/images/left.jpg', // left
//         './BM2P/images/top.jpg', // top
//         './BM2P/images/down.jpg', // bottom
//         './BM2P/images/back.jpg', // back
//         './BM2P/images/front.jpg'  // front
//     ];
//     var skyboxCubemap = new THREE.CubeTextureLoader().load( urls );
//     skyboxCubemap.format = THREE.RGBFormat;
//
//     var skyboxShader = THREE.ShaderLib['cube'];
//     skyboxShader.uniforms['tCube'].value = skyboxCubemap;
//     var obj = new THREE.Mesh(
//         new THREE.BoxGeometry( size, size, size ),
//         new THREE.ShaderMaterial({
//             fragmentShader : skyboxShader.fragmentShader,
//             vertexShader : skyboxShader.vertexShader,
//             uniforms : skyboxShader.uniforms,
//             depthWrite : false,
//             side : THREE.BackSide
//         })
//     );
//     scene.add( obj );
// }

//region 库区
/** 放置虚线框区域和库区名称 */
function addArea(x,z,width,length,scene,name,textColor,font_size,textposition) {
    var geometry = new THREE.PlaneGeometry( width, length );
    var obj = new THREE.Mesh( geometry, planeMat );
    obj.position.set(x,1.5,z);
    obj.rotation.x = -Math.PI / 2.0;
    obj.name = "库区"+"$"+name.split("$")[1];
    scene.add( obj );

    new THREE.FontLoader().load('./BM2P/js/FZYaoTi_Regular.json',function(font){
        ////加入立体文字
        var text= new THREE.TextGeometry(name.split("$")[1],{
            // 设定文字字体
            font:font,
            //尺寸
            size:font_size,
            //厚度
            height:0.01
        });
        text.computeBoundingBox();
        //3D文字材质
        var m = new THREE.MeshStandardMaterial({color:"#" + textColor});
        var mesh = new THREE.Mesh(text,m)
        if(textposition == "左对齐"){
            mesh.position.x = x - width/2 + 10;
        }else if(textposition == "居中"){
            mesh.position.x = x - 15;
        }else if(textposition == "右对齐"){
            mesh.position.x = x + width/2 - 60;
        }
        mesh.position.y = 1.3;
        mesh.position.z = z + length/2 - 20;
        mesh.rotation.x = -Math.PI / 2.0;
        scene.add(mesh);
    });
}

/** 根据3D库图库区配置表添加库区和文字 */
function addStorageZone(scene) {
    var eiinfo = new EiInfo();
    var ajax_callback = {
        onSuccess : function(eiinfo) {
            storageZoneSize = eiinfo.get("size");
            for(var i = 0; i < storageZoneSize; i++){
                var storageZone_obj = new storageZone(eiinfo.get("StorageZoneId")[i],
                    eiinfo.get("StorageZoneName")[i],
                    eiinfo.get("coordinateX")[i],
                    eiinfo.get("coordinateZ")[i],
                    eiinfo.get("width")[i],
                    eiinfo.get("length")[i],
                    eiinfo.get("textColor")[i],
                    eiinfo.get("fontSize")[i],
                    eiinfo.get("textposition")[i]);
                storageZoneList.push(storageZone_obj);
            }
        },
        onFail : function(eMsg) {
            EFAlert( "加载库图配置失败:"+eMsg ,"错误" );
        }
    };
    EiCommunicator.send("YMIQ083D", "queryStorageZoneConfig3D", eiinfo, ajax_callback);

    for(var i = 0;i < storageZoneSize; i++){
        addArea(storageZoneList[i].coordinateX,storageZoneList[i].coordinateZ,storageZoneList[i].width,storageZoneList[i].length,scene,storageZoneList[i].StorageZoneId+"$"+storageZoneList[i].StorageZoneName,storageZoneList[i].textColor,storageZoneList[i].fontSize,storageZoneList[i].textposition);
    }
}
//endregion

//region 货架货位

/** 放置单层货架 */
/** x,y,z 整个模型在场景中的位置 */
/** plane_x,plane_y,plane_z 货架板面的长高宽 */
/** holder_x,holder_y,holder_z 货架支架的长高宽 */
/** scene,name,num 要添加的场景,货架的名字,单层货架的库位数量 */
function addRack(x,y,z,plane_x,plane_y,plane_z,holder_x,holder_y,holder_z,scene,name,num) {
    var plane = new THREE.BoxGeometry( plane_x, plane_y, plane_z/num );
    var gz = [];
    for(var i = 0; i < num; i++){
        gz.push( z + plane_z/num/2 + (plane_z/num)*i );
        var obj = new THREE.Mesh( plane, RackMat );
        obj.position.set(x , y, gz[i]) ;
        var msg = name+"$"+(2-i);

        var eiinfo = new EiInfo();
        eiinfo.set("shelfId",msg.split("$")[1]);
        eiinfo.set("inLayerNum",msg.split("$")[3]);
        eiinfo.set("inColumnNum",msg.split("$")[4]);
        var storageUnitId = "";
        var ajax_callback = {
            onSuccess : function(eiinfo) {
                storageUnitId = eiinfo.get("storageUnitId");
            },
            onFail : function(eMsg) {
                EFAlert( "加载库图货架配置失败:"+eMsg ,"错误" );
            }
        };
        EiCommunicator.send("YMIQ083D", "queryStorageUnit", eiinfo, ajax_callback);

        //添加货位
        var storageUnit_obj = new storageUnit(msg.split("$")[0],
            msg.split("$")[1],
            msg.split("$")[2],
            msg.split("$")[3],
            msg.split("$")[4],
            x, y, gz[i], storageUnitId);
        storageUnitList.push(storageUnit_obj);
        storageUnitSize++;

        var Unit = getStorageUnitById(msg.split("$")[1],msg.split("$")[3],msg.split("$")[4]);
        obj.name = "货位"+"$"+Unit.storageUnitId;
        scene.add(obj);
    }

    var holder = new THREE.BoxGeometry( holder_x, holder_y, holder_z );
    var obj2 = new THREE.Mesh( holder, RackMat2 );
    var obj3 = new THREE.Mesh( holder, RackMat2 );
    var obj4 = new THREE.Mesh( holder, RackMat2 );
    var obj5 = new THREE.Mesh( holder, RackMat2 );

    obj2.position.set(x-plane_x/2+holder_x/2,y-holder_y/2-plane_y/2,z+holder_z/2);
    obj3.position.set(x+plane_x/2-holder_x/2,y-holder_y/2-plane_y/2,z+holder_z/2);
    obj4.position.set(x-plane_x/2+holder_x/2,y-holder_y/2-plane_y/2,z+plane_z-holder_z/2);
    obj5.position.set(x+plane_x/2-holder_x/2,y-holder_y/2-plane_y/2,z+plane_z-holder_z/2);
    scene.add(obj2);scene.add(obj3);scene.add(obj4);scene.add(obj5);
}

/** 放置一叠货架 */
/** stack_num 货架的叠数 */
function addStackOfRack(x,y,z,plane_x,plane_y,plane_z,holder_x,holder_y,holder_z,scene,name,num,stack_num) {
    for(var i = 0; i < stack_num; i++){
        addRack(x,y*(i+1),z,plane_x,plane_y,plane_z,holder_x,holder_y,holder_z,scene,name+"$"+(i+1),num);
    }
}

/** 根据3D库图货架配置表添加货架 */
function addShelf(scene) {
    var eiinfo = new EiInfo();
    var ajax_callback = {
        onSuccess : function(eiinfo) {
            shelfSize = eiinfo.get("size");
            for(var i = 0; i < shelfSize; i++){
                var shelf_obj = new shelf(eiinfo.get("StorageZoneId")[i],
                    eiinfo.get("shelfId")[i],
                    eiinfo.get("shelfName")[i],
                    PLANE_LENGTH,PLANE_WIDTH,PLANE_HEIGHT,
                    HOLDER_LENGTH,HOLDER_WIDTH,HOLDER_HEIGHT,
                    eiinfo.get("positionX")[i],
                    eiinfo.get("positionY")[i],
                    eiinfo.get("positionZ")[i],
                    LAYER_NUM,COLUMN_NUM);
                shelfList.push(shelf_obj);
            }
        },
        onFail : function(eMsg) {
            EFAlert( "加载库图货架配置失败:"+eMsg ,"错误" );
        }
    };
    EiCommunicator.send("YMIQ083D", "queryShelfConfig3D", eiinfo, ajax_callback);

    for(var i = 0;i < shelfSize; i++){
        addStackOfRack(shelfList[i].positionX,shelfList[i].positionY,shelfList[i].positionZ,shelfList[i].planeLength,shelfList[i].planeHeight,shelfList[i].planeWidth,shelfList[i].holderLength,shelfList[i].holderHeight,shelfList[i].holderWidth,scene,shelfList[i].storageZoneId+"$"+shelfList[i].shelfId+"$"+shelfList[i].shelfName,shelfList[i].columnNum,shelfList[i].layerNum);
    }
}

//region 货物
/** 放置单个货物 */
function addCargo(x,y,z,box_x,box_y,box_z,scene,name) {
    var geometry = new THREE.BoxGeometry( box_x, box_y, box_z );
    var obj = new THREE.Mesh( geometry, CargoMat );
    obj.position.set(x,y,z);
    obj.name = name;
    scene.add(obj);
}

/** 放置单个货物 */
function addOneCargo(num,floor,scene,name,matClassId) {
    var geometry = new THREE.BoxGeometry( 180, 180, 180 );
    var x,y,z;
    switch (num) {
        case 1 : x=-200;y=150+(floor-1)*180;z=200;break;
        case 2 : x=0;y=150+(floor-1)*180;z=200;break;
        case 3 : x=200;y=150+(floor-1)*180;z=200;break;
        case 4 : x=-200;y=150+(floor-1)*180;z=0;break;
        case 5 : x=0;y=150+(floor-1)*180;z=0;break;
        case 6 : x=200;y=150+(floor-1)*180;z=0;break;
        case 7 : x=-200;y=150+(floor-1)*180;z=-200;break;
        case 8 : x=0;y=150+(floor-1)*180;z=-200;break;
        case 9 : x=200;y=150+(floor-1)*180;z=-200;break;
        default : x=-200;y=150+(floor-1)*180;z=200;
    }
    var obj;
    switch (matClassId) {
        case "1" : obj = new THREE.Mesh( geometry, CargoMat_yuanliao );break;
        case "2" : obj = new THREE.Mesh( geometry, CargoMat_fuliao );break;
        case "3" : obj = new THREE.Mesh( geometry, CargoMat_baocai );break;
        case "4" : obj = new THREE.Mesh( geometry, CargoMat_huagong );break;
        case "5" : obj = new THREE.Mesh( geometry, CargoMat_zhongjian );break;
        case "7" : obj = new THREE.Mesh( geometry, CargoMat_chengpin );break;
        case "20" : obj = new THREE.Mesh( geometry, CargoMat_qita );break;
        default : obj = new THREE.Mesh( geometry, CargoMat_yuanliao )
    }
    obj.position.set(x,y,z);
    obj.name = name;
    scene.add(obj);
}

/** 查询单个货位上的货物是否存在 */
function queryCargosExist(storageZoneId,storageUnitId) {
    var eiinfo = new EiInfo();
    eiinfo.set("storageZoneId",storageZoneId);
    eiinfo.set("storageUnitId",storageUnitId);
    var ajax_callback = {
        onSuccess : function(eiinfo) {
            CargosExist = eiinfo.get("flag")
        }
    };
    EiCommunicator.send("YMIQ083D", "queryCargosExist", eiinfo, ajax_callback);
}

/** 查询单个货位上的货物 */
function queryOneUnitCargos(storageUnitId) {
    var eiinfo = new EiInfo();
    eiinfo.set("storageUnitId",storageUnitId);
    var ajax_callback = {
        onSuccess : function(eiinfo) {
            cargoSize = eiinfo.get("size");
            for(var i = 0; i < cargoSize; i++){
                var cargo_obj = new cargo(eiinfo.get("batchNo")[i],
                    eiinfo.get("prodBatchNo")[i],
                    eiinfo.get("inBatchNo")[i],
                    eiinfo.get("matId")[i],
                    eiinfo.get("matClassId")[i],
                    eiinfo.get("matName")[i],
                    eiinfo.get("qty")[i],
                    eiinfo.get("qtyUom")[i],
                    eiinfo.get("qty2")[i],
                    eiinfo.get("warehouseId")[i],
                    eiinfo.get("storageZoneId")[i],
                    eiinfo.get("storageUnitId")[i]);
                cargoList.push(cargo_obj);
            }
        },
        onFail : function(eMsg) {
            EFAlert( "加载库图货架配置失败:"+eMsg ,"错误" );
        }
    };
    EiCommunicator.send("YMIQ083DP", "queryOneUnitCargos", eiinfo, ajax_callback);
}

/** 添加单个货位上的货物 */
function addOneUnitCargos(shelfId,inLayerNum,inColumnNum,scene) {
    var storageUnit = getStorageUnitById(shelfId,inLayerNum,inColumnNum);
    var storageZoneId = storageUnit.storageZoneId;
    var shelf = getShelfById(storageUnit.shelfId);
    var storageUnitid = storageUnit.storageUnitId;
    queryCargosExist(storageZoneId,storageUnitid);
    if(CargosExist == "true"){
        var x = storageUnit.positionX;
        var y = storageUnit.positionY + 8 + shelf.planeHeight/2;
        var z = storageUnit.positionZ;
        addCargo(x,y,z,16,16,16,scene,"货物"+"$"+storageUnitid)
    }
}

/** 添加货物详情 */
function addCargoDetail(storageUnitId) {
    queryOneUnitCargos(storageUnitId);
    if(cargoList.length != 0){
        for(var i = 0; i < cargoSize; i++){
            addOneCargo(i+1-parseInt(i/9)*9,parseInt(i/9)+1,scene,"货物详情"+"$"+cargoList[i].batchNo,cargoList[i].matClassId)
        }
        cargoList = [];
    }
}
//endregion