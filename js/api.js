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

function loadScript(src_code, callback)
{
    // adding the script tag to the head as suggested before
   var head = document.getElementsByTagName('head')[0];
   var script = document.createElement('script');
   script.type = 'text/javascript';
   script.src = src_code;

   // then bind the event to the callback function 
   // there are several events for cross browser compatibility
   script.onreadystatechange = callback;
   script.onload = callback;

   // fire the loading
   head.appendChild(script);
}

function my_callback() {
    alert('Script loaded');
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