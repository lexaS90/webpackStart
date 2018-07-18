'use strict';

const fs = require('fs');
const projectConfig = require('./projectConfig.json');
const dirs = projectConfig.path.src;

const blockName = process.argv[2];  // получим имя блока


// Если есть имя блока
if (blockName) {
    const dirPath = `${dirs.srcPath + '/' + dirs.blocksDirName}/${blockName}/`;

    // Добавим созданный блок в projectConfig.json
    let hasThisBlock = false;
    for (const block in projectConfig.blocks) {
        if (block === blockName) {
            hasThisBlock = true;
            break;
        }
    }

    if (hasThisBlock) {
        delete(projectConfig.blocks[blockName]);
        const newPackageJson = JSON.stringify(projectConfig, '', 2);
        fs.writeFile('./projectConfig.json', newPackageJson, (err) => {
            if (err){
              console.log('Ошибка записи');
            }
            else{
              console.log('[NTH] Блок удален с projectConfig.json');
              createBlockFiles();
              deleteFolderRecursive(dirPath);
            }
          });
    }
    else{
        console.log('Блок не найден');
    }
}
else{
    return console.log('[NTH] Отмена операции: не указан блок');
}



function createBlockFiles(){
    delete require.cache[require.resolve('./projectConfig.json')];
    
    // Получение настроек проекта из projectConfig.json
    let dirs = projectConfig.path.src;
  
    let lists = getBlocksList(projectConfig);
  
    // Формирование и запись диспетчера подключений (_blocks.scss)
  
    // Сообщение, записываемое в стилевой файл
    let styleFileMsg = '/*!*\n * ВНИМАНИЕ! Этот файл генерируется автоматически.\n * Не пишите сюда ничего вручную, все такие правки будут потеряны при следующей компиляции.\n */\n\n';
  
    let styleImports = styleFileMsg;
    lists.css.forEach(function(blockPath) {
    styleImports += '@import \''+blockPath+'\';\n';
    });
    fs.writeFileSync(dirs.srcPath + '/' + 'styles/_blocks.scss', styleImports);
  
  }
  
  
  
      /**
   * Вернет объект с обрабатываемыми файлами и папками
   * @param  {object}
   * @return {object}
   */
  function getBlocksList(config){
  
    let res = {
      'css': [],
      'js': [],
      'img': [],
      'pug': [],
      'blocksDirs': [],
    };
  
    // Обходим массив с блоками проекта
    for (let blockName in config.blocks) {
      var blockPath = './' + config.path.src.srcPath + '/' + config.path.src.blocksDirName + '/' + blockName + '/';
  
      if(fileExist(blockPath)) {
        // Стили
        if(fileExist(blockPath + blockName + '.scss')){
          res.css.push(blockPath + blockName + '.scss');
         
        }
        else {
          console.log('---------- Блок ' + blockName + ' указан как используемый, но не имеет scss-файла.');
        }
  
  
        // Разметка (Pug)
        if(fileExist(blockPath + blockName + '.pug')){
          res.pug.push('../../' + blockPath + '/' + blockName + '.pug');
        }
        else {
          console.log('---------- Блок ' + blockName + ' указан как используемый, но не имеет pug-файла.');
        }
  
        // Скрипты
        if(fileExist(blockPath + blockName + '.js')){
          res.js.push('../../' + blockPath + '/' + blockName + '.js');
        }
        else {
          console.log('---------- Блок ' + blockName + ' указан как используемый, но не имеет js-файла.');
        }
    
    }
  
    }
  
    return res;
  };
  
  /**
  * Проверка существования файла или папки
  * @param  {string} path      Путь до файла или папки]
  * @return {boolean}
  */
  function fileExist(filepath){
    let flag = true;
    try{
      fs.accessSync(filepath, fs.F_OK);
    }catch(e){
      flag = false;
    }
    return flag;
  };

  var deleteFolderRecursive = function(path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function(file, index){
        var curPath = path + "/" + file;
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  };