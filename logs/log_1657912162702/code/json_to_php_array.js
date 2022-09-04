to_log = require('./lib/to_log.js');

function json_to_php_array() {
    file_text = fs.readFileSync('../in/json.txt', encoding = 'utf-8');

    file_text = file_text.replaceAll('": "', '=>');
    file_text = file_text.replaceAll('":"', '=>');
    file_text = file_text.replaceAll('{', '[');
    file_text = file_text.replaceAll('}', ']');

    log_files();
}


function log_files() {
    to_log.log_all({
        input: 'json.txt',
        output: 'php.txt',
        code: 'json_to_php_array.js'
    });
}

json_to_php_array();