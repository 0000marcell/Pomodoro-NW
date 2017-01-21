let obj = { name: null, sirname: null};

let funcs = {
  addName(name){
    this.name = name;
    return this;
  },
  addSirName(sirname){
    this.sirname = sirname;
    return this;
  },
  print(){
    console.log(`${this.name} ${this.sirname}`);
    return this;
  }
}

let objFunc = Object.assign(obj, funcs);

objFunc.addName('marcell').addSirName('cruz').print();
