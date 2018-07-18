'use strict';

// Генератор файлов блока

// Использование: node createBlock.js [имя блока] [доп. расширения через пробел]

const fs = require('fs');
const projectConfig = require('./projectConfig.json');

const dirs = projectConfig.path.src;
const mkdirp = require('mkdirp');

const blockName = process.argv[2];                   // получим имя блока
const defaultExtensions = ['scss', 'md', 'pug', 'js']; // расширения по умолчанию
const extensions = uniqueArray(defaultExtensions.concat(process.argv.slice(3)));  // добавим введенные при вызове расширения (если есть)

// Если есть имя блока
if (blockName) {
  const dirPath = `${dirs.srcPath + '/' + dirs.blocksDirName}/${blockName}/`; // полный путь к создаваемой папке блока
  mkdirp(dirPath, (err) => {                                           // создаем
    // Если какая-то ошибка — покажем
    if (err) {
      console.error(`[NTH] Отмена операции: ${err}`);
    }

    // Нет ошибки, поехали!
    else {
      console.log(`[NTH] Создание папки ${dirPath} (если отсутствует)`);

      // Обходим массив расширений и создаем файлы, если они еще не созданы
      extensions.forEach((extension) => {
        const filePath = `${dirPath + blockName}.${extension}`; // полный путь к создаваемому файлу
        let fileContent = '';                                 // будущий контент файла
        let fileCreateMsg = '';                               // будущее сообщение в консоли при создании файла

        // Если это SCSS
        if (extension === 'scss') {
          fileContent = `\.${blockName} {\n\t$block-name: &;\n\t\n}\n`;
        }
        

        // Если это JS
        else if (extension === 'js') {
          fileContent = `module.exports = function () {\n\n}`;
        }

        // Если это md
        else if (extension === 'md') {
          fileContent = '';
        }

        // Если это pug
        else if (extension === 'pug') {
          fileContent = `mixin ${blockName}()\n\t`;
        }

        // Создаем файл, если он еще не существует
        if (fileExist(filePath) === false && extension !== 'img' && extension !== 'bg-img' && extension !== 'md') {
          fs.writeFile(filePath, fileContent, (err) => {
            if (err) {
              return console.log(`[NTH] Файл НЕ создан: ${err}`);
            }
            console.log(`[NTH] Файл создан: ${filePath}`);
            if (fileCreateMsg) {
              console.warn(fileCreateMsg);
            }
          });
        }
        else if (extension !== 'img' && extension !== 'bg-img' && extension !== 'md') {
          console.log(`[NTH] Файл НЕ создан: ${filePath} (уже существует)`);
        }
        else if (extension === 'md') {
          fs.writeFile(`${dirPath}readme.md`, fileContent, (err) => {
            if (err) {
              return console.log(`[NTH] Файл НЕ создан: ${err}`);
            }
            console.log(`[NTH] Файл создан: ${dirPath}readme.md`);
            if (fileCreateMsg) {
              console.warn(fileCreateMsg);
            }
          });
        }
      });

      // Добавим созданный блок в projectConfig.json
      let hasThisBlock = false;
      for (const block in projectConfig.blocks) {
        if (block === blockName) {
          hasThisBlock = true;
          break;
        }
      }
      if (!hasThisBlock) {
        projectConfig.blocks[blockName] = [];
        const newPackageJson = JSON.stringify(projectConfig, '', 2);
        fs.writeFile('./projectConfig.json', newPackageJson, (err) => {console.log(err);
          if (err){
            console.log('Ошибка записи');
          }
          else{
            console.log('[NTH] Подключение блока добавлено в projectConfig.json');
            createBlockFiles();
          }
        });
      }

    }
  });
} else {
  console.log('[NTH] Отмена операции: не указан блок');
}

// Оставить в массиве только уникальные значения (убрать повторы)
function uniqueArray(arr) {
  const objectTemp = {};
  for (let i = 0; i < arr.length; i++) {
    const str = arr[i];
    objectTemp[str] = true; // запомнить строку в виде свойства объекта
  }
  return Object.keys(objectTemp);
}

// Проверка существования файла
function fileExist(path) {
  const fs = require('fs');
  try {
    fs.statSync(path);
  } catch (err) {
    return !(err && err.code === 'ENOENT');
  }
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