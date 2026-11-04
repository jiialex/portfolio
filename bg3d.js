(function () {
  if (!window.THREE) return;
  var root = document.documentElement;
  var canvas = document.createElement("canvas");
  canvas.id = "bg3d";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.z = 8;

  var small = window.innerWidth < 768;
  var COUNT = small ? 350 : 800;

  // particles
  var pos = new Float32Array(COUNT * 3);
  for (var i = 0; i < COUNT; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 22;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 22;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 14;
  }
  var pg = new THREE.BufferGeometry();
  pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  var pm = new THREE.PointsMaterial({ size: 0.04, transparent: true, opacity: 0.55, sizeAttenuation: true });
  var points = new THREE.Points(pg, pm);
  scene.add(points);

  // one wireframe shape, kept to the side so it never covers text
  var shapeMat = new THREE.MeshBasicMaterial({ wireframe: true, transparent: true, opacity: 0.22 });
  var shape = new THREE.Mesh(new THREE.IcosahedronGeometry(2.2, 1), shapeMat);
  shape.position.set(small ? 2.2 : 5, 1.2, -2);
  scene.add(shape);

  function applyTheme() {
    var dark = root.getAttribute("data-theme") === "dark";
    var color = dark ? 0x7fffd4 : 0x0a7d6b;
    pm.color.setHex(color);
    shapeMat.color.setHex(color);
    pm.opacity = dark ? 0.6 : 0.5;
    shapeMat.opacity = dark ? 0.22 : 0.18;
  }
  applyTheme();
  new MutationObserver(applyTheme).observe(root, { attributes: true, attributeFilter: ["data-theme"] });

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  var mx = 0, my = 0;
  window.addEventListener("pointermove", function (e) {
    mx = (e.clientX / window.innerWidth - 0.5);
    my = (e.clientY / window.innerHeight - 0.5);
  });

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var running = true, last = performance.now();
  document.addEventListener("visibilitychange", function () {
    running = !document.hidden;
    if (running) { last = performance.now(); requestAnimationFrame(loop); }
  });

  function loop(now) {
    if (!running) return;
    var dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    var y = window.scrollY;
    if (!reduce) {
      points.rotation.y += dt * 0.02;
      shape.rotation.x += dt * 0.08;
      shape.rotation.y += dt * 0.12;
    }
    // gentle parallax from mouse + scroll
    camera.position.x += (mx * 0.8 - camera.position.x) * 0.04;
    camera.position.y += (-my * 0.6 - y * 0.0015 - camera.position.y) * 0.04;
    shape.position.y = 1.2 + y * 0.0012;
    camera.lookAt(0, camera.position.y * 0.3, 0);
    renderer.render(scene, camera);
    if (!reduce) requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();