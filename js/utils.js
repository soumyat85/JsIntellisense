/* -----[ Utilities ]----- */
function curry(f) {
        var args = slice(arguments, 1);
        return function() { return f.apply(this, args.concat(slice(arguments))); };
};

function prog1(ret) {
        if (ret instanceof Function)
                ret = ret();
        for (var i = 1, n = arguments.length; --n > 0; ++i)
                arguments[i]();
        return ret;
};

function array_to_hash(a) {
        var ret = {};
        for (var i = 0; i < a.length; ++i)
                ret[a[i]] = true;
        return ret;
};

function slice(a, start) {
        return Array.prototype.slice.call(a, start || 0);
};

function characters(str) {
        return str.split("");
};

function member(name, array) {
        for (var i = array.length; --i >= 0;)
                if (array[i] == name)
                        return true;
        return false;
};

function HOP(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
};

var warn = function() {};

function serialize(serialized_ast, ast) {
    // Serialize an ast to turn it into a single 1D array
    for (var i = 0; i < ast.length; ++i) {
        if (Introspect.typeOf(ast[i]) == "object") {
            serialized_ast = serialize(serialized_ast, ast[i]);
        }
        else {
            serialized_ast.push(ast[i]);
        }
    }
    
    return serialized_ast;
}

function get_serialized_ast(ast) {
    var serialized_ast = [];
    serialized_ast = serialize(serialized_ast, ast);
    return serialized_ast;
}

function array_contains_type(serialized_array, search_term) {
    for (var i = 0; i < serialized_array.length; ++i) {
        if (serialized_array[i] == search_term) {
            return true;
        }
    }
    
    return false;
}