/* Dark theme only + interactive 3D skills sphere */
(function () {
  document.documentElement.setAttribute("data-theme", "dark");

  var box = document.getElementById("sphere");
  if (!box) return;
  var words = ["HTML", "CSS", "JavaScript", "React", "Next.js", "Redux", "Bootstrap", "Flutter", "Dart",
    "Spring Boot", "Node.js", "REST APIs", "PostgreSQL", "MongoDB", "Docker", "CI/CD",
    "GitHub Actions", "Linux", "Git", "Postman"];
  var els = [], pts = [], paused = false, ay = 0, ax = 0.25;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  words.forEach(function (w, i) {
    var phi = Math.acos(1 - 2 * (i + 0.5) / words.length);
    var th = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
    pts.push([Math.sin(phi) * Math.cos(th), Math.cos(phi), Math.sin(phi) * Math.sin(th)]);
    var s = document.createElement("span");
    s.textContent = w;
    box.appendChild(s);
    els.push(s);
  });
  box.addEventListener("mouseenter", function () { paused = true; });
  box.addEventListener("mouseleave", function () { paused = false; });
  box.addEventListener("pointermove", function (e) {
    var r = box.getBoundingClientRect();
    ax = ((e.clientY - r.top) / r.height - 0.5) * 0.8;
  });

  function frame() {
    if (!paused && !reduce) ay += 0.006;
    var R = Math.min(box.clientWidth, box.clientHeight) * 0.42;
    var cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(ax), sx = Math.sin(ax);
    for (var i = 0; i < els.length; i++) {
      var p = pts[i];
      var x = p[0] * cy + p[2] * sy;
      var z0 = -p[0] * sy + p[2] * cy;
      var y = p[1] * cx - z0 * sx;
      var z = p[1] * sx + z0 * cx;
      var k = (z + 2) / 3;
      els[i].style.transform = "translate(-50%,-50%) translate(" + (x * R * 1.6).toFixed(1) + "px," + (y * R).toFixed(1) + "px) scale(" + (0.6 + k * 0.6).toFixed(2) + ")";
      els[i].style.opacity = (0.25 + k * 0.75).toFixed(2);
      els[i].style.zIndex = Math.round(k * 10);
    }
    if (!reduce) requestAnimationFrame(frame);
  }
  frame();
})();