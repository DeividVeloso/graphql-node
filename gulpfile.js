const gulp = require("gulp");
const clean = require("gulp-clean");
const ts = require("gulp-typescript");
//Cria a configuracao do TS de acordo com meu config
const tsProject = ts.createProject("tsconfig.json");
gulp.task("scripts", ["static"], () => {
  //Transpila de ts para js
  const tsResult = tsProject.src().pipe(tsProject());
  //PEga o JS e joga na pasta dist
  return tsResult.js.pipe(gulp.dest("dist"));
});
gulp.task("static", ["clean"], () => {
  //Acha tudo que for .json e copia para a pasta dist
  return gulp.src(["src/**/*.json"]).pipe(gulp.dest("dist"));
});
gulp.task("clean", () => {
  //Pega o que estiver na dist e apaga
  return gulp.src("dist").pipe(clean());
});
gulp.task("build", ["scripts"]);
gulp.task("watch", ["build"], () => {
  return gulp.watch(["src/**/*.ts", "src/**/*.json"], ["build"]);
});
gulp.task("default", ["watch"]);
