fs = require('fs');

version = parseInt(Date.now() / 1000)
options = {
    in_dir: '../in/',
    out_dir: '../out/',
    code_dir: './',
    log_code_dir: '../logs/log_' + version + '/code/',
    log_in_dir: '../logs/log_' + version + '/in/',
    log_out_dir: '../logs/log_' + version + '/out/',
    encoding: 'utf-8'
}

async function log_all(data) {
    log_input_file(data);
    log_output_file(data);
    log_code_file(data);
    fs.appendFileSync
}

async function log_file(type, input, output) {
    var file_text;
    file_text = fs.readFileSync(options[type + '_dir'] + input, encoding = options.encoding);
    fs.writeFileSync(options['log_' + type + '_dir'] + output, file_text);
}

async function log_input_file(data) {
    if (!data.input) {
        var files;
        files = fs.readdirSync(in_dir);
        if (files.length) {
            data.input = files[0];
        } else {
            console.error('none file defined as input');
            return false;
        }
    }
    if (!data.in_output) {
        data.in_output = data.input;
    }
    log_file('in', data.input, data.in_output);
}

async function log_output_file(data) {
    if (!data.output) {
        var files;
        files = fs.readdirSync(options.out_dir);
        if (files.length) {
            data.output = files[0];
        } else {
            console.error('none file defined as input');
            return false;
        }
    }
    if (!data.out_output) {
        data.out_output = data.output;
    }
    log_file('out', data.output, data.out_output);
}

async function log_code_file(data) {
    if (!data.code) {
        var files;
        files = fs.readdirSync(options.code_dir);
        if (files.length) {
            data.code = files[0];
        } else {
            console.error('none file defined as input');
            return false;
        }
    }
    if (!data.code_output) {
        data.code_output = data.code_output;
    }
    log_file('code', data.code, data.code_output);
}

module.exports = { log_all, log_input_file, log_code_file, log_output_file }