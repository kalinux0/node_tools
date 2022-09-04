fs = require('fs');

var args = process.argv.slice(2);
if (!args.length) {
    console.error('Please enter a directory');
    process.exit(0);
}
var project_dir = args[0];
/*temp_dir = __filename.split('\\').slice(0, -1).join('/') + '/temp/';
temp_file = temp_dir + 'calc_file_line_character_counts.json';
if (!fs.existsSync(temp_dir)) {
    fs.mkdirSync(temp_dir);
}
fs.writeFileSync(temp_file, '');*/

function array_for_each_file(dir, command) {

    data = [];

    function start(dir) {
        findDir(dir);
    }

    function findDir(mem_file_path) {
        var folders, folder;
        folders = fs.readdirSync(mem_file_path);
        for (folder in folders) {
            folder = folders[folder];
            folder = mem_file_path + '/' + folder;
            if (fs.lstatSync(folder).isDirectory()) {
                findDir(folder);
            } else {
                data.push(command(folder));
            }
        }
    }

    start(dir);

    return data;
}

function read_line_and_character_count(file_path) {
    var file_text, line_count, character_count;
    file_text = fs.readFileSync(file_path, encoding = 'utf-8');
    line_count = file_text.split("\n").length;
    character_count = file_text.length;
    return {
        line_count: line_count,
        character_count: character_count
    };
}

function read_line_and_character_counts(folder_path) {
    var infos, info, info_len, total_line_count, total_character_count;
    infos = array_for_each_file(folder_path, read_line_and_character_count);
    total_line_count = 0;
    total_character_count = 0;
    info_len = infos.length;

    for (file_count = 0; file_count < info_len; file_count += 1) {
        info = infos[file_count];
        total_line_count += info.line_count;
        total_character_count += info.character_count;
    }

    console.info('File count: ' + file_count,
        '\nLine count: ' + total_line_count,
        '\nCharacter count: ' + total_character_count);
    console.timeEnd('Execution Time');
}

console.time('Execution Time');
read_line_and_character_counts(project_dir);