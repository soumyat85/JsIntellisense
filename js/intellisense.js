////////////////////////////////////// Helper Functions ////////////////////////////////////////

function parse_expr(expr) {
    var str = "";
    while (expr.child != null) {
        str += expr.name + ".";
        expr = expr.child;
    }
    
    str += expr.name;
    return str;
}
    
/////////////////////////////////////////////////////// Helper Functions ////////////////////////////////////////////////
// Walk the ast tree
function walk_tree(ast) {
    var walker = {
        "assign" : function() {
            var assign_expr = new assign_expression();
            assign_expr.type = "assign_expr";
            assign_expr.left_expr = walk_tree(ast[2]);
            assign_expr.right_expr = walk_tree(ast[3]);
            assign_expr.name = assign_expr.left_expr.name;
            
            return assign_expr;
        },
        
        "var" : function() {
            var assign_expr = new assign_expression();
            assign_expr.type = "assign_expr";
            
            assign_expr.left_expr = new type_object();
            assign_expr.left_expr.name = ast[1][0][0];
            assign_expr.right_expr = walk_tree(ast[1][0][1]);
            assign_expr.name = assign_expr.left_expr.name;
            
            return assign_expr;            
        },
        
        "stat" : function() {
            return walk_tree(ast[1]);
        },
        
        "dot" : function() {
            var dot_obj = walk_tree(ast[1]);
            dot_obj.child = new type_object();
            dot_obj.child.name = ast[2];
            dot_obj.child.parent = dot_obj;
            return dot_obj;
        },
        
        "name" : function() {
            var new_obj = new type_object();
            new_obj.type = "name";
            new_obj.name = ast[1];
            return new_obj;
        },
        
        "new" : function() {
            var expr = walk_tree(ast[1]);
            expr.type = "composition";
            return expr;
        },
        
        "function" : function() {
            var func = new type_function("function", ast[1], ["toplevel", [ast]], ast[2]);
            return func;
        },
        
        "defun" : function() {            
            var func = new type_function("defun", ast[1], ["toplevel", [ast]], ast[2]);
            return func;
        },
        
        "return" : function() {
            var return_expr = new type_expression();
            return_expr.type = "return_expr";
            return_expr.expr = walk_tree(ast[1]);
            return return_expr;
        },
        
        "string" : function() {
            var obj = new type_object();
            obj.type = "string";
            obj.value = ast[1];
            return obj;
        },
        
        "num" : function() {
            var obj = new type_object();
            obj.type = "num";
            obj.value = ast[1];
            return obj;
        },
        
        "binary" : function() {
            var binary_expr = new binary_expression();
            binary_expr.type = "binary_expr";
            binary_expr.binary_lhs = walk_tree(ast[2]);
            binary_expr.binary_rhs = walk_tree(ast[3]);
        },
    }
    
    var parent = ast[0];
    
    var func = walker[parent];
    
    return func(ast);
}

var _is_ = {    
    "prototype" : function(ast) {
        var serialized_ast = get_serialized_ast(ast);
        var is_prototype_stmt = array_contains_type(serialized_ast, "prototype");
        return is_prototype_stmt;
    }
}

function parse_defun(func_name, ast) {
    var defun_func = walk_tree(ast);
    GlobalIntellisenseRoot.add_obj("defun", defun_func);
    return defun_func;
}

function parse_prototype_ast(ast) {
    var prototype_expr = null;
    prototype_expr = walk_tree(ast);
    
    // Find the classes to setup the inheritance
    var inherited_class = GlobalIntellisenseRoot.get_defun(prototype_expr.left_expr.name);
    var base_class = GlobalIntellisenseRoot.get_defun(prototype_expr.right_expr.name);
    
    inherited_class.super_class.push(base_class.name);
    base_class.sub_class.push(inherited_class.name);
    
    return prototype_expr;
    // Prototype Expression.
}

function parse_global_vars(ast) {
    var global_var_expr = walk_tree(ast);
    GlobalIntellisenseRoot.add_obj("global_var", global_var_expr);
}

// Get the intellisense function to run
function parse_composition_ast(ast, intl_func) {
    var search_item = "new";
    
    var lvalue = new type_object();
    var rvalue = new type_object();
}

function parse_local_composition_ast(ast) {
    ast = ["toplevel", [ast]];
    var lvalue = new Object();
    lvalue.type = ast[1][0];
    lvalue.value = ast[0];
    
    var rvalue = new Object();
    rvalue.type = ast[1][0];
    rvalue.value = ast[1][1];
}

function regenerate_code() {
    for (var func_name in GlobalIntellisenseRoot.defun) {
        var func = GlobalIntellisenseRoot.defun[func_name];
        func.generate_code();
    }
}