var scene, mouse, camera, renderer, raycaster, INTERSECTED, intersects;
var theta = 0, radius = 100;

var mesh, geo, material;
var meshArr = [];

var grid1, grid2, division, limit, moveable

var img_arr = [
    "balance.jpg",
    "cntrl.png",
    "dstrt.jpeg",
    "infinite.jpg"
];

init();
animate();

function init() {

    scene = new THREE.Scene();
    mouse = new THREE.Vector2();

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.z = 30;
    camera.position.y = 2;

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.getElementById("canvas-container").appendChild(renderer.domElement);

    var controls = new THREE.OrbitControls(camera, renderer.domElement);

    window.addEventListener("resize", function() {

        var width = window.innerWidth;
        var height = window.innerHeight;

        renderer.setSize(width, height);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    var IMG_OBJ_ARR = [];
    var img_geo = new THREE.PlaneGeometry(8, 10);

    for (var i = 0; i < img_arr.length; i++) {

        var img_material = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load("./assets/Images/" + img_arr[i]),
            side: THREE.DoubleSide
        });

        var img = new THREE.Mesh(img_geo, img_material);
        scene.add(img);
        IMG_OBJ_ARR.push(img);
    }

    IMG_OBJ_ARR[0].position.set(20, 10, 5);
    IMG_OBJ_ARR[1].position.set(-20, 15, -10);
    IMG_OBJ_ARR[2].position.set(-20, -5, 5);
    IMG_OBJ_ARR[3].position.set(10, -5, 5);

    division = 30;
    limit = 200;
    grid1 = new THREE.GridHelper(limit * 2, division, "white", "white");
    grid2 = new THREE.GridHelper(limit * 2, division, "white", "white");

    moveable = [];
    
    for (let i = 0; i <= division; i++) {

        moveable.push(1, 1, 0, 0); // move horizontal lines only (1 - point is moveable)
    }
    
    grid1.geometry.addAttribute('moveable', new THREE.BufferAttribute(new Uint8Array(moveable), 1));
    grid2.geometry.addAttribute("moveable", new THREE.BufferAttribute(new Uint8Array(moveable), 1));

    grid1.name = "grid_plane1";
    grid2.name = "grid_plane2"

    grid1.material = new THREE.ShaderMaterial({
        uniforms: {
            time: {
            value: 0
            },
            limits: {
            value: new THREE.Vector2(-limit, limit)
            },
            speed: {
            value: 5
            }
        },
        vertexShader: `
            uniform float time;
            uniform vec2 limits;
            uniform float speed;
            
            attribute float moveable;
            
            varying vec3 vColor;
        
            void main() {
            vColor = color;
            float limLen = limits.y - limits.x;
            vec3 pos = position;
            if (floor(moveable + 0.5) > 0.5){ // if a point has "moveable" attribute = 1 
                float dist = speed * time;
                float currPos = mod((pos.z + dist) - limits.x, limLen) + limits.x;
                pos.z = currPos;
            } 
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
        
            void main() {
            gl_FragColor = vec4(vColor, 1.);
            }
        `,
        vertexColors: THREE.VertexColors
    });

    grid2.material = new THREE.ShaderMaterial({
        uniforms: {
            time: {
            value: 0
            },
            limits: {
            value: new THREE.Vector2(-limit, limit)
            },
            speed: {
            value: 5
            }
        },
        vertexShader: `
            uniform float time;
            uniform vec2 limits;
            uniform float speed;
            
            attribute float moveable;
            
            varying vec3 vColor;
        
            void main() {
            vColor = color;
            float limLen = limits.y - limits.x;
            vec3 pos = position;
            if (floor(moveable + 0.5) > 0.5){ // if a point has "moveable" attribute = 1 
                float dist = speed * time;
                float currPos = mod((pos.z + dist) - limits.x, limLen) + limits.x;
                pos.z = currPos;
            } 
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
        
            void main() {
            gl_FragColor = vec4(vColor, 1.);
            }
        `,
        vertexColors: THREE.VertexColors
    });

    clock = new THREE.Clock();
    time = 0;

    scene.add(grid1, grid2);

    grid1.position.set(0, -3, 0);
    grid2.position.set(0, 197, -100);
    grid2.rotation.x = 1.5;
    grid2.rotation.y = 3.142;
}

function animate() {

    requestAnimationFrame(animate);
    render();
}

function render() {

    time += clock.getDelta();
    grid1.material.uniforms.time.value = time;
    grid2.material.uniforms.time.value = time;

    renderer.render(scene, camera);
}