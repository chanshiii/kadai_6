// 以下の2つのインポートはダウンロードした際に宣言する 今回はCDNを使用するため無視、理想はNode.jsとかで自動的に参照できるようにする？
// import * as THREE from "./node_modules/three/src/Three."; 
// import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls.js"
// import { GLTFLoader } from "./GLTFLoader.js";

// console.log(THREE);

// scene
// ステージを用意
// 物体（メッシュ）を置くためのステージ（シーン）を用意する。
// three.jsを読み込み(今回はCDNを使用)、THREEオブジェクトが使えるようなったので、以下のように記述。
// new THREE宣言は、Three.jsライブラリーのクラスやメソッドを使用するための準備。
const scene = new THREE.Scene(); 

// sizes
const sizes = {
  width: innerWidth,
  height: innerHeight,
};

// camera 以下の数値
// fov:カメラの視野角（Field of View）を表す数値、一般的には75〜90度程度の値。
// aspect:カメラのアスペクト比を表す数値。画面の幅と高さの比率。ここでは、sizes.widthをsizes.heightで割った値が使用されています。
// near:カメラの手前にあるオブジェクトが描画される距離を表す数値。この値より手前にあるオブジェクトは描画されません。
// far:カメラから遠ざかっているオブジェクトが描画される距離を表す数値。この値より遠くにあるオブジェクトは描画されません。
const camera = new THREE.PerspectiveCamera(
  75, //fov 今回は広角レンズ、望遠カメラにするには視野角を狭くする(例えば数値を30deg)
  sizes.width / sizes.height, //aspect
  0.1, //near
  1000 //far
);

camera.position.set(0, 3, 65);

// renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
renderer.setClearColor("#90D7EC");

// スクリーンショットを取得する
//  将来設計で音を追加したい
// $("#scshot").on("click", function () {
//   navigator.permissions
//     .query({ name: "clipboard-write" })
//     .then(function (permissionStatus) {
//       if (permissionStatus.state === "granted") { //granted（許可された）かどうかを確認
//         requestAnimationFrame(function () {
//           const screenshot = renderer.domElement.toDataURL();
//           // スクリーンショットの処理
//           const a = $("<a>")
//             .attr("download", "screenshot.png")
//             .attr("href", screenshot);
//           $("body").append(a);
//           a[0].click(); // <a> タグをクリックしてファイルをダウンロード
//           a.remove(); // <a> タグを削除
//         });
//       } else {
//         console.log("スクリーンショットの許可が必要です。");
//       }
//     });
// });
// 確認画面の HTML を定義する
const confirmationDialogHtml = `
  <div id="confirmation-dialog">
    <p class="save_btn">保存しますか？</p>
    <button id="confirm-button">save</button>
    <button id="cancel-button">cancel</button>
  </div>
`;

$("#scshot").on("click", function () {
  // スクリーンショットを撮影する処理
  requestAnimationFrame(function () {
    const screenshot = renderer.domElement.toDataURL();

    // 確認画面を表示する
    $("body").append(confirmationDialogHtml);

    // 確認画面の「保存する」ボタンがクリックされたら、スクリーンショットを保存する
    $("#confirm-button").on("click", function () {
      const a = $("<a>")
        .attr("download", "screenshot.png")
        .attr("href", screenshot);
      $("body").append(a);
      a[0].click();
      a.remove();

      // 確認画面を削除する
      $("#confirmation-dialog").remove();
    });

    // 確認画面の「キャンセルする」ボタンがクリックされたら、確認画面を削除する
    $("#cancel-button").on("click", function () {
      $("#confirmation-dialog").remove();
    });
  });
});

// road 地面の作成
const roadMaterial = new THREE.MeshStandardMaterial({
  color : "gray",
});

const roadGeometry = new THREE.PlaneGeometry(400,400);
const road = new THREE.Mesh(roadGeometry, roadMaterial);
road.rotation.x = -Math.PI * 0.5;
scene.add(road);

//tree stemとleafをまとめたものを作る
const tree = new THREE.Group();
scene.add(tree);

//stem 幹の作成
  const stemMaterial = new THREE.MeshStandardMaterial({
    color: "brown",
  });

  //leaf
  const leafMaterial = new THREE.MeshStandardMaterial({
    color: "green",
  });

  $("#tree_add").on("click", function () {
    const numTreesToAdd = 20; // 生成する木の数
    for (let i = 0; i < numTreesToAdd; i++) {
      const tree = new THREE.Group();
      //ランダムに木を生成する範囲
      tree.position.x = (Math.random() * 2 - 1) * 180;
      tree.position.z = (Math.random() - 0.5) * 400;
      scene.add(tree);

      //stem
      const stem = new THREE.Mesh(
        new THREE.BoxGeometry(1, 10, 1),
        stemMaterial
      );
      stem.position.y = 5;
      tree.add(stem);

      //leaf
      const leaf = new THREE.Mesh(
        new THREE.SphereGeometry(3, 16, 16),
        leafMaterial
      );
      leaf.position.y = 12;
      tree.add(leaf);
    }
  });

  // 木をランダムに配置する
  // for(let i=0; i < 25; i++){
  // const tree = new THREE.Group();

  // tree.position.x =(Math.random() * 2- 1)* 20; //Math.randomの×2(0~2)から1を引くので-1から1の間で取って20倍
  // tree.position.z =(Math.random() - 0.5) * 100;
  // scene.add(tree);

  // //stem
  // const stem = new THREE.Mesh(new THREE.BoxGeometry(1, 10, 1), stemMaterial);
  // stem.position.y = 5;
  // tree.add(stem);

  // //leaf
  // const leaf = new THREE.Mesh(new THREE.SphereGeometry(3, 16, 16), leafMaterial);
  // leaf.position.y = 12;
  // tree.add(leaf);
  // };

//cloud
// 雲の作成
const material = new THREE.MeshLambertMaterial({
      color: 0xdcdcdc,
      transparent: true,
      opacity: 0.5,
    });

    const numCloudToAdd = 20; // 一度に生成する雲の数
    $("#cloud_add").on("click" , function(){
      for(let i=0; i<numCloudToAdd; i++){
        const geometry = new THREE.SphereGeometry(20, 8, 62); //半径20の球体ジオメトリ
        const cloud = new THREE.Mesh(geometry, material);
        cloud.position.x = (Math.random() * 2 - 1) * 180;
        cloud.position.y = 100;
        cloud.position.z = (Math.random() - 0.5) * 400;
        scene.add(cloud);
      }
    });

// light
const ambientLight     = 'ambientLight';     // ambientLight の値を定義
const directionalLight = "directionalLight"; // directionalLight の値を定義
const hemisphereLight  = "hemisphereLight";  // hemisphereLight の値を定義
const pointLight       = 'pointLight';       // pointLight の値を定義
const rectAreaLight    = 'rectAreaLight';    // rectAreaLight の値を定義
const spotLight        = 'spotLight';        // spotLight の値を定義
const lightSelect      = $("#light_select"); // セレクトボックスを取得
lightSelect.on("change", function () {
  const selectedValue = $(this).val(); // 選択された値を取得
  if (selectedValue == ambientLight) {
    // ライトの変数名を以下のambient、directionalに変更した
    const light_1 = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light_1);
    const light_2 = new THREE.DirectionalLight(0x00ffff, 0.7);
    scene.add(light_2);
  }else if (selectedValue == directionalLight) {
    // 平行光源を作成
    // new THREE.DirectionalLight(色, 光の強さ)
    const light_3 = new THREE.DirectionalLight(0xffffff, 1);
    scene.add(light_3);
  }else if (selectedValue == hemisphereLight) {
    // 半球光源を作成
    // new THREE.HemisphereLight(空の色, 地の色, 光の強さ)
    const light_4 = new THREE.HemisphereLight(0x888888, 0x0000ff, 1.0);
    scene.add(light_4);
  }else if (selectedValue == pointLight) {
    // 点光源を作成
    // new THREE.PointLight(色, 光の強さ, 距離, 光の減衰率)
    const light_5 = new THREE.PointLight(0xffffff, 2, 50, 1.0);
    scene.add(light_5);
  }else if (selectedValue == rectAreaLight) {
    // 矩形光源を作成
    // new THREE.RectAreaLight(色, 光の強さ, 幅, 高さ)
    const light_6 = new THREE.RectAreaLight(0xffffff, 5.0, 10, 10);
    scene.add(light_6);
  }else if (selectedValue == spotLight) {
    // スポットライト光源を作成
    // new THREE.SpotLight(色, 光の強さ, 距離, 照射角, ボケ具合, 減衰率)
    const light_7 = new THREE.SpotLight(0xFFFFFF, 4, 30, Math.PI / 4, 10, 0.5);
    scene.add(light_7);
  }else {
  }
  console.log(selectedValue); // コンソールに表示
});


// const ambientLight = new THREE.AmbientLight(0xffffff,1);
// scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0x00ffff,0.7);
// scene.add(directionalLight);

//fog 霧作成
const fog = new THREE.Fog("#262837", 50, 7);
scene.fog = fog;

// controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping =true; //慣性をつけて動かす宣言

const clock = new THREE.Clock();

function animate(){
  const elapsedTime = clock.getElapsedTime(); //経過時間を取得する関数
  // console.log(elapsedTime);
  // camera update
  // 回転させたいときはx,z軸平面を触る 手前がZ座標で原点の0を中心に回っている
  camera.position.x = Math.cos(Math.PI * elapsedTime * 0.05) * 20; //周期の速度は0.15の部分
  camera.position.z = Math.sin(Math.PI * elapsedTime * 0.05) * 20;
  camera.lookAt(0, 3, 0); //カメラの向きをy軸方向に向ける宣言

  controls.update();
  // シーンを描画する
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

// サイズを変えたときの更新時の記述？
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setPixelRati (window.devicePixelRatio);
  renderer.setSize(sizes.width, sizes.height);
});

//人物作成 // モデルの読み込み
//fbxファイルの読み込み

animate();