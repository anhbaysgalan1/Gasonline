const fs = require('fs')
String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
}
String.prototype.plural = function (revert) {

  var plural = {
    '(quiz)$': "$1zes",
    '^(ox)$': "$1en",
    '([m|l])ouse$': "$1ice",
    '(matr|vert|ind)ix|ex$': "$1ices",
    '(x|ch|ss|sh)$': "$1es",
    '([^aeiouy]|qu)y$': "$1ies",
    '(hive)$': "$1s",
    '(?:([^f])fe|([lr])f)$': "$1$2ves",
    '(shea|lea|loa|thie)f$': "$1ves",
    'sis$': "ses",
    '([ti])um$': "$1a",
    '(tomat|potat|ech|her|vet)o$': "$1oes",
    '(bu)s$': "$1ses",
    '(alias)$': "$1es",
    '(octop)us$': "$1i",
    '(ax|test)is$': "$1es",
    '(us)$': "$1es",
    '([^s]+)$': "$1s"
  };

  var singular = {
    '(quiz)zes$': "$1",
    '(matr)ices$': "$1ix",
    '(vert|ind)ices$': "$1ex",
    '^(ox)en$': "$1",
    '(alias)es$': "$1",
    '(octop|vir)i$': "$1us",
    '(cris|ax|test)es$': "$1is",
    '(shoe)s$': "$1",
    '(o)es$': "$1",
    '(bus)es$': "$1",
    '([m|l])ice$': "$1ouse",
    '(x|ch|ss|sh)es$': "$1",
    '(m)ovies$': "$1ovie",
    '(s)eries$': "$1eries",
    '([^aeiouy]|qu)ies$': "$1y",
    '([lr])ves$': "$1f",
    '(tive)s$': "$1",
    '(hive)s$': "$1",
    '(li|wi|kni)ves$': "$1fe",
    '(shea|loa|lea|thie)ves$': "$1f",
    '(^analy)ses$': "$1sis",
    '((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$': "$1$2sis",
    '([ti])a$': "$1um",
    '(n)ews$': "$1ews",
    '(h|bl)ouses$': "$1ouse",
    '(corpse)s$': "$1",
    '(us)es$': "$1",
    's$': ""
  };

  var irregular = {
    'move': 'moves',
    'foot': 'feet',
    'goose': 'geese',
    'sex': 'sexes',
    'child': 'children',
    'man': 'men',
    'tooth': 'teeth',
    'person': 'people'
  };

  var uncountable = [
    'sheep',
    'fish',
    'deer',
    'moose',
    'series',
    'species',
    'money',
    'rice',
    'information',
    'equipment'
  ];

  // save some time in the case that singular and plural are the same
  if (uncountable.indexOf(this.toLowerCase()) >= 0)
    return this;

  // check for irregular forms
  for (word in irregular) {

    if (revert) {
      var pattern = new RegExp(irregular[word] + '$', 'i');
      var replace = word;
    } else {
      var pattern = new RegExp(word + '$', 'i');
      var replace = irregular[word];
    }
    if (pattern.test(this))
      return this.replace(pattern, replace);
  }

  if (revert) var array = singular;
  else var array = plural;

  // check for matches using regular expressions
  for (reg in array) {

    var pattern = new RegExp(reg, 'i');

    if (pattern.test(this))
      return this.replace(pattern, array[reg]);
  }

  return this;
}

const generator = {
  TypeDefined: {
    action: {
      function: 'makeFile',
      dir: './src/actions/',
      template: 'Action.template.jsx',
      fileName: "${name}Action.jsx",
      __NAME__: "${name}",
      __CLASSNAME__: "${name}Action",
      __URLNAME__: "${name.toLowerCase().plural()}",
    },
    reducer: {
      function: 'makeReducer',
      dir: './src/reducers/',
      template: 'Reducer.template.jsx',
      fileName: "${name}Reducer.jsx",
      rootReducer: 'RootReducer.jsx',
      __NAME__: "${name}",
      __CLASSNAME__: "${name}Reducer",
      __REDUXNAME__: "${name.toLowerCase()}"
    },
    route: {
      function: 'makeRoute',
      dir: './src/config/',
      fileName: "routes.jsx",
      __NAME__: "${name}",
      __SIDEBARNAME__: "${name.toLowerCase()}",
      __URLNAME__: "${name.toLowerCase().plural()}",
      __COMPONENTNAME__: "${name.capitalize()}"
    },
    sidebar: {
      function: 'makeSidebar',
      dir: './src/config/',
      fileName: "sidebar.jsx",
      __NAME__: "${name}",
      __SIDEBARNAME__: "${name.toLowerCase()}",
      __URLNAME__: "${name.toLowerCase().plural()}",
      __COMPONENTNAME__: "${name.capitalize()}"
    },
    container:{
      function: 'makeFolderAndFiles',
      dir: './src/containers/',
      templateDir: 'ContainerTemplate/',
      dirName: "${name.capitalize()}/",
      __DIRVIEWNAME__: "${name.capitalize()}",
      __ACTIONNAME__: "${name}Action",
      __REDUXNAME__: "${name.toLowerCase()}",
      __URLNAME__: "${name.toLowerCase().plural()}",
    },
    view:{
      function: 'makeFolderAndFiles',
      dir: './src/views/',
      templateDir: 'ViewTemplate/',
      dirName: "${name.capitalize()}/",
      __URLNAME__: "${name.toLowerCase().plural()}",
      __COMPONENTNAME__: "${name.capitalize()}",
    }
  },

  getInfoByType: function () {
    let types = process.argv[3]
    if (types == "all") {
      types = Object.keys(this.TypeDefined)
    }
    else {
      types = types.split(",")
    }
    let result = []
    for (let type of types) {
      let typeSelected = this.TypeDefined[type]
      let name = process.argv[4].capitalize()
      let obj = {}
      for (let key in typeSelected) {
        eval(`obj["${key}"] = \`${typeSelected[key]}\``)
      }
      result.push(obj)
    }
    return result
  },

  makeReducer: function(params){
    this.makeFile(params)
    const { dir, rootReducer } = params
    let content = fs.readFileSync(`${dir}${rootReducer}`).toString()
    content = content.replace("/*__AUTOIMPORTREDUCER__*/",
    `import ${params.__CLASSNAME__} from './${params.__CLASSNAME__}';\n/*__AUTOIMPORTREDUCER__*/`)

    content = content.replace("/*__AUTOREDUCER__*/",
      `${params.__REDUXNAME__}: ${params.__CLASSNAME__},\n  /*__AUTOREDUCER__*/`)

      fs.writeFile(`${dir}${rootReducer}`, content, function (err) {
      if (err) { return console.log(err); }
      console.log(`The file ${dir}${rootReducer} was updated!`);
    });
  },

  makeRoute: function(params){
    const { dir, fileName } = params
    let content = fs.readFileSync(`${dir}${fileName}`).toString()

    let importString = ""
    let routeString = `  //${params.__NAME__}\n`
    let routes = {
      'index': {
        pathUrl: ''
      },
      'create': {
        pathUrl: '/create'
      },
      'edit': {
        pathUrl: '/:id'
      }
    }

    for (let route in routes){
      let routeCapitalize = route.capitalize()

      importString += `const ${params.__COMPONENTNAME__}${routeCapitalize} = lazy(() => import('containers/${params.__COMPONENTNAME__}/${routeCapitalize}'))\n`
      routeString+= `  {\n`
      routeString+= `    path: "/${params.__URLNAME__}${routes[route]['pathUrl']}",\n`
      routeString+= `    name: '${params.__SIDEBARNAME__}.${route}',\n`
      routeString+= `    title: () => I18n.t("Breadcrumb.${params.__SIDEBARNAME__}${routeCapitalize}"),\n`
      routeString+= `    component: () => <${params.__COMPONENTNAME__}${routeCapitalize} />,\n`
      routeString+= `    exact: true,\n`
      routeString+= `    sidebarName: '${params.__SIDEBARNAME__}.index'\n`
      routeString+= `  },\n`
    }
    importString += '/*__AUTOIMPORTROUTE__*/'
    content = content.replace("/*__AUTOIMPORTROUTE__*/",importString)

    routeString += '/*__AUTOROUTE__*/'
    content = content.replace("/*__AUTOROUTE__*/", routeString)

      fs.writeFile(`${dir}${fileName}`, content, function (err) {
      if (err) { return console.log(err); }
      console.log(`The file ${dir}${fileName} was updated!`);
    });
  },

  makeSidebar: function(params){
    const { dir, fileName } = params
    let content = fs.readFileSync(`${dir}${fileName}`).toString()

    content = content.replace("/*__AUTOIMPORTSIDEBAR__*/",
    `import ${params.__COMPONENTNAME__}Index from 'containers/${params.__COMPONENTNAME__}/Index'\n/*__AUTOIMPORTSIDEBAR__*/`)

    let routeString = ""
      routeString+= `  {\n`
      routeString+= `    path: "/${params.__URLNAME__}",\n`
      routeString+= `    name: '${params.__SIDEBARNAME__}.index',\n`
      routeString+= `    title: I18n.t("Sidebar.${params.__SIDEBARNAME__}"),\n`
      routeString+= `    icon: <Icon>star</Icon>,\n`
      routeString+= `    component: () => <${params.__COMPONENTNAME__}Index />,\n`
      routeString+= `  },\n`
      routeString+= `/*__AUTOSIDEBAR__*/`
    content = content.replace("/*__AUTOSIDEBAR__*/", routeString)

      fs.writeFile(`${dir}${fileName}`, content, function (err) {
      if (err) { return console.log(err); }
      console.log(`The file ${dir}${fileName} was updated!`);
    });
  },

  makeFile: function (typeParams) {
    let { fileName, dir, template } = typeParams
    if (fs.existsSync(`${dir}${fileName}`)) {
      //    return console.error(`${dir}${fileName} was exists! Please remove before continue....`)
    }
    console.log(`The program will automatically create the ${fileName} file in the folder: ${dir}`)
    var content = fs.readFileSync(`${dir}${template}`).toString()
    for (let key in typeParams) {
      if (key.indexOf("__") === -1) continue;
      content = content.replace(new RegExp(key, "gi"), typeParams[key])
    }

    fs.writeFile(`${dir}${fileName}`, content, function (err) {
      if (err) { return console.log(err); }
      console.log(`The file ${dir}${fileName} was generated!`);
    });
  },

  makeDir: function(path){
    try {
      fs.mkdirSync(path)
    } catch (err) {
      console.log(err)
    }
  },

  makeFolderAndFiles: async function(typeParams){
    let templateDir = typeParams.dir + typeParams.templateDir
    let destinationDir = typeParams.dir + typeParams.dirName
    this.makeDir(destinationDir)
    fs.readdirSync(templateDir).forEach(file => {
      this.makeFile({
        ...typeParams,
        dir: typeParams.dir,
        template: typeParams.templateDir + file,
        fileName: typeParams.dirName + file,
        __FILENAME__: file,
      })
    })
  },

  run: async function () {
    const action = process.argv[2]
    if (action == "make") {
      let types = this.getInfoByType()
      for (type of types) {
        this[type['function']](type)
      }
    }
    else if (action == "remove") {
      this.removeFile()
    }
  }
}

const run = generator.run.bind(generator);
run();
