// 以下の2つのインポートはダウンロードした際に宣言する 今回はCDNを使用するため無視、理想はNode.jsとかで自動的に参照できるようにする？
// import * as THREE from "./node_modules/three/src/Three."; 
// import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls.js"

// console.log(THREE);

// scene
const scene = new THREE.Scene();

// sizes
const sizes = {
  width: innerWidth,
  height: innerHeight,
};

// camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);

camera.position.set(0, 3, 65);

// renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
renderer.setClearColor("#262837");

// road
const roadMaterial = new THREE.MeshStandardMaterial({
  color : "gray",
});

const roadGeometry = new THREE.PlaneGeometry(70,200);
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
    const numTreesToAdd = 2; // 生成する木の数
    for (let i = 0; i < numTreesToAdd; i++) {
      const tree = new THREE.Group();

      tree.position.x = (Math.random() * 2 - 1) * 20;
      tree.position.z = (Math.random() - 0.5) * 100;
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


// light
const ambientLight = new THREE.AmbientLight(0xffffff,1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x00ffff,0.7);
scene.add(directionalLight);

//fog 霧作成
const fog = new THREE.Fog("#262837", 50, 7);
scene.fog = fog;

// controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping =true; //慣性をつけて動かす宣言

const clock = new THREE.Clock();

function animate(){
  const elapsedTime =clock.getElapsedTime(); //経過時間を取得する関数
  // console.log(elapsedTime);
  // camera update
  // 回転させたいときはx,z軸平面を触る 手前がZ座標で原点の0を中心に回っている
  camera.position.x =Math.cos(Math.PI * elapsedTime *0.15) *20; //周期の速度は0.15の部分
  camera.position.z =Math.sin(Math.PI * elapsedTime *0.15) *20;
  camera.lookAt(0,3,0); //カメラの向きをy軸方向に向ける宣言

  controls.update();

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

// サイズを変えたときの更新時の記述？
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(sizes.width, sizes.height);
});

animate();