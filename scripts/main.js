var scene, mouse, camera, renderer, raycaster, INTERSECTED, intersects;
var theta = 0, radius = 100;

var mesh, geo, material;
var meshArr = [];

var cube, grid1, grid2, grid3, grid4, grid5, grid6, division, limit, moveable, obj_arr = [];
var mouse, raycaster, INTERSECTED, intersects, tempV;

var colour_detect = new THREE.Color(0xffffff);

var img_arr = [
    "balance-pathway.jpg",
    "balance-pose.jpg",
    "balance-space.jpg",
    "cntrl-pathway.jpg",
    "cntrl-pose.jpg",
    "cntrl-space.jpg",
    "dstrt-pathway.jpg",
    "dstrt-pose.jpg",
    "dstrt-space.jpg",
    "infinite-pathway.jpg",
    "infinite-pose.jpg",
    "infinite-space.jpg"
];

function init() {

    scene = new THREE.Scene();
    mouse = new THREE.Vector2();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 120;
    camera.position.y = 100;

    mouse = new THREE.Vector2();

    renderer = new THREE.WebGLRenderer({antialias: false});
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.getElementById("canvas-container").appendChild(renderer.domElement);

    var orbit = new THREE.OrbitControls(camera, renderer.domElement);

    orbit.minDistance = 200; //zoom
    orbit.maxDistance = 250;

    orbit.minPolarAngle = 0; //vertical pan
    orbit.maxPolarAngle = Math.PI / 2;

    // orbit.minAzimuthAngle = -0.5; //horizontal pan || set to halfmoon
    // orbit.maxAzimuthAngle = 0.5;

    orbit.update();

    window.addEventListener("resize", function() {

        var width = window.innerWidth;
        var height = window.innerHeight;

        renderer.setSize(width, height);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    var cube_geo = new THREE.BoxGeometry(30, 30, 30);

    var cube_material = [

        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./assets/Images/" + img_arr[0]), color: 0xffffff}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./assets/Images/" + img_arr[0]), color: 0xffffff}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./assets/Images/" + img_arr[0]), color: 0xffffff}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./assets/Images/" + img_arr[0]), color: 0xffffff}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./assets/Images/" + img_arr[0]), color: 0xffffff}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./assets/Images/" + img_arr[0]), color: 0xffffff}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./assets/Images/" + img_arr[0]), color: 0xffffff})
    ];

    var cube_face = new THREE.MeshFaceMaterial(cube_material);

    cube = new THREE.Mesh(cube_geo, cube_face);
    cube.name = "cube-object";

    cube.callback = function() {

        console.log(this);
    }

    cube.position.y = 100;
    cube.position.z = 100;

    scene.add(cube);
    obj_arr.push(cube);


        setInterval(function() {

            cube.material[0].map = new THREE.TextureLoader().load("./assets/Images/" + img_arr[Math.floor(Math.random() * img_arr.length)]);
        }, 1000);
    
        setInterval(function() {
    
            cube.material[1].map = new THREE.TextureLoader().load("./assets/Images/" + img_arr[Math.floor(Math.random() * img_arr.length)]);
        }, 3000);
    
        setInterval(function() {
    
            cube.material[2].map = new THREE.TextureLoader().load("./assets/Images/" + img_arr[Math.floor(Math.random() * img_arr.length)]);
        }, 4000);
    
        setInterval(function() {
    
            cube.material[3].map = new THREE.TextureLoader().load("./assets/Images/" + img_arr[Math.floor(Math.random() * img_arr.length)]);
        }, 5000);
    
        setInterval(function() {
    
            cube.material[4].map = new THREE.TextureLoader().load("./assets/Images/" + img_arr[Math.floor(Math.random() * img_arr.length)]);
        }, 6000);
    
        setInterval(function() {
    
            cube.material[5].map = new THREE.TextureLoader().load("./assets/Images/" + img_arr[Math.floor(Math.random() * img_arr.length)]);
        }, 7000);

 
    division = 30;
    limit = 200;

    grid1 = new THREE.GridHelper(limit * 2, division, "white", "white");
    grid2 = new THREE.GridHelper(limit * 2, division, "white", "white");
    grid3 = new THREE.GridHelper(limit * 2, division, "white", "white");
    grid4 = new THREE.GridHelper(limit * 2, division, "white", "white");
    grid5 = new THREE.GridHelper(limit * 2, division, "white", "white");
    grid6 = new THREE.GridHelper(limit * 2, division, "white", "white");

    moveable = [];
    
    for (let i = 0; i <= division; i++) {

        moveable.push(1, 1, 0, 0); // move horizontal lines only (1 - point is moveable)
    }
    
    grid1.geometry.addAttribute('moveable', new THREE.BufferAttribute(new Uint8Array(moveable), 1));
    grid2.geometry.addAttribute("moveable", new THREE.BufferAttribute(new Uint8Array(moveable), 1));
    grid3.geometry.addAttribute("moveable", new THREE.BufferAttribute(new Uint8Array(moveable), 1));
    grid4.geometry.addAttribute("moveable", new THREE.BufferAttribute(new Uint8Array(moveable), 1));
    grid5.geometry.addAttribute("moveable", new THREE.BufferAttribute(new Uint8Array(moveable), 1));
    grid6.geometry.addAttribute("moveable", new THREE.BufferAttribute(new Uint8Array(moveable), 1));

    grid1.name = "grid_plane1";
    grid2.name = "grid_plane2";
    grid3.name = "grid_plane3";
    grid4.name = "grid_plane4";
    grid5.name = "grid_plane5";
    grid6.name = "grid_plane6";

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

    grid3.material = new THREE.ShaderMaterial({
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

    grid4.material = new THREE.ShaderMaterial({
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

    grid5.material = new THREE.ShaderMaterial({
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

    grid6.material = new THREE.ShaderMaterial({
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

    scene.add(grid1, grid2, grid3, grid4, grid5, grid6);
    obj_arr.push(grid1, grid2, grid3, grid4, grid5, grid6);

    grid1.position.set(0, -3, 100);

    grid2.position.set(0, 197, -100);
    grid2.rotation.x = 1.56;
    grid2.rotation.y = 3.142;

    grid3.position.set(-201, 197, 100);
    grid3.rotation.x = -1.57;
    grid3.rotation.z = 1.57;

    grid4.position.set(200, 196.5, 100);
    grid4.rotation.x = -1.57;
    grid4.rotation.z = 1.57;

    grid5.position.set(0, 196.5, 300);
    grid5.rotation.x = 1.57;
    grid5.rotation.y = 3.142;
    
    grid6.position.set(0, 397, 100);
}

function update() {

    time += clock.getDelta();

    cube.rotation.x += 0.002;
    cube.rotation.y += 0.002;

    grid1.material.uniforms.time.value = time;
    grid2.material.uniforms.time.value = time;
    grid3.material.uniforms.time.value = time;
    grid4.material.uniforms.time.value = time;
    grid5.material.uniforms.time.value = time;
    grid6.material.uniforms.time.value = time;
}

tempV = new THREE.Vector3();
raycaster = new THREE.Raycaster();

var render = function() {

    for (var x = 0; x < obj_arr.length; x++) {

        cube.updateWorldMatrix(true, false);
        cube.getWorldPosition(tempV);
    
        tempV.project(camera);
        raycaster.setFromCamera(tempV, camera);

        var label_x = (tempV.x * .5 + .5) * document.getElementsByTagName("canvas")[0].clientWidth;
        var label_y = (tempV.y * -.5 + .5) * document.getElementsByTagName("canvas")[0].clientHeight;

        document.getElementById("iyeism-text").style.transform = `translate(-50%, -50%) translate(${label_x}px,${label_y}px)`
        document.getElementById("iyeism-text-sub").style.transform = `translate(-50%, 330%) translate(${label_x}px,${label_y}px)`
        document.getElementById("iyeism-text-date").style.transform = `translate(-50%, 330%) translate(${label_x}px,${label_y}px)`
    }

    document.addEventListener("mousedown", onMouseDown, false);

    function onMouseDown(e) {

        e.preventDefault();

        mouse.x = (e.clientX / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(e.clientY / renderer.domElement.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        intersects = raycaster.intersectObjects(obj_arr, true);

        for (var i = 0; i < intersects.length; i++) {

            if (intersects[i].object.name == "cube-object") {

                window.open("https://www.iyeism.com/", target = "_self");
                document.body.style.cursor = "pointer";
            
            } else {
                console.log("nah");
            }
        }
    }

    renderer.render(scene, camera);
}

var animate = function() {

    setTimeout(function() {

        requestAnimationFrame(animate);

    }, 3000 / 3000);

    update();
    render();
}

init();
animate();