call_mapping = {
    "show_functions": function(type) { return Introspect.introspect_functions(type); },
    "show_variables": function(type) { return Introspect.introspect_variables(type); },
}

function convert_result_to_text(results) {
    str_result = "";
    
    // show the values stored
    for (var key in results) {
        // use hasOwnProperty to filter out keys from the Object.prototype
        if (results.hasOwnProperty(key)) {
            str_result += key + ':' + results[key] + "\n";
        }
    }
    
    return str_result;
}

function setup_exports() {
    window['gen_code'] = gen_code;
}

function api_call(code, call_type) {
    // 'use strict';    
    var str_results = "";
    
    var ast = parse(code);
    
    // Regenerate the code for the classes
    // regenerate_code();
    
    return GlobalIntellisenseRoot.defun;
}