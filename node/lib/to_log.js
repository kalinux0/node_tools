fs = require('fs');

version = Date.now();
log_dir = '../logs/log_' + version + '/';
options = {
    in_dir: '../in/',
    out_dir: '../out/',
    code_dir: './',
    log_code_dir: log_dir + 'code/',
    log_in_dir: log_dir + 'in/',
    log_out_dir: log_dir + 'out/',
    logs: '../logs/logs.txt',
    encoding: 'utf-8'
}

async function log_all(data) {
    var old_data, new_data;

    fs.mkdirSync(log_dir);

    log_input_file(data);
    log_output_file(data);
    log_code_file(data);

    old_data = fs.readFileSync(options.logs, encoding = 'utf-8');
    old_data = JSON.parse(old_data);
    old_data[version] = data;
    new_data = JSON.stringify(old_data);

    fs.writeFileSync(options.logs, new_data);
}

async function log_file(type, input, output) {
    var file_text, file_path;
    file_path = options[type + '_dir'] + input;
    if (fs.existsSync(file_path)) {
        file_text = fs.readFileSync(file_path, encoding = options.encoding);
        fs.writeFileSync(options['log_' + type + '_dir'] + output, file_text);
    }
}

async function log_input_file(data) {
    fs.mkdirSync(options.log_in_dir);
    if (!data.input) {
        var files;
        files = fs.readdirSync(in_dir);
        if (files.length) {
            data.input = files[0];
        } else {
            console.error('none input file defined as input');
            return false;
        }
    }
    if (!data.in_output) {
        data.in_output = data.input;
    }
    log_file('in', data.input, data.in_output);
}

async function log_output_file(data) {
    fs.mkdirSync(options.log_out_dir);
    if (!data.output) {
        var files;
        files = fs.readdirSync(options.out_dir);
        if (files.length) {
            data.output = files[0];
        } else {
            console.error('none output file defined as input');
            return false;
        }
    }
    if (!data.out_output) {
        data.out_output = data.output;
    }
    log_file('out', data.output, data.out_output);
}

async function log_code_file(data) {
    fs.mkdirSync(options.log_code_dir);
    if (!data.code) {
        console.error('none code file defined as input');
        return false;
    }
    if (!data.code_output) {
        data.code_output = data.code;
    }
    log_file('code', data.code, data.code_output);
}

module.exports = { log_all, log_input_file, log_code_file, log_output_file }