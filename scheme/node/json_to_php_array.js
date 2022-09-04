to_log = require('./lib/to_log.js');

to_log.log_file_with_code({
    input: 'json.txt',
    output: 'php.txt',
    code: 'json_to_php_array.js'
});